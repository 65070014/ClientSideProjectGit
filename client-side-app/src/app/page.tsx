"use client"

import React, { useState, useEffect } from "react";
import ThailandMap from "@/components/ThailandMap"
import WeatherForecast from "@/components/WeatherForecast"
import Header from "@/components/ui/header"
import { Card, CardContent, CardHeader } from "@mui/material";
import { Tabs, Tab } from "@mui/material";
import SelectProvince from "@/components/SelectProvince";
import { useWarningStore } from "@/store/warningStore";
import { WeatherForecastData } from '../components/ui/Forecast/forecastUtils';

export default function Home() {
  const [tokenweather, setTokenweather] = useState<string[]>([]);
  const [weatherSubOption, setWeatherSubOption] = useState<"temperature" | "wind" | "rain" | "humidity">("temperature")
  const [tabValue, setTabValue] = useState<number>(0)
  const [province, setProvince] = useState<string>("กรุงเทพมหานคร")
  const [forecast, setForecast] = useState<WeatherForecastData[]>([])
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

      <div className="w-full pt-16 p-4">
        <SelectProvince {...{ province, setProvince, forecast }} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Card พยากรณ์อากาศล่วงหน้า 5 วัน */}
          <div>
            {warningMessage ? (
              <p className="mt-3 text-center text-yellow-600 font-semibold bg-yellow-100 p-2 rounded-lg">
                {warningMessage}
              </p>
            ) : null}

            <Card className="w-full bg-white shadow-lg">
              <CardHeader className="bg-blue-600 text-white text-2xl p-0 m-0">
                พยากรณ์อากาศล่วงหน้า 5 วัน
              </CardHeader>
              <div className="flex justify-center items-center">
                <h2 className="text-xl font-semibold mt-4">พยากรณ์อากาศล่วงหน้า 5 วัน</h2>
              </div>
              <CardContent className="p-6">
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
                  <WeatherForecast {...{ tokenweather, weatherSubOption, tabValue, province, forecast, setForecast }} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Card แผนที่สภาพอากาศวันนี้ */}
          <div>
            <Card className="bg-white rounded-lg shadow-lg">
              <CardHeader className="bg-blue-600 text-white text-2xl p-0 m-0"></CardHeader>
              <div className="flex justify-center items-center">
                <h2 className="text-xl font-semibold mt-4">แผนที่สภาพอากาศวันนี้</h2>
              </div>
              <ThailandMap {...{ tokenweather, weatherSubOption, tabValue, setProvince }} />
            </Card>
          </div>

        </div>
      </div>
    </main>
  )
}

