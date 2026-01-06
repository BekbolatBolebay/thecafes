const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zipzanawdbzsrgxthzvb.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppcHphbmF3ZGJ6c3JneHRoenZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQzODA4NCwiZXhwIjoyMDgxMDE0MDg0fQ.hZJSJICGasd-MU3W4P43uaeEeIhCjS-iGaF8lBumkMk';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function updateAdminPasswords() {
  try {
    console.log('Updating admin user passwords...');
    
    const validHash = '$2b$10$eQak1HISctD23DefTN6rkOyCsGU98k3MBwkA8Uzq2nCrxSLh.G5oC';
    
    const { data, error } = await supabase
      .from('admin_users')
      .update({ password_hash: validHash })
      .in('email', ['bolebay.bekbolat.25@gmail.com', 'nugnurd@gmail.com'])
      .select();
    
    if (error) {
      console.error('Error updating passwords:', error);
      return;
    }
    
    console.log('✅ Successfully updated admin users:');
    console.log(data);
    
  } catch (err) {
    console.error('Error:', err);
  }
}

updateAdminPasswords();
