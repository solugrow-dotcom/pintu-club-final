"use client"

import { useEffect, useState } from 'react'
import { insforge } from '@/lib/insforge'

export type UserRole = 'SUPER_ADMIN' | 'GYM_OWNER' | 'TRAINER' | 'STAFF'

export interface UserProfile {
    id: string
    email: string
    name: string
    role: UserRole
    gym_id: string | null
    phone?: string
    created_at: string
}

export function useUser() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadUser() {
            try {
                const { data: { user } } = await insforge.auth.getUser()

                if (user) {
                    setUser(user)

                    // Fetch user profile from public.users table
                    const { data: profileData } = await insforge
                        .from('users')
                        .select('*')
                        .eq('id', user.id)
                        .single()

                    if (profileData) {
                        setProfile(profileData as UserProfile)
                    }
                }
            } catch (error) {
                console.error('Error loading user:', error)
            } finally {
                setLoading(false)
            }
        }

        loadUser()

        // Listen for auth changes
        const { data: { subscription } } = insforge.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user)

                const { data: profileData } = await insforge
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                if (profileData) {
                    setProfile(profileData as UserProfile)
                }
            } else {
                setUser(null)
                setProfile(null)
            }
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    return { user, profile, loading }
}
