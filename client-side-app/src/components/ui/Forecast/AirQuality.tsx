"use client"

import { FaCloudscale } from "react-icons/fa"
import {
    WeatherForecastData
} from './forecastUtils';


type Props = {
    forecast: WeatherForecastData[];
};

const Pm25Card: React.FC<Props> = ({ forecast }) => {
    return (
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
    )
}

export default Pm25Card