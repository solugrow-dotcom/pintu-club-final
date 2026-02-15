import { createClient } from '@insforge/sdk'

const apiUrl = process.env.NEXT_PUBLIC_INSFORGE_API_URL
const apiKey = process.env.NEXT_PUBLIC_INSFORGE_API_KEY

if (!apiUrl || !apiKey) {
    console.warn('⚠️ InsForge credentials missing. Using mock adapter.')
}

export const insforge = createClient({
    baseUrl: apiUrl || 'https://xt68ppra.ap-southeast.insforge.app',
    anonKey: apiKey || 'mock-key'
})
