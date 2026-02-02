const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    'https://ezbeychqibaaoqajhvms.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6YmV5Y2hxaWJhYW9xYWpodm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTQzMjEsImV4cCI6MjA3ODc5MDMyMX0.PFjAXqYVYnipMWAAZwPRB4up4vSJD99HNQCldVBeWws'
);

module.exports = supabase