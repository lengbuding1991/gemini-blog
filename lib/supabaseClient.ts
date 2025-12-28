
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.45.0';

// 注意：在实际部署中，请使用 process.env.SUPABASE_URL 等环境变量
// 这里为了让你能直接运行，你可以手动填入你的 Supabase 项目信息
const supabaseUrl = 'https://acnhaxptojhbcnkdbpop.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjbmhheHB0b2poYmNua2RicG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4OTE2MjEsImV4cCI6MjA4MjQ2NzYyMX0.eB2utNgecue7bv-9jymCocGgV0FTLLe9Ff5wXeqh5lg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
