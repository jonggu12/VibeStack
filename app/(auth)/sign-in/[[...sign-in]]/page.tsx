import { SignIn } from "@clerk/nextjs"
import { signInConfig } from "@/lib/clerk"

export default function SignInPage() {
    return <SignIn {...signInConfig} />
}
