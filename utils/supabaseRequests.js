'use server'
import { getToken, auth } from '@clerk/nextjs';
import { supabaseClient } from '@/utils/supabaseClient'; // Your Supabase client

export const getAllChats = async() => {
    const {getToken, userId} = auth()
    // console.log('inside getConvos')
    // console.log(userId)

    const token = await getToken({"template": 'supabase'})
    const supabase = await supabaseClient(token)
    const {data: convos} = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)

    // console.log(convos)
    // console.log(data)
    return convos
}

export async function GetConvos(chatId) {
    const {getToken, userId} = auth()
    // console.log('inside getConvos')
    // console.log(userId)

    const token = await getToken({"template": 'supabase'})
    const supabase = await supabaseClient(token)
    let { data: conversations, error } = await supabase
      .from('conversations')
      .select('conversation_history')
      .eq('chat_id', chatId);
  
    if (error) {
      console.error('Error fetching conversations', error);
      return [];
    }
  
    return conversations;
  }

export async function deleteChat(chatId) {
  try {
    // server connection"
    const {getToken, userId} = auth()
    // console.log('inside deleteChat:')
    // console.log(userId)
    
    const token = await getToken({"template": 'supabase'})
    const supabase = await supabaseClient(token)

    // Perform the delete operation using the Supabase client
    const { data, error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

      if (error) {
          throw error;
      }
    return data
    
  } catch(error) {
    console.error('Error deleting chat:', error.message)
    throw error
  }
}

