"use client"

import React, { useState, useEffect } from "react"
import { JSX } from 'react'
import { Card, CardContent, CardHeader } from "@mui/material"
import { Tabs, Tab, Box } from "@mui/material"
import { WiDaySunny, WiCloudy, WiRain, WiStrongWind, WiThunderstorm, WiThermometer, WiSnow, WiHot, WiRaindrops } from "react-icons/wi"
import { FaCloudscale } from "react-icons/fa"
import SelectProvince from "@/components/SelectProvince"
import { ClipLoader } from 'react-spinners';

interface WeatherForecastData {
  date: string
  temperature: number
  windSpeed: number
  rainChance: number
  pm25: number
  weather: number
  humidity: number
}
const calculateRainChance = (rh: number, cloudlow: number, cloudmed: number, cloudhigh: number, tc: number, ws10m: number, rain: number) => {
  let chance = 0;

  if (rh > 80) {
    chance += 30;
  }

  if (cloudlow > 50) {
    chance += 25;
  } else if (cloudlow > 30) {
    chance += 15;
  }

  if (cloudmed > 50) {
    chance += 20;
  }

  if (cloudhigh > 50) {
    chance += 10;
  }

  if (tc > 30) {
    chance += 10;
  } else if (tc < 20) {
    chance -= 5;
  }

  if (ws10m > 10) {
    chance += 5;
  }

  if (rain > 10) {
    chance += 50;
  }


  // Make sure the chance is within 0-100 range
  chance = Math.min(100, Math.max(0, chance));

  return chance;
};

const WeatherForecast = (): JSX.Element => {
  const [tokenweather, setTokenweather] = useState<string>("");
  const [tokenPm, settokenPm] = useState<string>("");
  const [forecast, setForecast] = useState<WeatherForecastData[]>([])
  const [weatherSubOption, setWeatherSubOption] = useState<"temperature" | "wind" | "rain" | "humidity">("temperature")
  const [tabValue, setTabValue] = useState<number>(0)
  const [province, setProvince] = useState<string>("กรุงเทพมหานคร")
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response1 = await fetch("/api/weather/");

        if (!response1.ok) {
          throw new Error("Failed to fetch token");
        }

        const result = await response1.json();
        let tokenAsString = String(result.token);
        setTokenweather(tokenAsString); // Set token

        const response1_Pm = await fetch("/api/pmtoken/");

        if (!response1.ok) {
          throw new Error("Failed to fetch PM token");
        }

        const resultPm = await response1_Pm.json();
        tokenAsString = String(resultPm.token);
        settokenPm(tokenAsString);


      } catch (error) {
        console.error("Error fetching token:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchToken(); // Call the function to fetch token

  }, []); // Empty dependency array to run only once on mount

  // Second fetch: Get weather data using the token
  useEffect(() => {
    if (tokenweather) {  // Only fetch weather data if token is available
      const forecastData: WeatherForecastData[] = [];
      const fetchWeatherData = async () => {
        setLoading(true);
        try {
          const now = new Date();

          // Loop for 6 days (including today and the next 5 days)
          for (let i = 0; i < 6; i++) {
            // Calculate the forecast date
            const forecastDate = new Date(now);
            forecastDate.setDate(now.getDate() + i);  // Add i days to the current date
            forecastDate.setHours(forecastDate.getHours());

            // Format the date to ISO string format "yyyy-mm-dd"
            const forecastDateStr = forecastDate.toISOString().split(".")[0];
            const dateAndHour = forecastDateStr.slice(0, 13);

            const weatherAPI = `https://data.tmd.go.th/nwpapi/v1/forecast/area/place?domain=1&province=${province}&fields=tc,rh,cond,ws10m,cloudlow,cloudmed,cloudhigh,rain&starttime=${dateAndHour}:00:00`;

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
              const formatter = new Intl.DateTimeFormat('th-TH', {
                day: '2-digit',
                month: 'short',
              });

              const lat = data.WeatherForecasts[0].location.lat;
              const lon = data.WeatherForecasts[0].location.lon;
              const pmAPI = `/api/pmdata?lat=${lat}&lon=${lon}&tokenPm=${tokenPm}`;

              
              const response2Pm = await fetch(pmAPI, {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "accept": "application/json",
                }
              });
              
              if (response2Pm.ok) {
                const pmdata = await response2.json();
                console.log(pmdata)
              }

              const forecastItem: WeatherForecastData = {
                date: formatter.format(new Date(forecastDateStr)),
                temperature: forecast.tc,
                humidity: forecast.rh,
                windSpeed: forecast.ws10m,
                rainChance: calculateRainChance(forecast.rh, forecast.cloudlow, forecast.cloudmed, forecast.cloudhigh, forecast.tc, forecast.ws10m, forecast.rain),
                pm25: 10,
                weather: forecast.cond,
              };
              forecastData.push(forecastItem);
            } else {
              console.error("Failed to fetch weather data");
            }
          }
          setForecast(forecastData);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }finally {
          setLoading(false);
        }
      };

      fetchWeatherData();  // Call the function to fetch weather data
    }
  }, [tokenweather, province, tokenPm]);



  const getWeatherIcon = (weatherCode: number): JSX.Element => {
    switch (weatherCode) {
      case 1:
        return <WiDaySunny className="w-8 h-8 text-yellow-400" />; // ท้องฟ้าแจ่มใส (Clear)
      case 2:
        return <WiCloudy className="w-8 h-8 text-gray-400" />; // มีเมฆบางส่วน (Partly cloudy)
      case 3:
        return <WiCloudy className="w-8 h-8 text-gray-400" />; // เมฆเป็นส่วนมาก (Cloudy)
      case 4:
        return <WiCloudy className="w-8 h-8 text-gray-600" />; // มีเมฆมาก (Overcast)
      case 5:
        return <WiRain className="w-8 h-8 text-blue-400" />; // ฝนตกเล็กน้อย (Light rain)
      case 6:
        return <WiRain className="w-8 h-8 text-blue-500" />; // ฝนปานกลาง (Moderate rain)
      case 7:
        return <WiRain className="w-8 h-8 text-blue-600" />; // ฝนตกหนัก (Heavy rain)
      case 8:
        return <WiThunderstorm className="w-8 h-8 text-purple-500" />; // ฝนฟ้าคะนอง (Thunderstorm)
      case 9:
        return <WiSnow className="w-8 h-8 text-blue-300" />; // อากาศหนาวจัด (Very cold)
      case 10:
        return <WiSnow className="w-8 h-8 text-blue-400" />; // อากาศหนาว (Cold)
      case 11:
        return <WiSnow className="w-8 h-8 text-blue-500" />; // อากาศเย็น (Cool)
      case 12:
        return <WiHot className="w-8 h-8 text-red-500" />; // อากาศร้อนจัด (Very hot)
      default:
        return <WiCloudy className="w-8 h-8 text-gray-400" />; // Default to cloudy if the code doesn't match
    }
  }


  const renderWeatherSubOption = (day: WeatherForecastData): JSX.Element => {
    switch (weatherSubOption) {
      case "temperature":
        return <span className="text-2xl font-bold">{day.temperature}°C</span>
      case "wind":
        return <span className="text-2xl font-bold">{day.windSpeed} km/h</span>
      case "rain":
        return <span className="text-2xl font-bold">{day.rainChance}%</span>
      case "humidity":
        return <span className="text-2xl font-bold">{day.humidity}%</span>
      default:
        return <></>
    }
  }

  const getSubOptionIcon = (): JSX.Element | null => {
    switch (weatherSubOption) {
      case "temperature":
        return <WiThermometer className="w-6 h-6 text-red-500" />
      case "wind":
        return <WiStrongWind className="w-6 h-6 text-blue-500" />
      case "rain":
        return <WiRain className="w-6 h-6 text-blue-500" />
      case "humidity":
        return <WiRaindrops className="w-6 h-6 text-blue-500" />
      default:
        return null
    }
  }

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
          {loading ? (
            <div className="flex justify-center items-center">
              <ClipLoader size={50} color="#4b9cd3" />
            </div>
          ) : (
            <>
              {tabValue === 0 && (
                <div>
                  <div className="mb-4">
                    <Tabs value={weatherSubOption} onChange={(e, newValue) => setWeatherSubOption(newValue)} centered>
                      <Tab label="Temp" value="temperature" />
                      <Tab label="Wind" value="wind" />
                      <Tab label="Rain" value="rain" />
                      <Tab label="Humidity" value="humidity" />
                    </Tabs>
                  </div>
                  {forecast.length > 0 && (
                    <>
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">{forecast[0].date} (Today)</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getWeatherIcon(forecast[0].weather)}
                            {renderWeatherSubOption(forecast[0])}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                               {getSubOptionIcon()}
                              <span>{weatherSubOption.charAt(0).toUpperCase() + weatherSubOption.slice(1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {forecast.slice(1).map((day, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded-lg shadow-sm text-center">
                            <p className="font-semibold">{day.date}</p>
                            {getWeatherIcon(day.weather)}
                            {renderWeatherSubOption(day)}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
              {tabValue === 1 && (
                <div>
                  {forecast.length > 0 && (
                    <>
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">{forecast[0].date} (Today)</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <FaCloudscale className="w-8 h-8 text-blue-500" />
                            <span className="text-2xl font-bold">PM2.5: {forecast[0].pm25} µg/m³</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {forecast.slice(1).map((day, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded-lg shadow-sm text-center">
                            <p className="font-semibold">{day.date}</p>
                            <FaCloudscale className="w-8 h-8 text-blue-500 mx-auto my-2" />
                            <p className="text-lg font-bold">PM2.5: {day.pm25}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default WeatherForecast
