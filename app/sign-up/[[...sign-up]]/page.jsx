import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
    return (
        <div className="flex items-center justify-center flex-col gap-10 pt-20">
            <div className="text-white">
               <h1>Demo Account available in Sign-In page</h1>
            </div>            
            <SignUp/>
        </div>
      )
}