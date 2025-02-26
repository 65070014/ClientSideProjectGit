"use client";

import React, { useEffect, useState } from "react";
import { MapSkeleton } from "@/components/ui/skeletons";
import { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { provinces, provinces_eng } from '../data/province';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import {
  calculateRainChance,
} from './ui/Forecast/forecastUtils';

type Props = {
  tokenweather: string[];
  tabValue: number;
  setProvince: React.Dispatch<React.SetStateAction<string>>;
  weatherSubOption: string;
};


const calculateColor = (value: number, min: number, max: number, type: string): string => {
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

const ThailandMap: React.FC<Props> = ({ tokenweather, weatherSubOption, tabValue, setProvince }) => {
  const [thailandTopology, setThailandTopology] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mapType, setMapType] = useState<number>(0);
  const [apiLimit, setApiLimit] = useState<boolean>(false);
  const [provincesColorMap, setProvincesColorMap] = useState<{ [key: string]: string[] }>({});
  const [isDataReady, setIsDataReady] = useState(false);
  const [loading_number, setLoadingNumber] = useState<number>(0);
  const provincesGroup1 = provinces.slice(0, 11);
  const provincesGroup2 = provinces.slice(11, 22);
  const provincesGroup3 = provinces.slice(22, 33);
  const provincesGroup4 = provinces.slice(33, 44);
  const provincesGroup5 = provinces.slice(44, 55);
  const provincesGroup6 = provinces.slice(55, 66);
  const provincesGroup7 = provinces.slice(66);
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // ฟังก์ชันเพื่อเรียก API สำหรับแต่ละจังหวัด
  const fetchWeatherData = async (province: string, apiKey: string) => {

    try {
      await delay(7000)
      const now = new Date();
      const forecastDate = new Date(now);
      forecastDate.setDate(now.getDate());
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
            "authorization": `Bearer ${apiKey}`,
          }
        });

        if (response2.ok) {
          const data = await response2.json();
          const forecast = data.WeatherForecasts[0].forecasts[0].data;

          const weatherData = {
            Temp: forecast.tc,
            Wind: forecast.ws10m,
            Rain: calculateRainChance(forecast.rh, forecast.cloudlow, forecast.cloudmed, forecast.cloudhigh, forecast.tc, forecast.ws10m, forecast.rain),
            Humidity: forecast.rh,
          };
          setLoadingNumber(prev => prev + 1)
          const lat = data.WeatherForecasts[0].location.lat
          const lon = data.WeatherForecasts[0].location.lon
          const response2Pm = await fetch(`/api/pmdata?lat=${lat}&lon=${lon}`);

          const pmdata = await response2Pm.json();
          const pmData = pmdata.data.aqi;

          // รวมข้อมูลทั้งสอง
          return {
            ...weatherData,
            PM: pmData,
          };
        } else {
          throw new Error("API response not ok");
        }
      } catch (error) {
        setApiLimit(true)
        console.log(error)
      }

    } catch (error) {
      setApiLimit(true)
      console.error('Error fetching weather data:', error);
      return null;  // ถ้าเกิดข้อผิดพลาด ให้คืนค่า null
    }

  };

  // ฟังก์ชันสำหรับดึงข้อมูลสภาพอากาศทุกจังหวัด
  const fetchAllWeatherData = async () => {
    const tempColorMap: { [key: string]: string[] } = {}; // สร้าง object ใหม่

    const fetchGroupData = async (provinceList: string[], apiKey: string) => {
      for (const province of provinceList) {
        if (apiLimit) {
          console.log("API limit reached, stopping requests.");
          break;
        }

        const data = await fetchWeatherData(province, apiKey);
        if (data) {
          tempColorMap[province] = [
            calculateColor(data.Temp, 0, 60, "Temp"),
            calculateColor(data.Wind, 0, 10, "Wind"),
            calculateColor(data.Rain, 0, 100, "Rain"),
            calculateColor(data.Humidity, 0, 100, "Humidity"),
            calculateColor(data.PM, 0, 100, "PM"),
          ];
        }
      }
    };

    await Promise.all([
      fetchGroupData(provincesGroup1, tokenweather[1]),
      fetchGroupData(provincesGroup2, tokenweather[2]),
      fetchGroupData(provincesGroup3, tokenweather[3]),
      fetchGroupData(provincesGroup4, tokenweather[4]),
      fetchGroupData(provincesGroup5, tokenweather[5]),
      fetchGroupData(provincesGroup6, tokenweather[6]),
      fetchGroupData(provincesGroup7, tokenweather[7]),
    ]);

    setProvincesColorMap(prevMap => ({ ...prevMap, ...tempColorMap })); // ✅ อัปเดต state หลัง loop เสร็จ
    console.log("Updated provincesColorMap:", tempColorMap);
    setLoading(false);
  };

  // ตรวจสอบว่าค่าเปลี่ยนแปลงจริงไหม


  useEffect(() => {
    console.log(Object.keys(provincesColorMap).length, provinces.length)
    if (Object.keys(provincesColorMap).length === provinces.length) {
      setIsDataReady(true);
    }
  }, [provincesColorMap]);

  // เรียกใช้งาน fetchAllWeatherData เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    if (tokenweather !== undefined && tokenweather !== null && tokenweather.length > 0) {
      fetchAllWeatherData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenweather]);

  useEffect(() => {
    setLoading(true);

    const fetchThailandTopology = async () => {
      const url =
        "https://raw.githubusercontent.com/cvibhagool/thailand-map/master/thailand-provinces.topojson";

      try {
        const response = await fetch(url);
        const data: FeatureCollection<Geometry, GeoJsonProperties> = await response.json();
        setThailandTopology(data);
      } catch (error) {
        console.error("Error fetching the JSON:", error);
      }
    };

    fetchThailandTopology();
  }, []);

  useEffect(() => {
    if (tabValue != 1) {
      if (weatherSubOption == "temperature") {
        setMapType(0)
      }
      else if (weatherSubOption == "wind") {
        setMapType(1)
      } else if (weatherSubOption == "rain") {
        setMapType(2)
      } else if (weatherSubOption == "humidity") {
        setMapType(3)
      }
    } else {
      setMapType(4)
    }
  }, [tabValue, weatherSubOption]);


  return (
    <div>
      {loading || !isDataReady || apiLimit ? (
        <MapSkeleton apilimit={apiLimit} loading_number={loading_number} />
      ) : (
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1800,
            center: [101, 13],
          }}
          width={400}
          height={420}
          style={{
            width: "100%",
            height: "auto",
            border: "1px solid black"
          }}
        >
          <ZoomableGroup>
            <Geographies geography={thailandTopology}>
              {({ geographies }: { geographies: Feature<Geometry, GeoJsonProperties>[] }) =>
                geographies.map((geo: Feature<Geometry, GeoJsonProperties>) => {
                  const regionName = geo.properties?.NAME_1;  // ใช้ชื่อจังหวัดจาก properties
                  const regionColor = provincesColorMap[provinces_eng[regionName]][mapType] || "#88CCEE"; // ถ้าไม่พบสีจะใช้สีเริ่มต้น

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={regionColor} // ใช้สีที่ระบุใน provincesColorMap
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          fill: "#F53",
                          outline: "none",
                          transition: "all 0.3s",
                        },
                      }}
                      onClick={() => setProvince(provinces_eng[regionName])}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      )}
    </div>
  );
};
export default ThailandMap;
