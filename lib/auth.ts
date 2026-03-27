import { cookies } from 'next/headers';

const COOKIE_NAME = 'tongemz_admin';

export async function isAdminAuthenticated() {
  const store = await cookies();
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return store.get(COOKIE_NAME)?.value === secret;
}

export { COOKIE_NAME };
