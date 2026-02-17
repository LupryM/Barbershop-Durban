import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, ArrowRight, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { toast } from 'sonner';

const services = [
  { id: 1, name: 'Signature Haircut', price: 'R250', duration: '45 min' },
  { id: 2, name: 'Beard Trim & Shape', price: 'R150', duration: '30 min' },
  { id: 3, name: 'The Full Service (Cut + Beard)', price: 'R350', duration: '75 min' },
  { id: 4, name: 'Hot Towel Shave', price: 'R200', duration: '45 min' },
];

const barbers = [
  { id: 1, name: 'Thabo Mkhize', specialty: 'Master Barber', experience: '10+ years', image: '/placeholder.svg?height=300&width=300' },
  { id: 2, name: 'Sipho Nkosi', specialty: 'Fade Specialist', experience: '7+ years', image: '/placeholder.svg?height=300&width=300' },
  { id: 3, name: 'Mandla Dlamini', specialty: 'Beard Expert', experience: '8+ years', image: '/placeholder.svg?height=300&width=300' },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', 
  '05:00 PM', '06:00 PM'
];

export function BookingSystem() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barber_id: selectedBarber.id,
          service_name: selectedService.name,
          service_price: selectedService.price,
          service_duration: selectedService.duration,
          appointment_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
          appointment_time: selectedTime,
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Booking request sent! We will confirm shortly.');
        nextStep();
      } else {
        toast.error(data.error || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('[v0] Booking error:', error);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  return (
    <section id="book" className="py-24 bg-white">
      <style>{`
        .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #000000;
          --rdp-background-color: #f3f3f3;
          margin: 0;
        }
        .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
          background-color: var(--rdp-accent-color) !important;
          color: white !important;
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-4 tracking-tight">Book Your Appointment</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Select your preferred service and time. We'll handle the rest.
          </p>
        </div>

        <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
          {/* Progress Bar */}
          <div className="flex border-b border-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`flex-1 h-1.5 transition-colors duration-500 ${step >= i ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>

          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-light mb-8">Select Service</h3>
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => { setSelectedService(service); nextStep(); }}
                        className={`flex items-center justify-between p-6 rounded-lg border text-left transition-all hover:border-primary group ${
                          selectedService?.id === service.id ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <div>
                          <p className="font-medium text-lg">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">{service.price}</p>
                          <ArrowRight className="w-4 h-4 mt-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-8">
                    <button onClick={prevStep} className="flex items-center text-sm hover:text-primary transition-colors">
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </button>
                    <h3 className="text-2xl font-light">Choose Your Barber</h3>
                    <div className="w-12" />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {barbers.map((barber) => (
                      <button
                        key={barber.id}
                        onClick={() => { setSelectedBarber(barber); nextStep(); }}
                        className={`flex flex-col p-6 rounded-lg border text-center transition-all hover:border-primary group ${
                          selectedBarber?.id === barber.id ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted overflow-hidden">
                          <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-medium text-lg mb-1">{barber.name}</h4>
                        <p className="text-sm text-primary mb-1">{barber.specialty}</p>
                        <p className="text-xs text-muted-foreground">{barber.experience}</p>
                        <ArrowRight className="w-4 h-4 mt-4 mx-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-8">
                    <button onClick={prevStep} className="flex items-center text-sm hover:text-primary transition-colors">
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </button>
                    <h3 className="text-2xl font-light">Select Date & Time</h3>
                    <div className="w-12" />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="flex justify-center border rounded-lg p-4">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={{ before: new Date() }}
                        className="p-0 m-0"
                      />
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center">
                        <Clock className="w-4 h-4 mr-2" /> Available Times
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 text-sm rounded border transition-all ${
                              selectedTime === time 
                                ? 'bg-primary text-white border-primary' 
                                : 'border-border hover:border-primary'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      <button
                        disabled={!selectedTime}
                        onClick={nextStep}
                        className="w-full bg-primary text-white py-4 rounded-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-8">
                    <button onClick={prevStep} className="flex items-center text-sm hover:text-primary transition-colors">
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </button>
                    <h3 className="text-2xl font-light">Your Details</h3>
                    <div className="w-12" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full p-4 border rounded-lg bg-muted/30 focus:bg-white focus:ring-1 focus:ring-primary transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-4 border rounded-lg bg-muted/30 focus:bg-white focus:ring-1 focus:ring-primary transition-all"
                            placeholder="john@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone</label>
                          <input
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full p-4 border rounded-lg bg-muted/30 focus:bg-white focus:ring-1 focus:ring-primary transition-all"
                            placeholder="+27 (0) 82 123 4567"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-medium">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Barber</span>
                        <span className="font-medium">{selectedBarber?.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date & Time</span>
                        <span className="font-medium">
                          {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : ''} at {selectedTime}
                        </span>
                      </div>
                      <div className="pt-2 border-t flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">{selectedService?.price}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-4 rounded-lg font-medium hover:bg-primary/90 transition-all"
                    >
                      Confirm Appointment
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-light">Appointment Requested!</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Thanks, {formData.name}. We've received your request for {selectedService?.name} with {selectedBarber?.name} on {selectedDate ? format(selectedDate, 'MMM dd') : ''}. We'll send a confirmation email shortly.
                  </p>
                  <button
                    onClick={() => {
                      setStep(1);
                      setSelectedService(null);
                      setSelectedBarber(null);
                      setSelectedTime(null);
                      setFormData({ name: '', email: '', phone: '' });
                    }}
                    className="text-primary font-medium hover:underline pt-4"
                  >
                    Make another booking
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
