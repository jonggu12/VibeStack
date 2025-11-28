import { SignUp } from "@clerk/nextjs"
import { signUpConfig } from "@/lib/clerk"

export default function SignUpPage() {
    return <SignUp {...signUpConfig} />
}
