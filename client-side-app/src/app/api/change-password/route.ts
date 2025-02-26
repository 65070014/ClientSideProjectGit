// import { prisma } from "../../../../prisma/prisma"; 
// import bcrypt from "bcryptjs";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const { currentPassword, newPassword } = await req.json();
//   const user = await prisma.user.findUnique({ where: { email: session.user.email } });

//   if (!user || !user.password || !bcrypt.compareSync(currentPassword, user.password)) {
//     return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
//   }

//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   await prisma.user.update({
//     where: { email: session.user.email },
//     data: { password: hashedPassword },
//   });

//   return NextResponse.json({ message: "Password updated successfully" });
// }
