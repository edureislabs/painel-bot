// app/api/auth/callback/discord/route.ts
import { handlers } from "@/auth"

// Exporta apenas o GET e POST do handler (o Discord usa GET no callback)
export const { GET, POST } = handlers