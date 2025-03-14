import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req:Request) {
  const Token = await prisma.token.findFirst({
      where: {
        type: "map",
      },
    });
  // Get query parameters
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  

  const weathermapAPI = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${Token?.token}&units=metric`

  try {
    const response = await fetch(weathermapAPI);
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


