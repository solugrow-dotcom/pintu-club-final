"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"
import { insforge } from "@/lib/insforge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, IndianRupee, Activity, Dumbbell, Plus, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
    const { profile } = useUser()
    const [stats, setStats] = useState({
        totalMembers: 0,
        monthlyRevenue: 0,
        activeWorkouts: 0,
        dailyAttendance: 0
    })
    const [members, setMembers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            if (!profile?.gym_id) return
            setLoading(true)

            try {
                const { count: memberCount } = await insforge.from('members').select('*', { count: 'exact' }).eq('gym_id', profile.gym_id)
                const { data: payments } = await insforge.from('payments').select('amount').eq('gym_id', profile.gym_id)
                const { count: workoutCount } = await insforge.from('workouts').select('*', { count: 'exact' }).eq('gym_id', profile.gym_id)

                const today = new Date().toISOString().split('T')[0]
                const { count: attendanceCount } = await insforge
                    .from('attendance')
                    .select('*', { count: 'exact' })
                    .eq('gym_id', profile.gym_id)
                    .gte('timestamp', today)

                const revenue = payments?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0

                setStats({
                    totalMembers: memberCount || 0,
                    monthlyRevenue: revenue,
                    activeWorkouts: workoutCount || 0,
                    dailyAttendance: attendanceCount || 0
                })

                const { data: memberData } = await insforge
                    .from('members')
                    .select('*')
                    .eq('gym_id', profile.gym_id)
                    .order('created_at', { ascending: false })
                    .limit(5)

                if (memberData) setMembers(memberData)
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }

        if (profile?.gym_id) {
            fetchStats()

            const channel = insforge.channel('public:attendance')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'attendance', filter: `gym_id=eq.${profile.gym_id}` }, () => {
                    fetchStats()
                })
                .subscribe()

            return () => {
                insforge.removeChannel(channel)
            }
        }
    }, [profile?.gym_id])

    if (loading) return <div className="flex justify-center items-center h-screen bg-black"><Loader2 className="animate-spin text-white" /></div>

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold">Dashboard</h1>
                        <p className="text-zinc-400">Welcome back, {profile?.name}</p>
                    </div>
                    <Link href="/auth/login">
                        <Button variant="outline">Logout</Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Members", value: stats.totalMembers, icon: Users },
                        { label: "Monthly Revenue", value: `₹${stats.monthlyRevenue.toLocaleString()}`, icon: IndianRupee },
                        { label: "Active Workouts", value: stats.activeWorkouts, icon: Dumbbell },
                        { label: "Daily Attendance", value: stats.dailyAttendance, icon: Activity },
                    ].map((stat, i) => (
                        <Card key={i} className="border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-400">{stat.label}</CardTitle>
                                <stat.icon className="w-4 h-4 text-white" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Members</CardTitle>
                        <Link href="/dashboard/admin/members">
                            <Button size="sm">
                                <Plus className="mr-2 h-4 w-4" /> Add Member
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {members.length === 0 ? (
                                <p className="text-center text-zinc-500 py-8">No members yet. Add your first member!</p>
                            ) : (
                                members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                                        <div>
                                            <p className="font-semibold">{member.name}</p>
                                            <p className="text-sm text-zinc-400">{member.email}</p>
                                        </div>
                                        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Active</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-6">
                    <Link href="/dashboard/admin/members">
                        <Card className="border-zinc-800 hover:border-white transition cursor-pointer">
                            <CardContent className="pt-6 text-center">
                                <Users className="w-12 h-12 mx-auto mb-4 text-white" />
                                <h3 className="font-bold text-lg">Manage Members</h3>
                                <p className="text-sm text-zinc-400 mt-2">Add, view, and manage gym members</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/dashboard/admin/plans">
                        <Card className="border-zinc-800 hover:border-white transition cursor-pointer">
                            <CardContent className="pt-6 text-center">
                                <IndianRupee className="w-12 h-12 mx-auto mb-4 text-white" />
                                <h3 className="font-bold text-lg">Subscription Plans</h3>
                                <p className="text-sm text-zinc-400 mt-2">Create and manage membership plans</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/dashboard/admin/attendance">
                        <Card className="border-zinc-800 hover:border-white transition cursor-pointer">
                            <CardContent className="pt-6 text-center">
                                <Activity className="w-12 h-12 mx-auto mb-4 text-white" />
                                <h3 className="font-bold text-lg">Attendance</h3>
                                <p className="text-sm text-zinc-400 mt-2">Track member check-ins</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}
