"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { insforge } from "@/lib/insforge"
import { useUser } from "@/hooks/useUser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, X } from "lucide-react"

export default function SetupGymPage() {
    const { user, profile, loading: userLoading } = useUser()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        phone: ""
    })

    useEffect(() => {
        if (!userLoading && !user) {
            router.push("/auth/login")
        }
        if (!userLoading && profile?.gym_id) {
            router.push("/dashboard/admin")
        }
    }, [user, profile, userLoading, router])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const preview = URL.createObjectURL(file)
        setLogoPreview(preview)
        setUploading(false)
    }

    const handleCreateGym = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)

        try {
            const { data: gym, error: gymError } = await insforge
                .from('gyms')
                .insert([
                    {
                        ...formData,
                        owner_user_id: user.id,
                    },
                ])
                .select()
                .single()

            if (gymError) throw gymError

            await insforge
                .from('users')
                .update({ gym_id: gym.id })
                .eq('id', user.id)

            router.push("/dashboard/admin")
        } catch (error: any) {
            alert(error.message || "Failed to create gym")
        } finally {
            setLoading(false)
        }
    }

    if (userLoading) return <div className="flex justify-center items-center h-screen bg-black"><Loader2 className="animate-spin text-white" /></div>

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <Card className="w-full max-w-lg border-zinc-800">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Setup Your Gym</CardTitle>
                    <CardDescription>Complete your gym profile to start managing members</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateGym} className="space-y-6">
                        <div className="flex flex-col items-center gap-4 py-4 border-2 border-dashed border-zinc-700 rounded-2xl bg-zinc-900/20">
                            {logoPreview ? (
                                <div className="relative w-32 h-32">
                                    <img src={logoPreview} alt="Logo" className="w-32 h-32 rounded-xl object-contain bg-white" />
                                    <button
                                        type="button"
                                        onClick={() => setLogoPreview(null)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="w-10 h-10 text-zinc-500 mb-2" />
                                    <p className="text-xs text-zinc-500">Upload Gym Logo (Optional)</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="logo-upload"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('logo-upload')?.click()}
                                disabled={uploading}
                            >
                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Choose Image"}
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Gym Name</label>
                                <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Alpha Iron Gym" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Business Address</label>
                                <Input required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Plot 42, Fitness Avenue" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">City</label>
                                    <Input required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="New Delhi" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">State</label>
                                    <Input required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="Delhi" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Business Phone</label>
                                <Input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 99999 88888" />
                            </div>
                        </div>

                        <Button className="w-full py-6 text-lg font-bold" type="submit" disabled={loading || uploading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Launch My Gym 🚀"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
