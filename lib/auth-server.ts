import { cookies, headers } from "next/headers"
import { auth } from "./auth"
import { cache } from "react"

export const getSession = cache(async () => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("better-auth.session_token")?.value ||
    cookieStore.get("__Secure-better-auth.session_token")?.value

  if (!sessionToken) {
    return null
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    return session
  } catch (error) {
    return null
  }
})

export const getCurrentUser = cache(async () => {
  const session = await getSession()
  return session?.user ?? null
})

export const requireAuth = async () => {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  return user
}

export const requireAdmin = async () => {
  const user = await requireAuth()

  if (user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required")
  }

  return user
}
