import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const map = await prisma.mapSaved.findFirst({
    where: { id: '67d34c73fd3549ed768574e7' }
  });
  // Get query parameters

  try {
    return new Response(
      JSON.stringify({
        provincesColorMap: map?.provincesColorMap,
        times: map?.time, // เพิ่มข้อมูล times ไปด้วย
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response("Error fetching data", {
      status: 500,
      headers: {},
    });
  }
}


  export async function POST(req: Request) {
    const body = await req.json();

    try {
      await prisma.mapSaved.update({
        where: { id: '67d34c73fd3549ed768574e7' },
        data: {
          provincesColorMap: body
        },
      });

      return new Response('Update successful', {
        status: 200, // Success
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      return new Response("Error fetching data"), {
        status: 500,
        headers: {},
      };
    }
  }


