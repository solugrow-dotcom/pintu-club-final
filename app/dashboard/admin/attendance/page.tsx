"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/useUser"
import { insforge } from "@/lib/insforge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Calendar, UserCheck, Clock } from "lucide-react"

export default function AttendancePage() {
    const { profile } = useUser()
    const [attendance, setAttendance] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAttendance = async () => {
        if (!profile?.gym_id) return
        setLoading(true)
        const { data, error } = await insforge
            .from('attendance')
            .select(`
                *,
                members(name)
            `)
            .eq('gym_id', profile.gym_id)
            .order('timestamp', { ascending: false })

        if (!error && data) {
            setAttendance(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (profile?.gym_id) {
            fetchAttendance()

            const channel = insforge.channel('public:attendance')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'attendance', filter: `gym_id=eq.${profile.gym_id}` },
                    () => {
                        fetchAttendance()
                    }
                )
                .subscribe()

            return () => {
                insforge.removeChannel(channel)
            }
        }
    }, [profile?.gym_id])

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h2 className="text-3xl font-bold">Attendance Logs</h2>
                    <p className="text-zinc-400">Real-time check-in history</p>
                </div>

                <Card className="border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Check-ins</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-900 border-y border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Member</th>
                                        <th className="px-6 py-3 font-semibold">Date</th>
                                        <th className="px-6 py-3 font-semibold">Time</th>
                                        <th className="px-6 py-3 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {loading && attendance.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center"><Loader2 className="animate-spin inline-block mr-2" /> Loading...</td>
                                        </tr>
                                    ) : attendance.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No attendance records yet.</td>
                                        </tr>
                                    ) : (
                                        attendance.map((record) => (
                                            <tr key={record.id} className="hover:bg-zinc-900 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                                                            <UserCheck className="w-4 h-4" />
                                                        </div>
                                                        <span className="font-medium">{record.members?.name || "Deleted Member"}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 flex items-center gap-2">
                                                    <Calendar className="w-3 h-3 text-zinc-500" />
                                                    {new Date(record.timestamp).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3 h-3 text-zinc-500" />
                                                        {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Present</span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
