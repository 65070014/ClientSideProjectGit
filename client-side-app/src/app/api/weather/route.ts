import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const Token = await prisma.VerificationToken.findFirst();
    console.log(Token)

    // Return the data as JSON response
    return new Response(JSON.stringify(Token), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch weather data" }),
      {
        status: 500,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}