import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase credentials
const supabaseUrl = 'https://szeqlqhzewvrdeerdamx.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZXFscWh6ZXd2cmRlZXJkYW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMjk1MzcsImV4cCI6MjA1MTkwNTUzN30.zQq1uxrI1WfW8ehmipYMSmuZoelpGzSeNful8GmtBcE';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6ZXFscWh6ZXd2cmRlZXJkYW14Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjMyOTUzNywiZXhwIjoyMDUxOTA1NTM3fQ.cVNvSIU_VZocWyk-clEnZdyReevOJmUxlJLi2ijh5lw';

console.log('Testing Supabase credentials:', {
  supabaseUrl,
  anonKey: `Set (first 10 chars: ${anonKey.slice(0, 10)}..., length: ${anonKey.length})`,
  serviceRoleKey: `Set (first 10 chars: ${serviceRoleKey.slice(0, 10)}..., length: ${serviceRoleKey.length})`,
});

// Test Anon Key
const supabaseAnon = createClient(supabaseUrl, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function testAnonKey() {
  try {
    const { data, error } = await supabaseAnon.from('property').select('id').limit(1);
    if (error) {
      console.error('Anon Key error:', error);
      return;
    }
    console.log('Anon Key test successful:', data);
  } catch (error) {
    console.error('Anon Key client error:', error);
  }
}

// Test Service Role Key
const supabaseService = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function testServiceRoleKey() {
  try {
    const { data, error } = await supabaseService.storage.from('properties').list('', { limit: 1 });
    if (error) {
      console.error('Service Role Key error:', error);
      return;
    }
    console.log('Service Role Key test successful:', data);
  } catch (error) {
    console.error('Service Role Key client error:', error);
  }
}

async function runTests() {
  await testAnonKey();
  await testServiceRoleKey();
}

runTests();