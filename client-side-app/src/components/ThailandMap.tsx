"use client";

import React, { useEffect, useState } from "react";
import { MapSkeleton } from "@/components/ui/skeletons";
import { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { provinces } from '../data/province';
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
  tokenweather: string;
};
type WeatherData = {
  Temp: number;
  Wind: number;
  Rain: number;
  Humidity: number;
  PM: number;
};



const ThailandMap: React.FC<Props> = ({ tokenweather }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [thailandTopology, setThailandTopology] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  let retries = 0;
  const maxRetries = 3;

  // ฟังก์ชันเพื่อเรียก API สำหรับแต่ละจังหวัด
  const fetchWeatherData = async (province: string) => {
    try {
      const now = new Date();
      const forecastDate = new Date(now);
      forecastDate.setDate(now.getDate());  // Add i days to the current date
      forecastDate.setUTCHours(forecastDate.getUTCHours() + 4 + retries); // Add 4 hours to the UTC time

      // Format the date to ISO string format "yyyy-mm-dd"
      let forecastDateStr = forecastDate.toISOString().split(".")[0];
      const dateAndHour = forecastDateStr.slice(0, 13);

      let weatherAPI = `https://data.tmd.go.th/nwpapi/v1/forecast/area/place?domain=1&province=${province}&fields=tc,rh,cond,ws10m,cloudlow,cloudmed,cloudhigh,rain&starttime=${dateAndHour}:00:00`;
      while (retries < maxRetries) {
        try {
          await delay(1000);
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
            const weatherData = {
              Temp: forecast.tc,
              Wind: forecast.ws10m,
              Rain: calculateRainChance(forecast.rh, forecast.cloudlow, forecast.cloudmed, forecast.cloudhigh, forecast.tc, forecast.ws10m, forecast.rain),
              Humidity: forecast.rh,
            };
            const lat = data.WeatherForecasts[0].location.lat
            const lon = data.WeatherForecasts[0].location.lon
            const response2Pm = await fetch(`/api/pmdata?lat=${lat}&lon=${lon}`);
            if (!response2Pm.ok) {
              throw new Error('Error fetching PM data');
            }
        
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

    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;  // ถ้าเกิดข้อผิดพลาด ให้คืนค่า null
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลสภาพอากาศทุกจังหวัด
  // const fetchAllWeatherData = async () => {
  //   const weatherDict: { [key: string]: WeatherData } = {};

  //   for (const province of provinces) {
  //     const data = await fetchWeatherData(province);
  //     if (data) {
  //       weatherDict[province] = data;
  //     }
  //   }
  //   console.log(weatherDict)
  //   setLoading(false);  // เมื่อข้อมูลครบแล้ว ปิดการโหลด
  // };

  // เรียกใช้งาน fetchAllWeatherData เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    if (tokenweather !== "") {
      fetchAllWeatherData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenweather]);

  const provincesColorMap: { [key: string]: string } = {
    'กระบี่': "#FF0000",
    'กรุงเทพมหานคร': "#00FF00",
    'กาญจนบุรี': "#0000FF",
    // เพิ่มจังหวัดและสีตามที่คุณต้องการ
    // ...
  };

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
      } finally {
        setLoading(false);
      }
    };

    fetchThailandTopology();
  }, []);


  return (
    <div>
      {loading ? (
        <MapSkeleton />
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
          }}
        >
          <ZoomableGroup>
            <Geographies geography={thailandTopology}>
              {({ geographies }: { geographies: Feature<Geometry, GeoJsonProperties>[] }) =>
                geographies.map((geo: Feature<Geometry, GeoJsonProperties>) => {
                  const regionName = geo.properties?.NAME_1;  // ใช้ชื่อจังหวัดจาก properties
                  const regionColor = provincesColorMap[regionName] || "#88CCEE"; // ถ้าไม่พบสีจะใช้สีเริ่มต้น

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={selectedRegion === regionName ? "#FFA500" : regionColor} // ใช้สีที่ระบุใน provincesColorMap
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          fill: "#F53",
                          outline: "none",
                          transition: "all 0.3s",
                        },
                        pressed: { fill: "#E42", outline: "none" },
                      }}
                      onClick={() => setSelectedRegion(regionName || "")}
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
