"use client"

import React, { useState, useEffect } from "react";
import ThailandMap from "@/components/ThailandMap"
import WeatherForecast from "@/components/WeatherForecast"
import Header from "@/components/ui/header"
import { Card, CardContent, CardHeader } from "@mui/material";
import { Tabs, Tab } from "@mui/material";
import SelectProvince from "@/components/SelectProvince";
import { useWarningStore } from "@/store/warningStore";

export default function Home() {
  const [tokenweather, setTokenweather] = useState<string[]>([]);
  const [weatherSubOption, setWeatherSubOption] = useState<"temperature" | "wind" | "rain" | "humidity">("temperature")
  const [tabValue, setTabValue] = useState<number>(0)
  const [province, setProvince] = useState<string>("กรุงเทพมหานคร")
  const warningMessage = useWarningStore((state) => state.warningMessage);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response1 = await fetch("/api/weathertoken/");

        if (!response1.ok) {
          throw new Error("Failed to fetch token");
        }

        const result = await response1.json();
        setTokenweather(result.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();

  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-8">
      
      <Header />
      
      <div className="max-w-7xl mx-auto pt-16 p-4">
        
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-800 drop-shadow-md">
          
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Interactive Map</h2>
            <ThailandMap tokenweather={tokenweather} weatherSubOption={weatherSubOption} tabValue={tabValue} setProvince={setProvince} />
          </div>
          <div>
          {warningMessage ? (
        <p className="mt-3 text-center text-yellow-600 font-semibold bg-yellow-100 p-2 rounded-lg">
          {warningMessage}
        </p>
      ) : null}
            <Card className="w-full bg-white shadow-lg">
              <CardHeader className="bg-blue-600 text-white">
                <CardHeader className="text-2xl">Weather and PM2.5 Forecast</CardHeader>
              </CardHeader>
              <CardContent className="p-6">
                <SelectProvince province={province} setProvince={setProvince} />
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
                  <Tab label="Weather" />
                  <Tab label="PM2.5" />
                </Tabs>
                
                <div>
                  
                  {tabValue !== 1 && (
                    <div className="mb-4">
                      <Tabs value={weatherSubOption} onChange={(e, newValue) => setWeatherSubOption(newValue)} centered>
                        <Tab label="Temp" value="temperature" />
                        <Tab label="Wind" value="wind" />
                        <Tab label="Rain" value="rain" />
                        <Tab label="Humidity" value="humidity" />
                      </Tabs>
                    </div>
                  )}
                  <WeatherForecast tokenweather={tokenweather} weatherSubOption={weatherSubOption} tabValue={tabValue} province={province} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

