import { AuthForm } from "@/components/common/AuthForm"
import { Shield, ShieldCheck } from "lucide-react"
import {Link} from "react-router-dom"



export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Minimal header */}
      <header className="border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground leading-none">
                SPIMS
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Smart Panchayath Issue Mgmt
              </span>
            </div>
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Auth content area */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-md flex-col items-center">
          <AuthForm />

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Secure & Encrypted
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Government Certified
            </span>
          </div>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            {"By signing in, you agree to the "}
            <span className="underline underline-offset-2">
              Terms of Service
            </span>
            {" and "}
            <span className="underline underline-offset-2">
              Privacy Policy
            </span>
            {" of SPIMS."}
          </p>
        </div>
      </main>
    </div>
  )
}
