export const dynamic = 'force-dynamic';

import { AdminDashboard } from '@/components/AdminDashboard';
import { AdminLogin } from '@/components/AdminLogin';
import { getAdminData } from '@/lib/data';
import { isAdminAuthenticated } from '@/lib/auth';

export default async function AdminPage() {
  const isAuthed = await isAdminAuthenticated();

  if (!isAuthed) {
    return (
      <section className="site-shell page-section narrow">
        <AdminLogin />
      </section>
    );
  }

  const { tokens, banners } = await getAdminData();
  return (
    <section className="site-shell page-section">
      <AdminDashboard initialTokens={tokens} initialBanners={banners} />
    </section>
  );
}
