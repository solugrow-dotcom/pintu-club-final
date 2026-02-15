"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/useUser"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
    const { profile, loading } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (!loading && profile) {
            // Route based on role
            if (profile.role === "SUPER_ADMIN") {
                router.push("/dashboard/super-admin")
            } else if (profile.role === "GYM_OWNER") {
                if (!profile.gym_id) {
                    router.push("/setup-gym")
                } else {
                    router.push("/dashboard/admin")
                }
            } else if (profile.role === "TRAINER") {
                router.push("/dashboard/trainer")
            } else if (profile.role === "STAFF") {
                router.push("/dashboard/staff")
            }
        }
    }, [profile, loading, router])

    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
    )
}
