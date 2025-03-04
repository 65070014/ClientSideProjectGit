"use client"

import React, { useState, useEffect } from "react";
import { WeatherSkeleton, AirQualitySkeleton } from "@/components/ui/skeletons";
import Weather from "@/components/ui/Forecast/Weather";
import AirQuality from "@/components/ui/Forecast/AirQuality";
import { Box } from "@mui/material";
import {
  calculateRainChance,
  revertThaiDateToNormalDate,
  WeatherForecastData,
  formatter,
  ForecastData
} from './ui/Forecast/forecastUtils';

type Props = {
  tokenweather: string[];
  tabValue: number;
  province: string;
  weatherSubOption: string;
  forecast: WeatherForecastData[]
  setForecast: React.Dispatch<React.SetStateAction<WeatherForecastData[]>>;
};

const WeatherForecast: React.FC<Props> = ({ tokenweather, weatherSubOption, tabValue, province, forecast, setForecast }) => {
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);
  const [loadingPm, setLoadingPm] = useState<boolean>(true);

  useEffect(() => {
    if (tokenweather !== undefined && tokenweather !== null && tokenweather.length > 0) {
      const forecastData: WeatherForecastData[] = [];

      const fetchWeatherData = async () => {
        setLoadingWeather(true);

        try {
          const now = new Date();
          // Loop for 6 days (including today and the next 5 days)
          for (let i = 0; i < 6; i++) {
            const forecastDate = new Date(now);
            forecastDate.setDate(now.getDate() + i);
            forecastDate.setUTCHours(forecastDate.getUTCHours() + 4);

            // Start time
            const forecastDateStr = forecastDate.toISOString().split(".")[0];
            const dateAndHour = forecastDateStr.slice(0, 13);

            // End time (เพิ่ม 4 ชั่วโมง)
            const endDate = new Date(forecastDate);
            endDate.setUTCHours(endDate.getUTCHours() + 4);
            const endDateStr = endDate.toISOString().split(".")[0];
            const endDateAndHour = endDateStr.slice(0, 13);

            const weatherAPI = `https://data.tmd.go.th/nwpapi/v1/forecast/area/place?domain=1&province=${province}&fields=tc,rh,cond,ws10m,cloudlow,cloudmed,cloudhigh,rain&starttime=${dateAndHour}:00:00&endtime=${endDateAndHour}:00:00`;

            try {
              // Call the API with the specific date
              const response2 = await fetch(weatherAPI, {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "accept": "application/json",
                  "authorization": `Bearer ${tokenweather[0]}`,
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
              } else {
                throw new Error("API response not ok");
              }
            } catch (error) {
              console.error("Error fetching weather data:", error);
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
  }, [tokenweather, province, setForecast]);

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

    <Box sx={{ p: 3 }}>
      {loadingWeather ? (
        <WeatherSkeleton />
      ) : (
        <>
          {(() => {
            if (tabValue === 0 && !loadingWeather) {
              return <Weather forecast={forecast} weatherSubOption={weatherSubOption} />;
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

  )
}

export default WeatherForecast
