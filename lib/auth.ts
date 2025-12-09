import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: false,
    transform: {
      session: {
        fieldMap: {
          sessionToken: "token"
        }
      }
    }
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    generateId: false,
  },
  secret: process.env.BETTER_AUTH_SECRET || "secret-key-change-this",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
})

export type Session = typeof auth.$Infer.Session
