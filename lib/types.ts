export type TokenStatus = 'pending' | 'approved' | 'promoted' | 'rejected';

export type Token = {
  id: string;
  created_at: string;
  name: string;
  ticker: string;
  contract_address: string;
  description: string | null;
  telegram_url: string | null;
  x_url: string | null;
  website_url: string | null;
  image_url: string | null;
  is_promoted: boolean;
  is_trending: boolean;
  status: TokenStatus;
};

export type Banner = {
  id: string;
  created_at: string;
  title: string;
  image_url: string;
  link_url: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
};
