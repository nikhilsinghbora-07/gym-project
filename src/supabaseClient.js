import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lxxbmpuquoqhwiighquh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4eGJtcHVxdW9xaHdpaWdocXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwOTkxODQsImV4cCI6MjEwMTY3NTE4NH0.0SB4AsNMkNIkqk7WIvOXED6AQKwPOsmOZwaQsa0CU-g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);