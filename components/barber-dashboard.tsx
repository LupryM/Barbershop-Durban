'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, LogOut, Home } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { User } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';

interface Appointment {
  id: number;
  service_name: string;
  service_price: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  customer_name: string;
  customer_phone: string;
}

export function BarberDashboard({ user }: { user: User }) {
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
      if (response.ok) setAppointments(data.appointments);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const upcoming = appointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/logo.jpeg" alt="Xclusive Barber" width={40} height={40} />
            <div>
              <h1 className="text-xl font-light tracking-tighter">MY SCHEDULE</h1>
              <p className="text-white/40 text-xs">Welcome, {user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
              <Home className="w-3 h-3" /> Home
            </Link>
            <button onClick={handleLogout} className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
              <LogOut className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <span className="text-white/40 uppercase tracking-widest text-xs mb-6 block">Upcoming Appointments</span>
        
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : upcoming.length === 0 ? (
          <div className="border border-white/10 p-16 text-center">
            <p className="text-white/40 text-sm">No upcoming appointments</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {upcoming.map((appointment) => (
              <div key={appointment.id} className="border border-white/10 p-6 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-light">{appointment.service_name}</h3>
                    <p className="text-xs text-white/40 mt-1">{appointment.customer_name}</p>
                    <p className="text-xs text-white/30">{appointment.customer_phone}</p>
                  </div>
                  <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-medium ${
                    appointment.status === 'confirmed' ? 'bg-white/10 text-white/80' : 'bg-white/5 text-white/40'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <Calendar className="w-4 h-4 text-white/30" />
                    {format(new Date(appointment.appointment_date), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <Clock className="w-4 h-4 text-white/30" />
                    {appointment.appointment_time}
                  </div>
                  <div className="text-sm font-medium text-white/80">{appointment.service_price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
