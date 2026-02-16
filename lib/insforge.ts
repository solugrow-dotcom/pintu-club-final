import { createClient } from "insforge-js"

export const insforge = createClient(
  process.env.NEXT_PUBLIC_INSFORGE_URL!,
  process.env.INSFORGE_SERVICE_KEY!
)

// 👇 DB client explicitly expose karo
export const insforgeDb = insforge as any
