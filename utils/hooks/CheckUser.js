import { useEffect } from 'react';
import { useUser, getToken, useAuth, auth } from '@clerk/nextjs';
import { supabaseClient } from '@/utils/supabaseClient'; // Your Supabase client


export const checkUserExists = () => {
  console.log('inside checkUser')
  const {getToken, userId} = useAuth()
  // const {getToken, userId} = auth()
  const { user } = useUser();
  
  useEffect(() => {
    const checkAndInsertUser = async () => {
      const token = await getToken({"template": 'supabase'})
      if (user) {
        const supabase = await supabaseClient(token)
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!existingUser) {
          // User does not exist, insert them into Supabase
          await supabase.from('users').insert([
            { user_id: user.id, f_name: user.firstName || '' },
          ]);
        }
      }
    };

    checkAndInsertUser();
  }, [user]);

  return null; 
}