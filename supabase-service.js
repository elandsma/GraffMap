import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_PUBLIC_KEY} from "react-native-dotenv"
import AsyncStorage from "@react-native-async-storage/async-storage"

console.log("Debug supabase service: "+SUPABASE_URL)
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY,{
    localStorage: AsyncStorage,
});

export { supabase }