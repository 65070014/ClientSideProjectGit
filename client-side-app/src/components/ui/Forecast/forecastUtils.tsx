import { WiDaySunny, WiCloudy, WiRain, WiStrongWind, WiThunderstorm, WiThermometer, WiSnow, WiHot, WiRaindrops } from "react-icons/wi"
import { JSX } from 'react'

export type ForecastData = {
    day: string;
    avg: number;
    max: number;
    min: number;
};

export interface WeatherForecastData {
    date: string
    temperature: number
    windSpeed: number
    rainChance: number
    pm25: number
    weather: number
    humidity: number
    lat: number
    lon: number
}
export const formatter = new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
});

export const calculateRainChance = (rh: number, cloudlow: number, cloudmed: number, cloudhigh: number, tc: number, ws10m: number, rain: number) => {
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

export function revertThaiDateToNormalDate(thaiFormattedDate: string): string {
    const monthNames: { [key: string]: string } = {
        "ม.ค.": "01", "ก.พ.": "02", "มี.ค.": "03", "เม.ย.": "04",
        "พ.ค.": "05", "มิ.ย.": "06", "ก.ค.": "07", "ส.ค.": "08",
        "ก.ย.": "09", "ต.ค.": "10", "พ.ย.": "11", "ธ.ค.": "12"
    };

    // Split the date into day and month parts
    const [day, month] = thaiFormattedDate.split(' ');

    // Get the current year dynamically
    const year = new Date().getFullYear();

    // Return the formatted date in "yyyy-mm-dd" format
    return `${year}-${monthNames[month]}-${day.padStart(2, '0')}`;
}

export const getWeatherIcon = (weatherCode: number): JSX.Element => {
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


export const renderWeatherSubOption = (day: WeatherForecastData, weatherSubOption: string): JSX.Element => {
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

export const getSubOptionIcon = (weatherSubOption: string): JSX.Element | null => {
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
