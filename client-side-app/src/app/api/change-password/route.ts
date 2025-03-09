import { prisma } from "../../../../prisma/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: "Both current and new passwords are required" }, { status: 400 });
  }

  // หา user จาก Database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || !user.password) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // ตรวจสอบรหัสผ่านเดิม
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json({ message: "Current password is incorrect" }, { status: 401 });
  }

  // เข้ารหัสรหัสผ่านใหม่
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // อัปเดตรหัสผ่านใน Database
  await prisma.user.update({
    where: { email: session.user.email },
    data: { password: hashedPassword },
  });

  //Logout โดยเคลียร์ Session
  return NextResponse.json({ message: "Password updated successfully. Please log in again." }, { status: 200 });
}
