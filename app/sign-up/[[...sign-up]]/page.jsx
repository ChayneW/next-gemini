import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
    return (
        <div className="flex items-center justify-center flex-col gap-10 pt-20">
            <SignUp initialValues={{emailAddress: 'gemini_user@test.com'}}/>
        </div>
      )
}