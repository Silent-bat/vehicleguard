import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email },
      select: { isApproved: true, role: true },
    })

    if (!user) {
      return NextResponse.json(
        { approved: false, message: "User not found" },
        { status: 404 }
      )
    }

    // Admins are always approved
    if (user.role === "ADMIN") {
      return NextResponse.json({ approved: true })
    }

    if (!user.isApproved) {
      return NextResponse.json(
        { 
          approved: false, 
          message: "Your account is pending approval from an administrator. Please contact your administrator." 
        },
        { status: 403 }
      )
    }

    return NextResponse.json({ approved: true })
  } catch (error) {
    console.error("Error checking approval:", error)
    return NextResponse.json(
      { approved: false, message: "Error checking account status" },
      { status: 500 }
    )
  }
}
