import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://scfwyhdjblupxxkfrgbx.supabase.co';

const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_pgdvO-2DDQqcJr7w2TgxoQ_At9dkkSk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface ApplicationRecord {
  id: string;
  name: string;
  email: string;
  usn?: string;
  year?: string;
  department?: string;
  track?: string;
  interest?: string;
  statement?: string;
  phone?: string;
  status?: string;
  created_at: string;
}

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at: string;
}
