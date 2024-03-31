import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center flex-col gap-10 pt-20">
      <div className="text-white">
        <h1>Login Details:</h1>
        <h1>Email: gemini_test@test.com</h1>
        <h1>Password: Gemini123</h1>
      
      </div>
      <SignIn initialValues={{emailAddress: 'gemini_user@test.com'}}/>
    </div>
  )
}