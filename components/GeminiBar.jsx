'use client'
import React, {useState, useEffect} from 'react'
import LoadingCard from './LoadingCard'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'


const GeminiBar = ({path}) => {
    console.log('inside GeminiBar:')

    const [chatId, setChatId] = useState(path)
    const [chatHistory, setChatHistory] = useState([])
    const [value, setValue] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setChatId(path);
        console.log(chatId)
    }, [path])

    const getResponse = async () => {
        setIsLoading(true)
        console.log('inside getResponse():')

        if(!value) {
            setError('Error! Please ask a question!')
            return 
        }

        try {
            const normalizedChatId = chatId.startsWith('/') ? chatId.substring(1) : chatId;
            const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            const isUUID = uuidPattern.test(normalizedChatId)

            const options = {
                method: 'POST',
                body: JSON.stringify({
                    // chatId: chatId === '/dashboard' ? '/dashboard' : chatId,
                    chatId: chatId === '/dashboard' || isUUID ? chatId : '/dashboard', // Fallback to '/dashboard' if not valid
                    history: chatHistory,
                    message: value,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const response = await fetch(`/api/gemini`, options)

            if(!response.ok){
                throw new Error(`Error: ${response.status}`)
            }
            const data = await response.json()
            console.log(data.text)
            console.log(data.chatId)

            // check for if the page started out in dashboard, then got a post response with designated new uuid:
            if (chatId === '/dashboard' && data.chatId) {
                router.push(`/${data.chatId}`); // Redirect to the dynamic page
                // Optionally, prevent further execution if you're redirecting away
                return;
            } else {
                // for cases where the url is already the chatId:
                console.log('url already in dynamic page:')
                router.push(`/${chatId}`)
            }





        }
    }



    const clear = () => {
        setValue('')
        setError('')
        setChatHistory([])
    }

    return (
    <div>GeminiBar

        {error && 
        <p>{error}</p>
        }


        {isLoading && 
        <div>
            <LoadingCard/>
        </div>
        }

        <div>
            <Input
                className='bg-transparent rounded-lg'
                placeholder='ex: What time is it?'
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />

            {!error && 
                <Button onClick={getResponse} variant="outline" className='bg-[#14CC8F]'>
                    <Image
                        src='/telegram.svg'
                        width={30}
                        height={40}
                        alt='send-button'
                        className='bg-transparent'
                    />
                </Button>
            }
            {error && 
                <Button onClick={clear} variant="outline">
                    Clear
                </Button>
            } 
        </div>
    </div>
    )
}

export default GeminiBar