"use client"

import React, { useState, useEffect} from "react";
import ThailandMap from "@/components/ThailandMap"
import WeatherForecast from "@/components/WeatherForecast"

export default function Home() {
  const [tokenweather, setTokenweather] = useState<string>("");
  useEffect(() => {
      const fetchToken = async () => {
        try {
          const response1 = await fetch("/api/weathertoken/");
  
          if (!response1.ok) {
            throw new Error("Failed to fetch token");
          }
  
          const result = await response1.json();
          const tokenAsString = String(result.token);
          setTokenweather(tokenAsString); // Set token
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      };
  
      fetchToken();
  
    }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-800 drop-shadow-md">
          Thailand Weather and PM2.5 Forecast
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Interactive Map</h2>
            <ThailandMap tokenweather={tokenweather}/>
          </div>
          <div>
            <WeatherForecast tokenweather={tokenweather}/>
          </div>
        </div>
      </div>
    </main>
  )
}

