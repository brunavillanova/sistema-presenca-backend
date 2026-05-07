const { createClient } = require(
  "@supabase/supabase-js"
);

const supabase = createClient(
  "https://xuxzbmitgjazmotyxaua.supabase.co",
  "sb_publishable_X_sPstpcMXr3TFq44Fpn7A_keiQaQa-"
);

module.exports = supabase;