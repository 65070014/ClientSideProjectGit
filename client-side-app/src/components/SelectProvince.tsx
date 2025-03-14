"use client"

import React, { useState, useEffect } from "react";
import { Typography, FormControl, TextField, Autocomplete } from "@mui/material"
import { postal_code } from '../data/province';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Thermometer, Wind, CloudRain } from "lucide-react";
import { WeatherForecastData } from '../components/ui/Forecast/forecastUtils';
import { WeatherMetricsSkeleton } from "@/components/ui/skeletons";

type Props = {
  province: string;
  setProvince: React.Dispatch<React.SetStateAction<string>>;
  forecast: WeatherForecastData[]
};

interface Postal {
  label: string;
  postalCode: string[];
}

const ProvinceSelector: React.FC<Props> = ({ province, setProvince, forecast }) => {
  const [loading, setLoading] = useState<boolean>(true);

  interface WeatherMetricProps {
    icon: React.ReactNode
    title: string
    value: string
    unit?: string
    bgColor: string
  }
  useEffect(() => {
    setLoading(true)
  }, [province]);

  //delay รอ ข้อมูล forecast ให้มีค่าก่อนจริงๆ 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // ให้รอให้ forecast
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
    };
    if (forecast) {
      fetchData();
    }
  }, [forecast]);

  //Serch เลขไปรษณีย์ แล้วแสดงจังหวัดนั้นๆ
  const filterOptions = createFilterOptions<Postal>({
    matchFrom: 'any',
    stringify: (option) => `${option.label} ${option.postalCode.join(' ')}`,
  });

  const WeatherMetric: React.FC<WeatherMetricProps> = ({ icon, title, value, unit, bgColor }) => {
    return (
      <div className={`${bgColor} rounded-xl p-6 shadow-md flex flex-col items-center justify-center`}>
        <div className="mb-4">{icon}</div>
        <p className="text-xl text-gray-700 mb-2">{title}</p>
        <p className="text-4xl font-semibold text-gray-800">{value}</p>
        {unit && <p className="text-sm text-gray-600 mt-1">{unit}</p>}
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 m-4 w-full max-w-5xl mx-auto">
      <div className="flex justify-center items-center">
        <h2 className="text-xl font-semibold mb-4">พยากรณ์อากาศวันนี้</h2>
      </div>
      <div>
        <Typography variant="h4" align="center" className="mb-4 ">
          <FormControl variant="outlined" className="ml-2">

            <Autocomplete
              className="mb-4"
              disablePortal
              disableClearable
              options={postal_code}
              value={postal_code.find((item) => item.label === province)}
              getOptionLabel={(option) => option.label}
              filterOptions={filterOptions}

              onChange={(event: any, newValue: string) => {
                setProvince(newValue.label);
              }}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="จังหวัด/รหัสไปรษณีย์" />}
            />
          </FormControl>
        </Typography>
      </div>
      {loading || forecast.length === 0 ? (
        <WeatherMetricsSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <WeatherMetric
              icon={<Thermometer size={64} className="text-red-500" />}
              title="อุณหภูมิ"
              value={`${forecast[0].temperature}°C`}
              bgColor="bg-red-50"
            />
            <WeatherMetric
              icon={<Wind size={64} className="text-blue-500" />}
              title="ค่าฝุ่น PM2.5"
              value={`${forecast[0].pm25}`}
              unit="µg/m³"
              bgColor="bg-blue-50"
            />
            <WeatherMetric
              icon={<CloudRain size={64} className="text-cyan-500" />}
              title="โอกาสฝนตก"
              value={`${forecast[0].rainChance}%`}
              bgColor="bg-cyan-50"
            />
          </div>
        </>
      )}
    </div>

  )
}

export default ProvinceSelector
