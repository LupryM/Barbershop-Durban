'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, KeyRound, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Verification code generated!');
        if (data.code) {
          toast.info(`Your code is ${data.code}`, { duration: 15000 });
        }
        setStep('otp');
      } else {
        toast.error(data.error || 'Failed to send code');
      }
    } catch (error) {
      toast.error('Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp, name })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Welcome to Xclusive Barber!');
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.error(data.error || 'Invalid code');
      }
    } catch (error) {
      toast.error('Failed to verify. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.jpeg" alt="Xclusive Barber" width={40} height={40} />
            <span className="text-lg font-light tracking-tighter">XCLUSIVE BARBER</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light tracking-tight mb-3">Welcome Back</h1>
            <p className="text-white/40 text-sm">
              Sign in with your phone number to manage appointments
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-8">
              <div className="space-y-3">
                <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-white/40 font-medium">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 82 123 4567"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
                <p className="text-xs text-white/30">
                  A verification code will be generated for you
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-4 rounded-lg font-medium text-sm uppercase tracking-widest hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Get Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-8">
              <div className="space-y-3">
                <label htmlFor="name" className="block text-xs uppercase tracking-widest text-white/40 font-medium">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First-time? Enter your name"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/20 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="otp" className="block text-xs uppercase tracking-widest text-white/40 font-medium">
                  Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000"
                    required
                    maxLength={6}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-lg text-white text-center text-2xl tracking-[0.5em] placeholder:text-white/20 focus:border-white/30 focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>
                <p className="text-xs text-white/30">
                  Enter the 6-digit code for {phone}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-4 rounded-lg font-medium text-sm uppercase tracking-widest hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('phone'); setOtp(''); }}
                className="w-full text-xs text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest"
              >
                Change phone number
              </button>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
              Need help? Call +27 (0) 82 123 4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
