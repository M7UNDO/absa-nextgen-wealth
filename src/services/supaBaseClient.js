import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vbwscdhaonyqbiptmqyv.supabase.co";
const supabaseKey = "sb_publishable_fDOeZQh2McMohwV3HSHTkA_2pzX4Et4";

export const supabase = createClient(supabaseUrl, supabaseKey);