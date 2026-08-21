import * as SecureStore from "expo-secure-store";import {createClient} from "@supabase/supabase-js";
const url=process.env.EXPO_PUBLIC_SUPABASE_URL,key=process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
export const mobileConfigured=Boolean(url&&key);
const storage={getItem:(key:string)=>SecureStore.getItemAsync(key),setItem:(key:string,value:string)=>SecureStore.setItemAsync(key,value,{keychainAccessible:SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY}),removeItem:(key:string)=>SecureStore.deleteItemAsync(key)};
export const supabase=mobileConfigured?createClient(url!,key!,{auth:{storage,autoRefreshToken:true,persistSession:true,detectSessionInUrl:false}}):null;
