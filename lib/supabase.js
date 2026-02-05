const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
    'https://ilykbejwwpxdvszrzqoe.supabase.co',
    'sb_publishable_SiolmhjxG_EdnEcaZ3psOA_I9AxTVJY',
);

module.exports = supabase