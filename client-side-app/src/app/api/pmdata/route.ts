import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req:Request) {
  const Token = await prisma.token.findFirst({
      where: {
        type: "PM",
      },
    });
  // Get query parameters
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");


  const pmAPI = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${Token?.token[0]}`;

  try {
    const response = await fetch(pmAPI);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Send the response data back to the frontend
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response("Error fetching data"), {
      status: 500,
      headers: {},
    };
  }
}


