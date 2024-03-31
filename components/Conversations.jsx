'use client'
import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { supabaseClient } from '@/utils/supabaseClient';
import { checkUserExists } from '@/utils/hooks/CheckUser';

const Conversations = () => {
  console.log('inside convos:')
  const {getToken, userId} = useAuth()
  const {user} = useUser()
  console.log('Convos userId:', userId)
  console.log('Convos user:', user)
  checkUserExists()
  
//   const getTokenAndUserCheck = async () => {
//     const supabaseToken = await getToken({"template": 'supabase'})
//     // const supabase = await supabaseClient(supabaseToken)
//     checkUserExists(user, supabaseToken)
//   }
//   getTokenAndUserCheck()

  
  const conversation_history = [{
    'user': "Fastest car?",
    'model': "Lambo?"
  }]


  const postConvo = async () => {
    console.log('inside convos postConvo:', userId)
    const supabaseToken = await getToken({"template": 'supabase'})
    
    const supabase = await supabaseClient(supabaseToken)
    const {data, error} = await supabase.from('conversations').insert({
        user_id: user?.id,
        conversation_history,
    })
    console.log('sent to data to supabase:')
    console.log(data)
    console.log(error)
  }

//   useEffect(() => {
//     console.log('inside use effect:')  
// },[])


    return (
    <div>
        conversations
        <div className='flex justify-center'>
            <form>
                <label htmlFor="recipe-name">Recipe Name</label>
                <input placeholder='Grandmas Meatballs'></input>
                <label htmlFor="recipe-steps"/>
                <input placeholder="boil water"/>
                <label htmlFor="ingredients"/>
                <input placeholder='tomate'/>
            </form>
            <button onClick={postConvo}>Create Recipe</button>
        </div>
    </div>
)
}


export default Conversations;