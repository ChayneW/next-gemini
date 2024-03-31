'use client'
import React, {useState, useEffect, useRef} from 'react'
import LoadingCard from './LoadingCard'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'


const GeminiTalk = ({path}) => {
    const [chatId, setChatId] = useState(path)
    const [chatHistory, setChatHistory] = useState([])
    const [value, setValue] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setChatId(path);
        console.log(chatId)
    }, [])

    const surpriseOptions = [
        'Who won the latest Nobel Peace Prize?',
        'where does pizza come from?',
        'how do you make a BLT sandwich?',
    ]

    const surprise = () => {
        const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
        setValue(randomValue)
    }

    const getResponse = async () => {
        setIsLoading(true)
        console.log('inside getResponse():')
        // toast.success('You did it!')
        let newPath 


        if (!value) {
            setError('Error! Please ask a question!');
            setIsLoading(false); // End loading
            return;
        }
        try {
            // Normalizing chatId
            const normalizedChatId = chatId.startsWith('/') ? chatId.substring(1) : chatId;
            const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            const isUUID = uuidPattern.test(normalizedChatId)
            // toast.loading('Gemini is Thinking...')
    
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    chatId: chatId === '/dashboard' || isUUID ? chatId : '/dashboard', // Fallback to '/dashboard' if not valid
                    history: chatHistory,
                    message: value,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
    
            const response = await fetch(`/api/gemini`, options);
    
            if (!response.ok) {
                toast.error('There is an error!');
                throw new Error(`Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Data received:', data);
            console.log('Current chatId:', chatId);
            toast.success('Gemini has Responded:')

            console.log(`getResponse(), router.push to ${data.chatId}`)
            newPath = data.chatId
            // router.push(`/${data.chatId}`)
            // setChatId(data.chatId)
            router.push(`/${newPath}`)

            if (chatId !== '/dashboard') {
                console.log('inside !== dashboard:')
                console.log(`/${newPath}`)
                router.push(`/${chatId}`)
                return
            }

            const updatedHistory = [
                ...chatHistory,
                { role: 'user', parts: value },
                { role: 'model', parts: data.text }
            ]

            setChatHistory(updatedHistory)

            setValue('')
            return 
        } catch (error) {
            setError(`Something went wrong! Please try again later. ${error}`);
        } finally {
            console.log('inside finally block')
            console.log(`how router will look: /${newPath}`)
            setIsLoading(false); // End loading
            // router.refresh()
            router.push(`/${newPath}`)
            // router.push(`/${data.chatId}`)

        }
    };

    const handleButtonClick = () => {
        toast.promise(getResponse(), {
            loading: 'Gemini is Thinking...',
            success: 'Gemini has Responded:',
            error: 'There is an error!',
        });
    };

    const clear = () => {
        setValue('')
        setError('')
        setChatHistory([])
        // router.refresh()
    }

    return (

        <>
            {isLoading && 
                    <div className='w-full grid justify-center py-10'>
                        <LoadingCard/>
                    </div>
                }
        

            <div className='fixed bottom-0 z-10 w-full'>
                {/* <div className='justify-center mx-auto max-md:px-10 md:pl-28 flex flex-col overflow-y-auto pb-5'> */}
                <div className='justify-center mx-auto max-md:px-10 max-sm:pl-[10%] sm:max-md:pl-[20%] md:pl-[15%] flex flex-col overflow-y-auto pb-5'>

                    {error && <p>{error}</p>}
                    {/* <div className='flex gap-5 max-lg:w-[300px] lg:w-[50vw] pl-10'> */}
                    <div className='flex gap-5 max-sm:w-[320px] sm:max-md:w-[380px] md:max-lg:w-[40vw] lg:w-[50vw]'>
                        <Input
                            // className='bg-transparent rounded-lg'
                            className='bg-black rounded-lg text-white'
                            placeholder='What time is it?'
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        {!error && 
                            // <Button onClick={getResponse} variant="outline" className='bg-[#14CC8F]'>
                            <Button onClick={handleButtonClick} variant="outline" className='bg-[#14CC8F]'>

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
                            <Button onClick={clear} variant="outline" className='bg-[#14CC8F]'>
                                Clear
                            </Button>
                        } 
                    </div>
                </div>
            </div>
        </>
    )
}

export default GeminiTalk