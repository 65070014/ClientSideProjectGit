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

export const calculateRainChance = (rh: number, cloud: number, tc: number, ws10m: number) => {
    let chance = 0;

    // ความชื้นสูง (เหนือ 80%) เพิ่มโอกาสฝนตก
    if (rh > 80) {
        chance += 40;
    } else if (rh > 60) {
        chance += 20;
    }

    // ปริมาณเมฆเยอะ เพิ่มโอกาสฝนตก
    if (cloud > 70) {
        chance += 35;
    } else if (cloud > 50) {
        chance += 20;
    } else if (cloud > 30) {
        chance += 10;
    }

    // อุณหภูมิสูงอาจทำให้ฝนตกง่ายขึ้น
    if (tc > 30) {
        chance += 10;
    } else if (tc < 20) {
        chance -= 5;
    }

    // ความเร็วลมมีผลต่อฝน (ลมแรงอาจนำพาฝนมา)
    if (ws10m > 15) {
        chance += 10;
    } else if (ws10m > 10) {
        chance += 5;
    }

    // จำกัดค่าให้อยู่ระหว่าง 0-100%
    return Math.min(100, Math.max(0, chance));
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

export const calculateColor = (value: number, min: number, max: number, type: string): string => {
  const normalized = Math.max(min, Math.min(value, max));
  const scaledValue = (normalized - min) / (max - min); // แปลงเป็นค่า 0-1

  let r, g, b;

  switch (type) {
    case "Temp":
      if (scaledValue < 0.5) {
        // ฟ้า → เหลือง
        r = Math.round(scaledValue * (255 / 0.5));  // 0 → 255
        g = 255;
        b = Math.round(255 - scaledValue * (255 / 0.5)); // 255 → 0
      } else {
        // เหลือง → ส้ม
        r = 255;
        g = Math.round(255 - (scaledValue - 0.5) * (255 / 0.5)); // 255 → 0
        b = 0;
      }
      break;

    case "PM": // มลพิษ (เขียว → เหลือง → ส้ม → แดง)
      if (scaledValue < 0.5) {
        r = Math.round(scaledValue * 510); // 0 → 255 (เขียว → เหลือง)
        g = 255;
        b = 0;
      } else {
        r = 255;
        g = Math.round(255 - (scaledValue - 0.5) * 510); // 255 → 0 (เหลือง → แดง)
        b = 0;
      }
      break;

    case "Wind": // ลม (น้ำเงิน → ฟ้าอ่อน)
      r = 0;
      g = Math.round(scaledValue * 255);
      b = 255;
      break;

    case "Rain": // ฝน (น้ำเงินเข้ม → ฟ้า)
      r = 0;
      g = Math.round(scaledValue * 255);
      b = 255 - g;
      break;

    case "Humidity": // ความชื้น (ฟ้าเข้ม → ขาว)
      r = Math.round(scaledValue * 200);
      g = Math.round(scaledValue * 200);
      b = 255;
      break;
  }
  return `rgb(${r}, ${g}, ${b})`;
};

export async function saveMap(mapData:{ [province: string]: string[] }) {
    try {
      const response = await fetch('/api/savedmap/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mapData),
      });
  
      if (response.ok) {
        console.log(response);
      } else {
        console.error('Failed to update map');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  export async function getMap() {
    try {
      const response = await fetch('/api/savedmap', {
        method: 'GET', // Use GET method to retrieve data
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const mapData = await response.json(); // Parse JSON response
        console.log(mapData); // Handle the retrieved map data
        return mapData;
      } else {
        console.error('Failed to fetch map data');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }