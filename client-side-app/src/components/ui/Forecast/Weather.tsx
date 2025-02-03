"use client"

import React, { useState} from "react"
import { Tabs, Tab} from "@mui/material"
import {
    getWeatherIcon,
    renderWeatherSubOption,
    getSubOptionIcon,
    WeatherForecastData
  } from './forecastUtils';


type Props = {
    forecast: WeatherForecastData[];
};

const WeatherForecastCard: React.FC<Props> = ({ forecast }) => {
    const [weatherSubOption, setWeatherSubOption] = useState<"temperature" | "wind" | "rain" | "humidity">("temperature")
    return (
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
                                {renderWeatherSubOption(forecast[0], weatherSubOption)}
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end space-x-2">
                                    {getSubOptionIcon(weatherSubOption)}
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
                                {renderWeatherSubOption(day, weatherSubOption)}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default WeatherForecastCard