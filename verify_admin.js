const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zipzanawdbzsrgxthzvb.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppcHphbmF3ZGJ6c3JneHRoenZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQzODA4NCwiZXhwIjoyMDgxMDE0MDg0fQ.hZJSJICGasd-MU3W4P43uaeEeIhCjS-iGaF8lBumkMk';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function verifyAdmins() {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, first_name, last_name, password_hash, is_active')
      .in('email', ['bolebay.bekbolat.25@gmail.com', 'nugnurd@gmail.com']);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('✅ Admin users in database:');
    data.forEach(user => {
      console.log(`\n📧 Email: ${user.email}`);
      console.log(`👤 Name: ${user.first_name} ${user.last_name}`);
      console.log(`🔐 Has password hash: ${!!user.password_hash}`);
      console.log(`🟢 Active: ${user.is_active}`);
      console.log(`🔑 Hash: ${user.password_hash?.substring(0, 20)}...`);
    });
    
  } catch (err) {
    console.error('Error:', err);
  }
}

verifyAdmins();
