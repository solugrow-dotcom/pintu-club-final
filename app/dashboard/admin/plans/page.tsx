"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"
import { insforge } from "@/lib/insforge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Loader2, X, IndianRupee } from "lucide-react"

export default function PlansPage() {
    const { profile } = useUser()
    const [plans, setPlans] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newPlan, setNewPlan] = useState({
        name: "",
        duration_days: 30,
        price: 0,
        description: ""
    })

    const fetchPlans = async () => {
        if (!profile?.gym_id) return
        setLoading(true)
        const { data, error } = await insforge
            .from('plans')
            .select('*')
            .eq('gym_id', profile.gym_id)

        if (!error && data) {
            setPlans(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (profile?.gym_id) fetchPlans()
    }, [profile?.gym_id])

    const handleAddPlan = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile?.gym_id) return
        setLoading(true)

        try {
            const { error } = await insforge.from('plans').insert({
                ...newPlan,
                gym_id: profile.gym_id
            })

            if (error) throw error

            setShowAddModal(false)
            setNewPlan({ name: "", duration_days: 30, price: 0, description: "" })
            fetchPlans()
        } catch (error: any) {
            alert(error.message || "Failed to add plan")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold">Membership Plans</h2>
                        <p className="text-zinc-400">Define subscription tiers for your gym</p>
                    </div>
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Create Plan
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {loading && plans.length === 0 ? (
                        <div className="flex justify-center py-8 lg:col-span-3"><Loader2 className="animate-spin" /></div>
                    ) : plans.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500 border rounded-lg bg-zinc-900/20 lg:col-span-3">No plans found.</div>
                    ) : (
                        plans.map((plan) => (
                            <Card key={plan.id} className="relative overflow-hidden border-zinc-800 hover:border-white transition">
                                <div className="absolute top-0 right-0 p-4">
                                    <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                                        {plan.duration_days} Days
                                    </span>
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-3xl font-bold">₹{plan.price}</span>
                                        <span className="text-zinc-400 text-sm">/ {plan.duration_days} days</span>
                                    </div>
                                    <p className="text-sm text-zinc-400 line-clamp-2">{plan.description || "Perfect for regular gym-goers."}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <Card className="w-full max-w-md border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Create New Plan</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddPlan} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Plan Name</label>
                                        <Input
                                            required
                                            value={newPlan.name}
                                            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                                            placeholder="Gold Membership"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Price (₹)</label>
                                            <Input
                                                type="number"
                                                required
                                                value={newPlan.price}
                                                onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Duration (Days)</label>
                                            <Input
                                                type="number"
                                                required
                                                value={newPlan.duration_days}
                                                onChange={(e) => setNewPlan({ ...newPlan, duration_days: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <Input
                                            value={newPlan.description}
                                            onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                                            placeholder="Access to all facilities"
                                        />
                                    </div>
                                    <Button className="w-full" type="submit" disabled={loading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create Plan
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
