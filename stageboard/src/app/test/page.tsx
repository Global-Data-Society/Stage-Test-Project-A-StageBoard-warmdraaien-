import { supabaseClient } from '@/lib/supabase/client';

const supabase = supabaseClient;

export default async function Page() {
  const { data, error } = await supabase.from('tasks').select('*');
  return <pre>{JSON.stringify({ data, error }, null, 2)}</pre>;
}