import { prisma } from "../../../../prisma/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  console.log("Received body:", body); // ✅ Debug ข้อมูลที่รับมา

  const { username } = body;
  if (!username) {
    return NextResponse.json({ message: "Username is required" }, { status: 400 });
  }
  session.user.username = username; 
  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email }, // หา user จาก email ใน session
      data: { username }, // อัปเดต username
    });
    
    console.log("Updated User:", updatedUser); // ✅ ตรวจสอบว่าค่าถูกอัปเดตจริงไหม
    return NextResponse.json({ message: "Profile updated", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
