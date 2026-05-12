import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL      = 'https://oeybefxeelxduzbuxobe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9leWJlZnhlZWx4ZHV6YnV4b2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNjMwMTksImV4cCI6MjA5MzkzOTAxOX0.PW30591ZJlHsVtSzHmEQ8XrEoHP9mEFMyoGAsTSlQu4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
