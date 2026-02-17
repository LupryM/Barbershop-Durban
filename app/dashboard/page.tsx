import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { CustomerDashboard } from '@/components/customer-dashboard';
import { AdminDashboard } from '@/components/admin-dashboard';
import { BarberDashboard } from '@/components/barber-dashboard';

export default async function DashboardPage() {
  const { user } = await getSession();

  if (!user) {
    redirect('/login');
  }

  // Route to appropriate dashboard based on role
  if (user.role === 'admin') {
    return <AdminDashboard user={user} />;
  }

  if (user.role === 'barber') {
    return <BarberDashboard user={user} />;
  }

  return <CustomerDashboard user={user} />;
}
