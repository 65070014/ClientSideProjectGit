"use client"

import React, { useState, useEffect } from "react";
import { WeatherSkeleton, AirQualitySkeleton } from "@/components/ui/skeletons";
import { Card, CardContent, CardHeader } from "@mui/material";
import { Tabs, Tab, Box } from "@mui/material";
import SelectProvince from "@/components/SelectProvince";
import Weather from "@/components/ui/Forecast/Weather";
import AirQuality from "@/components/ui/Forecast/AirQuality";
import {
  calculateRainChance,
  revertThaiDateToNormalDate,
  WeatherForecastData,
  formatter,
  ForecastData
} from './ui/Forecast/forecastUtils';

type Props = {
  tokenweather: string;
};

const WeatherForecast: React.FC<Props> = ({ tokenweather }) => {
  const [forecast, setForecast] = useState<WeatherForecastData[]>([])
  const [tabValue, setTabValue] = useState<number>(0)
  const [province, setProvince] = useState<string>("กรุงเทพมหานคร")
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);
  const [loadingPm, setLoadingPm] = useState<boolean>(true);
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (tokenweather) {
      const forecastData: WeatherForecastData[] = [];

      const fetchWeatherData = async () => {
        setLoadingWeather(true);
        let retries = 0;
        const maxRetries = 3;

        try {
          await delay(1000);
          const now = new Date();

          // Loop for 6 days (including today and the next 5 days)
          for (let i = 0; i < 6; i++) {
            const forecastDate = new Date(now);
            forecastDate.setDate(now.getDate() + i);  // Add i days to the current date
            forecastDate.setUTCHours(forecastDate.getUTCHours() + 4 + retries); // Add 4 hours to the UTC time

            // Format the date to ISO string format "yyyy-mm-dd"
            let forecastDateStr = forecastDate.toISOString().split(".")[0];
            const dateAndHour = forecastDateStr.slice(0, 13);

            
            let weatherAPI = `https://data.tmd.go.th/nwpapi/v1/forecast/area/place?domain=1&province=${province}&fields=tc,rh,cond,ws10m,cloudlow,cloudmed,cloudhigh,rain&starttime=${dateAndHour}:00:00`;

            let success = false;
            while (retries < maxRetries && !success) {
              try {
                // Call the API with the specific date
                const response2 = await fetch(weatherAPI, {
                  headers: {
                    "Access-Control-Allow-Origin": "*",
                    "accept": "application/json",
                    "authorization": `Bearer ${tokenweather}`,
                  }
                });

                if (response2.ok) {
                  const data = await response2.json();
                  const forecast = data.WeatherForecasts[0].forecasts[0].data;

                  const forecastItem: WeatherForecastData = {
                    date: formatter.format(new Date(forecastDateStr)),
                    temperature: forecast.tc,
                    humidity: forecast.rh,
                    windSpeed: forecast.ws10m,
                    rainChance: calculateRainChance(forecast.rh, forecast.cloudlow, forecast.cloudmed, forecast.cloudhigh, forecast.tc, forecast.ws10m, forecast.rain),
                    pm25: 0,
                    weather: forecast.cond,
                    lat: data.WeatherForecasts[0].location.lat,
                    lon: data.WeatherForecasts[0].location.lon
                  };

                  forecastData.push(forecastItem);
                  success = true;
                  retries = 0;
                } else {
                  throw new Error("API response not ok");
                }
              } catch (error) {
                retries++;
                if (retries < maxRetries) {
                  console.log(`Retrying... Adding 1 hour. Attempt ${retries}/${maxRetries}`);
                  forecastDate.setHours(forecastDate.getHours() + 1); // Add 1 hour if the fetch fails
                  forecastDateStr = forecastDate.toISOString().split(".")[0];
                  weatherAPI = `https://data.tmd.go.th/nwpapi/v1/forecast/area/place?domain=1&province=${province}&fields=tc,rh,cond,ws10m,cloudlow,cloudmed,cloudhigh,rain&starttime=${forecastDateStr.slice(0, 13)}:00:00`;
                } else {
                  console.error("Error fetching weather data:", error);
                }
              }
            }

            if (!success) {
              console.error("Failed after maximum retries for forecast date", forecastDateStr);
            }
          }

          setForecast(forecastData);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        } finally {
          setLoadingWeather(false);
        }
      };

      fetchWeatherData();  // Call the function to fetch weather data
    }
  }, [tokenweather, province]);

  useEffect(() => {
    const fetchPmData = async () => {
      if (forecast.length > 0) {
        setLoadingPm(true);
        let forcastdata = (forecast[0]);
        const lat = forcastdata.lat;
        const lon = forcastdata.lon;
        const response2Pm = await fetch(`/api/pmdata?lat=${lat}&lon=${lon}`);
        if (response2Pm.ok) {
          const pmdata = await response2Pm.json();
          for (let i = 0; i < forecast.length; i++) {
            if (i == 0) {
              forcastdata.pm25 = pmdata.data.aqi
            } else {
              forcastdata = forecast[i];
              const forcast: ForecastData[] = pmdata.data.forecast.daily.pm25;
              const foundData = forcast.find(item => item.day === revertThaiDateToNormalDate(forcastdata.date));
              forecast[i].pm25 = foundData?.avg ?? 0
            }
          }
          setLoadingPm(false);
        }
      }
    }
    fetchPmData()
  }, [forecast]);

  return (
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
        <Box sx={{ p: 3 }}>
          {loadingWeather ? (
            <WeatherSkeleton />
          ) : (
            <>
              {(() => {
                if (tabValue === 0 && !loadingWeather) {
                  return <Weather forecast={forecast} />;
                } else if (tabValue === 1 && !loadingPm) {
                  return <AirQuality forecast={forecast} />;
                } else if (tabValue === 0) {
                  return <WeatherSkeleton />;
                } else {
                  return <AirQualitySkeleton />;
                }
              })()}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default WeatherForecast
