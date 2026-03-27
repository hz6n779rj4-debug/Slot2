import { getServiceSupabaseClient } from '@/lib/supabase';
import { isBannerLive } from '@/lib/utils';
import type { Banner, Token } from '@/lib/types';

const demoTokens: Token[] = [
  {
    id: 'demo-1',
    created_at: new Date().toISOString(),
    name: 'Ton Pepe',
    ticker: 'TPEPE',
    contract_address: 'EQDemoTonPepe11111111111111111111111111111111111',
    description: 'A community meme token on TON with high engagement.',
    telegram_url: 'https://t.me/ton',
    x_url: 'https://x.com/ton_blockchain',
    website_url: 'https://ton.org',
    image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    is_promoted: true,
    is_trending: true,
    status: 'promoted'
  },
  {
    id: 'demo-2',
    created_at: new Date().toISOString(),
    name: 'Gem Doge TON',
    ticker: 'GDOGE',
    contract_address: 'EQDemoGemDoge22222222222222222222222222222222222',
    description: 'Fresh TON meme gem with active Telegram community.',
    telegram_url: 'https://t.me/ton',
    x_url: 'https://x.com/ton_blockchain',
    website_url: 'https://ton.org',
    image_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    is_promoted: false,
    is_trending: true,
    status: 'approved'
  }
];

const demoBanners: Banner[] = [
  {
    id: 'banner-1',
    created_at: new Date().toISOString(),
    title: 'Promote your TON project here',
    image_url: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1200&q=80',
    link_url: '/submit',
    starts_at: null,
    ends_at: null,
    is_active: true
  }
];

export async function getPublicHomeData() {
  try {
    const supabase = getServiceSupabaseClient();
    const [tokenRes, bannerRes] = await Promise.all([
      supabase
        .from('tokens')
        .select('*')
        .in('status', ['approved', 'promoted'])
        .order('is_promoted', { ascending: false })
        .order('created_at', { ascending: false }),
      supabase.from('banners').select('*').eq('is_active', true).order('created_at', { ascending: false })
    ]);

    if (tokenRes.error) throw tokenRes.error;
    if (bannerRes.error) throw bannerRes.error;

    return {
      tokens: (tokenRes.data as Token[]) || demoTokens,
      banners: ((bannerRes.data as Banner[]) || []).filter((banner) => isBannerLive(banner.starts_at, banner.ends_at))
    };
  } catch {
    return { tokens: demoTokens, banners: demoBanners };
  }
}

export async function getAdminData() {
  try {
    const supabase = getServiceSupabaseClient();
    const [tokenRes, bannerRes] = await Promise.all([
      supabase.from('tokens').select('*').order('created_at', { ascending: false }),
      supabase.from('banners').select('*').order('created_at', { ascending: false })
    ]);
    if (tokenRes.error) throw tokenRes.error;
    if (bannerRes.error) throw bannerRes.error;
    return { tokens: (tokenRes.data as Token[]) || [], banners: (bannerRes.data as Banner[]) || [] };
  } catch {
    return { tokens: demoTokens, banners: demoBanners };
  }
}
