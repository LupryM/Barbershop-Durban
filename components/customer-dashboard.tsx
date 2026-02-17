'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, X, Edit2, LogOut, Plus, Home } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { User } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';

interface Appointment {
  id: number;
  service_name: string;
  service_price: string;
  service_duration: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  barber_name: string;
  created_at: string;
}

export function CustomerDashboard({ user }: { user: User }) {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      
      if (response.ok) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Appointment cancelled');
        fetchAppointments();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to cancel appointment');
      }
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      // silently fail
    }
  };

  const upcoming = appointments.filter(a => 
    a.status !== 'cancelled' && a.status !== 'completed'
  );
  const past = appointments.filter(a => 
    a.status === 'completed' || a.status === 'cancelled'
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/logo.jpeg" alt="Xclusive Barber" width={40} height={40} />
            <div>
              <h1 className="text-xl font-light tracking-tighter">MY APPOINTMENTS</h1>
              <p className="text-white/40 text-xs">Welcome back, {user.name || 'Guest'}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
              <Home className="w-3 h-3" /> Home
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Book Button */}
        <div className="mb-12">
          <button
            onClick={() => router.push('/#book')}
            className="border border-white/20 text-white px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-white hover:text-black transition-all flex items-center gap-3"
          >
            <Plus className="w-4 h-4" />
            Book New Appointment
          </button>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="mt-6 text-white/40 text-sm">Loading appointments...</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Upcoming */}
            <section>
              <span className="text-white/40 uppercase tracking-widest text-xs mb-6 block">Upcoming</span>
              {upcoming.length === 0 ? (
                <div className="border border-white/10 p-16 text-center">
                  <Calendar className="w-12 h-12 text-white/20 mx-auto mb-6" />
                  <h3 className="text-xl font-light mb-2">No upcoming appointments</h3>
                  <p className="text-white/40 text-sm mb-8">Book your next grooming session today</p>
                  <button
                    onClick={() => router.push('/#book')}
                    className="border border-white/20 text-white px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-white hover:text-black transition-all"
                  >
                    Book Now
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {upcoming.map((appointment) => (
                    <div key={appointment.id} className="border border-white/10 p-6 hover:border-white/20 transition-colors">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-lg font-light mb-1">{appointment.service_name}</h3>
                          <p className="text-xs text-white/40">with {appointment.barber_name}</p>
                        </div>
                        <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-medium ${
                          appointment.status === 'confirmed' 
                            ? 'bg-white/10 text-white/80' 
                            : 'bg-white/5 text-white/40'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-white/60">
                          <Calendar className="w-4 h-4 text-white/30" />
                          {format(new Date(appointment.appointment_date), 'EEEE, MMMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white/60">
                          <Clock className="w-4 h-4 text-white/30" />
                          {appointment.appointment_time} ({appointment.service_duration})
                        </div>
                        <div className="text-sm font-medium text-white/80">{appointment.service_price}</div>
                      </div>

                      <div className="flex gap-3 pt-6 border-t border-white/5">
                        <button
                          onClick={() => router.push('/#book')}
                          className="flex-1 border border-white/10 text-white/60 px-4 py-2 text-xs uppercase tracking-widest hover:border-white/30 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Edit2 className="w-3 h-3" /> Reschedule
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="flex-1 border border-white/10 text-white/40 px-4 py-2 text-xs uppercase tracking-widest hover:border-white/30 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Past */}
            {past.length > 0 && (
              <section>
                <span className="text-white/40 uppercase tracking-widest text-xs mb-6 block">History</span>
                <div className="border border-white/10 overflow-hidden">
                  <table className="w-full">
                    <thead className="border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-medium text-white/30 uppercase tracking-widest">Service</th>
                        <th className="px-6 py-4 text-left text-[10px] font-medium text-white/30 uppercase tracking-widest">Barber</th>
                        <th className="px-6 py-4 text-left text-[10px] font-medium text-white/30 uppercase tracking-widest">Date</th>
                        <th className="px-6 py-4 text-left text-[10px] font-medium text-white/30 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {past.map((appointment) => (
                        <tr key={appointment.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="px-6 py-4 text-sm text-white/60">{appointment.service_name}</td>
                          <td className="px-6 py-4 text-sm text-white/40">{appointment.barber_name}</td>
                          <td className="px-6 py-4 text-sm text-white/40">
                            {format(new Date(appointment.appointment_date), 'MMM d, yyyy')}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] uppercase tracking-widest ${
                              appointment.status === 'completed' ? 'text-white/40' : 'text-white/20'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
