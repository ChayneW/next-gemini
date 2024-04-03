'use client'
import { Button } from "@/components/ui/button";
import { SignIn, useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import React, {useState, useEffect} from 'react'

export default function Page() {
  // return (
  //   <div className="flex items-center justify-center flex-col gap-10 pt-20">
  //     <div className="text-white">
  //       <h1>Demo Account Login:</h1>
  //       <h1>Email: gemini_test@test.com</h1>
  //       <h1>Password: Gemini123</h1>
  //     </div>
  //     <SignIn initialValues={{emailAddress: 'gemini_user@test.com'}}/>
  //   </div>
  // )

  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("gemini_user@test.com");
  const [password, setPassword] = useState("Gemini123");
  const router = useRouter();
 
  // Handle the submission of the sign-in form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
 
    // Start the sign-in process using the email and password provided
    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });
 
      if (completeSignIn.status !== 'complete') {
        // The status can also be `needs_factor_on', 'needs_factor_two', or 'needs_identifier'
        // Please see https://clerk.com/docs/references/react/use-sign-in#result-status for  more information
        console.log(JSON.stringify(completeSignIn, null, 2));
      }
 
      if (completeSignIn.status === 'complete') {
        // If complete, user exists and provided password match -- set session active
        await setActive({ session: completeSignIn.createdSessionId });
        // Redirect the user to a post sign-in route
        router.push('/');
      }
    } catch (err) {
      // This can return an array of errors.
      // See https://clerk.com/docs/custom-flows/error-handling to learn about error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
 
  // Display a form to capture the user's email and password
  return (
    <div className="pt-20">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="grid justify-center gap-5">
          <div className="grid px-20">
            <Button type="submit" className="bg-[#14CC8F]">
              <h1>Demo Account Click Here</h1>
            </Button>
          </div>
          
          <div className="grid justify-center">
            <h1 className="text-white text-center py-2">Personal Log In:</h1>
            <SignIn/>
          </div>

        </div>
      </form>
    </div>
  );
}