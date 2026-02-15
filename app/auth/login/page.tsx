"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { insforge } from "@/lib/insforge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, KeyRound } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [step, setStep] = useState<"email" | "otp">("email")
    const [loading, setLoading] = useState(false)

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await insforge.auth.resendVerificationEmail({ email })
            if (error) throw error

            setStep("otp")
        } catch (error: any) {
            alert(error.message || "Failed to send OTP")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data, error } = await insforge.auth.verifyEmail({
                email,
                otp
            })

            if (error) throw error
            router.push("/dashboard")
        } catch (error: any) {
            alert(error.message || "Invalid OTP")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <Card className="w-full max-w-md border-zinc-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>Sign in to your SoluGrow account</CardDescription>
                </CardHeader>
                <CardContent>
                    {step === "email" ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                                    <Input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send OTP
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Enter 6-Digit Code</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                                    <Input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="123456"
                                        className="pl-9 text-center text-lg tracking-widest"
                                    />
                                </div>
                                <p className="text-xs text-zinc-500">Sent to {email}</p>
                            </div>
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify & Login
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full"
                                onClick={() => setStep("email")}
                            >
                                Change Email
                            </Button>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="text-white font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
