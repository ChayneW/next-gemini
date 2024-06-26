import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse, NextRequest } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import { auth } from '@clerk/nextjs'
import { v4 as uuidv4 } from 'uuid';
import {validate as uuidValidate } from 'uuid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const genAI = new GoogleGenerativeAI(process.env.NEXT_GOOGLE_AI_KEY)

// Create a function to format conversation entry
const formatConversationEntry = (userMessage, modelResponse) => {
    const formattedEntry = [];
    if (userMessage) {
        formattedEntry.push({
            role: "user",
            parts: [{ text: userMessage }],
        });
    }
    if (modelResponse) {
        formattedEntry.push({
            role: "model",
            parts: [{ text: modelResponse }],
        });
    }
    return formattedEntry;
};

export async function GET(req, res) {
    console.log('inside GET:')
    try {
        const {data, error} = await supabase
            .from('conversations')
            .select("*")
        
        if (error) {
            console.error("Error fetching conversations:", error)
            return res.status(500).json({message: "Error fetching conversations"})
        }
        return res.json(data)
    } catch (error) {
        console.error("Error:", errror)
        return res.status(500).json({message: "Internal server error"})
    }
}


async function interactWithGemini(question, history = null) {
    const generationConfig = { maxOutputTokens: 100 };
    const model = genAI.getGenerativeModel({ model: 'gemini-pro', generationConfig });
  
    const chat = await model.startChat({
      history: history,
    });
  
    const result = await chat.sendMessage(question);
    const response = await result.response;
    const text = await response.text();
    console.log("\nWaiting for AI response:");
    console.log('Question:', question);
    console.log('AI Response:', text);
  
    return text;
  }


export async function POST(req, res) {
    try {
        console.log('Inside POST:');
        const { userId } = await auth();
        console.log('User ID:', userId);

        const body = await req.json();
        console.log('Received JSON body:', body);
        const { message, history, chatId } = body;

        let newChatId;
        let lastConvo = [];

        // If chatId is '/dashboard', create a new chat entry
        if (chatId === '/dashboard') {
            console.log('Creating new chat entry for /dashboard:');
            newChatId = uuidv4();
            const { data, error: chatError } = await supabase
                .from('chats')
                .insert([{ id: newChatId, user_id: userId, title: `${message}` }])
                .single();

            if (chatError) {
                console.error("Error creating chat:", chatError);
                return res.status(500).json({ message: "Failed to create chat" });
            }

            // calling gemini and saving response to supabase:
            console.log('calling gemini from /dashboard:')
            const text = await interactWithGemini(message, lastConvo);
            console.log('after gemini call')
            console.log(text)

            // No existing conversation, insert a new record
            console.log('Inserting a new conversation for chatId:', newChatId);
            const {newData, error:conversationError} = await supabase
                .from('conversations')
                .insert(
                    [{ chat_id: newChatId, conversation_history: [{ user: message, model: text }] }]
                );

            console.log('/dashboard, finished inserting into db:')

            if (conversationError) {
                console.error("Error inserting conversation:", conversationError);
                return res.status(500).json({ message: "Failed to insert conversation" });
            }

            console.log('/dashboard, no conversationError:')
            return await NextResponse.json({text: text, chatId: newChatId })

        } else {
            // If chatId is not '/dashboard', extract chatId from the path
            newChatId = chatId.replace(/^\//, '');
            console.log('Chat ID:', newChatId);
        }
  
        // Fetch the conversation history from Supabase

        if (chatId !== '/dashboard') {
            console.log('in /UUID:')
            console.log('Fetching conversation history for chatId:', newChatId);

            console.log('inside uuidCheck:')
            const idCheck = uuidValidate(newChatId)
            console.log(idCheck)

            const { data: fetchedConversations, error: fetchError } = await supabase
                .from('conversations')
                .select('id, conversation_history')
                .eq('chat_id', newChatId);
            
            console.log('\nin /UUID: should have retrieved supabase convos:')

            if (fetchError) {
                console.error("Error fetching conversation:", fetchError);
                return res.status(500).json({ message: "Failed to fetch conversation" });
            }

            console.log('fetchedConversations from first call')
            console.log(fetchedConversations[0].conversation_history)

            // array from supa call.
            const fetchedConvoId = fetchedConversations[0].id
            const fetchedSupaConvos = fetchedConversations[0].conversation_history

            const lastConversationEntry = fetchedConversations.length > 0 ? fetchedConversations[0].conversation_history.slice(-1)[0] : null;
            console.log('lastConversationEntry:')
            console.log(lastConversationEntry)

            // Format the last conversation entry
            const lastUserMessage = lastConversationEntry ? lastConversationEntry.user : '';
            const lastModelResponse = lastConversationEntry ? lastConversationEntry.model : '';
            const formattedHistory = formatConversationEntry(lastUserMessage, lastModelResponse);

            console.log('Formatted Conversation History:', formattedHistory);
            lastConvo = formattedHistory
            
            const text = await interactWithGemini(message, lastConvo);
            console.log('after gemini call')
            console.log(text)

            // Conversation exists, append the new question/answer pair
            const updatedHistory = [...fetchedSupaConvos, { user: message, model: text }];
            
            console.log('heres the updatedHistory:')
            console.log(updatedHistory)

            const { error: updateError } = await supabase
                .from('conversations')
                .update({ conversation_history: updatedHistory })
                .eq('id', fetchedConvoId);
            
            if (updateError) {
                console.error("Error updating conversation:", updateError);
                return res.status(500).json({ message: "Failed to update conversation" });
            } else {
                console.log(`finished adding to conversation history... returning text: ${text}\nnewChatId: ${newChatId}`)
                return NextResponse.json({text: text, chatId: newChatId })
            }
        } 
    } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }