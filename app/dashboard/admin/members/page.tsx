"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"
import { insforge } from "@/lib/insforge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Loader2, X, Search } from "lucide-react"

export default function MembersPage() {
    const { profile } = useUser()
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [newMember, setNewMember] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    })

    const fetchMembers = async () => {
        if (!profile?.gym_id) return
        setLoading(true)
        const { data, error } = await insforge
            .from('members')
            .select('*')
            .eq('gym_id', profile.gym_id)

        if (!error && data) {
            setMembers(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (profile?.gym_id) fetchMembers()
    }, [profile?.gym_id])

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile?.gym_id) return
        setLoading(true)

        try {
            const { error } = await insforge.from('members').insert({
                ...newMember,
                gym_id: profile.gym_id
            })

            if (error) throw error

            setShowAddModal(false)
            setNewMember({ name: "", email: "", phone: "", address: "" })
            fetchMembers()
        } catch (error: any) {
            alert(error.message || "Failed to add member")
        } finally {
            setLoading(false)
        }
    }

    const filteredMembers = members.filter(m =>
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone?.includes(searchQuery)
    )

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold">Members</h2>
                        <p className="text-zinc-400">Manage your gym members</p>
                    </div>
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Member
                    </Button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <Input
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Card className="border-zinc-800">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-900 border-b border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Name</th>
                                        <th className="px-6 py-3 font-semibold">Email</th>
                                        <th className="px-6 py-3 font-semibold">Phone</th>
                                        <th className="px-6 py-3 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {loading && filteredMembers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center"><Loader2 className="animate-spin inline-block mr-2" /> Loading...</td>
                                        </tr>
                                    ) : filteredMembers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No members found</td>
                                        </tr>
                                    ) : (
                                        filteredMembers.map((member) => (
                                            <tr key={member.id} className="hover:bg-zinc-900 transition">
                                                <td className="px-6 py-4 font-medium">{member.name}</td>
                                                <td className="px-6 py-4 text-zinc-400">{member.email}</td>
                                                <td className="px-6 py-4 text-zinc-400">{member.phone}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-xs font-bold">Active</span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <Card className="w-full max-w-md border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Add New Member</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddMember} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <Input
                                            required
                                            value={newMember.name}
                                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input
                                            type="email"
                                            required
                                            value={newMember.email}
                                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone</label>
                                        <Input
                                            required
                                            value={newMember.phone}
                                            onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                                            placeholder="+91 99999 88888"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Address</label>
                                        <Input
                                            value={newMember.address}
                                            onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
                                            placeholder="123 Main St"
                                        />
                                    </div>
                                    <Button className="w-full" type="submit" disabled={loading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Add Member
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
