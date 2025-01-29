"use client"

import React, { useState, useEffect } from "react"
import { JSX } from 'react'
import { Card, CardContent, CardHeader} from "@mui/material"
import { Tabs, Tab, Box } from "@mui/material"
import { WiDaySunny, WiCloudy, WiRain, WiStrongWind, WiHumidity, WiThermometer } from "react-icons/wi"
import { FaCloudscale } from "react-icons/fa"
import province from "./SelectProvince"
import SelectProvince from "@/components/SelectProvince"

interface WeatherForecastData {
  date: string
  temperature: number
  windSpeed: number
  rainChance: number
  pm25: number
  weather: "sunny" | "cloudy" | "rainy"
}

const WeatherForecast = (): JSX.Element => {
  const [forecast, setForecast] = useState<WeatherForecastData[]>([])
  const [weatherSubOption, setWeatherSubOption] = useState<"temperature" | "wind" | "rain">("temperature")
  const [tabValue, setTabValue] = useState<number>(0)
  
  console.log(province);
  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        // Replace with your actual API endpoint
        
        const response = await fetch("https://data.tmd.go.th/nwpapi/v1/forecast/area/place?domain=1&province=นครปฐม", {
          headers:{
            "Access-Control-Allow-Origin": "*",
            "accept": "application/json",
            "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjUzN2M1Mjk3OWRlMzc3YTdkMTBlN2U1ZTk5OTMwNjRmNjY5MzI0MzA4NTJhZmMzNzg2MjQ3NmJkYjFmMTc2MTUyODcxZjMyY2M4ZGFiMjMzIn0.eyJhdWQiOiIyIiwianRpIjoiNTM3YzUyOTc5ZGUzNzdhN2QxMGU3ZTVlOTk5MzA2NGY2NjkzMjQzMDg1MmFmYzM3ODYyNDc2YmRiMWYxNzYxNTI4NzFmMzJjYzhkYWIyMzMiLCJpYXQiOjE3MzgxNTM0NjEsIm5iZiI6MTczODE1MzQ2MSwiZXhwIjoxNzY5Njg5NDYxLCJzdWIiOiIzNjg0Iiwic2NvcGVzIjpbXX0.wVw-gmt3d3DKu_zm5Xz0zCOdynlzOUP3P93TIphid5_jxpRI2a2Kh1d-imb8qJW1QZ7J5zOO8pliO0WDeJTJHZndbqs_d258sRWj_RRWiGcBhkA4OMPrFJ8kmHSJMCh4PTrbB1d-kx7m2ICof7joqjbIb4et5764IkzIstKpH5BRHn-JFwlsXjYXjb5fNSyksrK5ksARJkemxNXSvY2_vcmU7wu0mLIZ7pQbwGGBVfWXB6U4yOnL2nz4pc7hZYhsTTS4QkB5Tbb9jE-PiUe4qoUOCi8IuU2SmKwb4FwgnEZOKN8oJ76XJhgia_wSZTQ936qv6hcpq8KahQqr2CKpiXSg7If3Iyd60OM5_pD8g2YR_vr-K-zSOKF0lYl2M24SmKOuRCA8-XEOc9wIBE3wAQyNT1SskLq8NqpCZoMGx2Ip1XDdNdGZIJ5hL1VB2-ozrcbSmCPhPrt0JHTnlBFgJlKeSTa3rRe_g55xqyAMRsj2few5RgseqS31lAqXgyWKK7wVRYNbYz2klOWNbQenNNv6zFjEIHFqI382By8nn4WvDLlOlJH2aUC2x1fG-TAZXQk6V41lFN3OZu1y6P8vgJZ0NzWu10-qpfOfYoaJ-GIynNjJ_1Vk-x-aWTGFee86I4_3W0iPwzbbKQXErRYdb-KFOAhNkZhhhyd5dj2MkHo",
          }
        })
        const data = await response.json();
        console.log(data);
        
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };
    fetchForecastData();
  }, [])


  const getWeatherIcon = (weather: "sunny" | "cloudy" | "rainy"): JSX.Element => {
    switch (weather) {
      case "sunny":
        return <WiDaySunny className="w-8 h-8 text-yellow-400" />
      case "cloudy":
        return <WiCloudy className="w-8 h-8 text-gray-400" />
      case "rainy":
        return <WiRain className="w-8 h-8 text-blue-400" />
      default:
        return <WiCloudy className="w-8 h-8 text-gray-400" />
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
        <SelectProvince />
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
          <Tab label="Weather" />
          <Tab label="PM2.5" />
        </Tabs>
        <Box sx={{ p: 3 }}>
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
        </Box>
      </CardContent>
    </Card>
  )
}

export default WeatherForecast
