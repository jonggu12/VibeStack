import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="absolute top-4 right-4">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      <h1 className="text-4xl font-bold">Welcome to VibeStack</h1>
      <p className="mt-4 text-xl">AI-era developer learning platform</p>

      <SignedOut>
        <SignInButton mode="modal">
          <Button className="mt-8">Get Started</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Button className="mt-8">Go to Dashboard</Button>
      </SignedIn>
    </main>
  );
}
