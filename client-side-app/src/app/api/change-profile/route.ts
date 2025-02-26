// import { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "../../../../prisma/prisma"; 
// import { getSession } from "next-auth/react"; // ใช้ getSession แทน useSession

// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   // ดึง session จาก request
//   const session = await getSession({ req });

//   if (!session || !session.user?.email) {
//     return ({ message: "User not authenticated" });
//   }


//   const { username } = req.body; // ดึง username จาก request body
//   console.log("Username to update:", username); // ตรวจสอบข้อมูลที่รับมา

  
// }
