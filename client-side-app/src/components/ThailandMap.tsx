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
  calculateColor
} from './ui/Forecast/forecastUtils';

type Props = {
  tokenweather: string[];
  tabValue: number;
  setProvince: React.Dispatch<React.SetStateAction<string>>;
  weatherSubOption: string;
};

const ThailandMap: React.FC<Props> = ({ tokenweather, weatherSubOption, tabValue, setProvince }) => {
  const [thailandTopology, setThailandTopology] = useState<FeatureCollection<Geometry, GeoJsonProperties> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mapType, setMapType] = useState<number>(0);
  const [apiLimit, setApiLimit] = useState<boolean>(false);
  const [provincesColorMap, setProvincesColorMap] = useState<{ [key: string]: string[] }>({});
  const [isDataReady, setIsDataReady] = useState(false);
  const [loading_number, setLoadingNumber] = useState<number>(0);
  const [hoveredRegion, setHoveredRegion] = useState(null);  // To track hovered region
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
  };

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
    setLoading(false);
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
    <div className="relative">
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
            border: "1px solid black"
          }}
        >
          <ZoomableGroup>
            <Geographies geography={thailandTopology}>
              {({ geographies }: { geographies: Feature<Geometry, GeoJsonProperties>[] }) =>
                geographies.map((geo: Feature<Geometry, GeoJsonProperties>) => {
                  const regionName = geo.properties?.NAME_1;  // ใช้ชื่อจังหวัดจาก properties
                  const regionColor = isDataReady
                    ? provincesColorMap[provinces_eng[regionName]][mapType] || "#88CCEE"
                    : "#88CCEE"; // ใช้สีขาวเมื่อยังไม่โหลดสี

                  return (
                    <React.Fragment key={geo.rsmKey}>
                      <Geography
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
                        onMouseEnter={() => setHoveredRegion(regionName)}  // แสดงชื่อจังหวัดเมื่อ hover ถ้าค่า zoom < 3
                        onMouseLeave={() => setHoveredRegion(null)}  // เลิกแสดงชื่อจังหวัดเมื่อเอาเมาส์ออก
                      />
                    </React.Fragment>
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      )}

      {/* แสดงชื่อจังหวัดเมื่อเอาเมาส์ไปชี้ */}
      {hoveredRegion && (
        <div className="absolute top-2 left-2 p-4 z-10 bg-white text-black rounded-sm shadow-md">
          <p className="font-semibold text-xs">{provinces_eng[hoveredRegion]}</p>
        </div>
      )}

      {/* แสดงแถบสี */}

      <div className="absolute bottom-4 right-4 z-20 w-full max-w-[150px] mx-auto mt-4">
        <div
          className={`relative h-6 rounded-full ${mapType === 0
              ? "bg-gradient-to-r from-blue-500 via-yellow-400 to-orange-500" // อุณหภูมิ
              : mapType === 1
                ? "bg-gradient-to-r from-blue-600 to-blue-300" // ลม
                : mapType === 2
                  ? "bg-gradient-to-r from-blue-800 to-blue-400" // ฝน
                  : mapType === 3
                    ? "bg-gradient-to-r from-blue-700 to-white" // ความชื้น
                    : mapType === 4
                    ? "bg-gradient-to-r from-green-500 via-yellow-400 via-orange-500 to-red-600" // ความชื้น
                      : "bg-gradient-to-r from-gray-500 to-gray-900" // ค่าเริ่มต้น
            }`}
        >
          <div className="absolute bottom-full left-0 text-xs mb-1 font-medium text-blue-700">
            {mapType === 0
              ? "หนาว"
              : mapType === 1
                ? "ลมเบา"
                : mapType === 2
                  ? "น้อย"
                  : mapType === 3
                    ? "แห้ง"
                    : mapType === 4
                    ? "น้อย"
                      : "ต่ำ"}
          </div>
          <div className="absolute bottom-full right-0 text-xs mb-1 font-medium text-red-700">
            {mapType === 0
              ? "ร้อน"
              : mapType === 1
                ? "ลมแรง"
                : mapType === 2
                  ? "หนัก"
                  : mapType === 3
                    ? "ชื้น"
                    : mapType === 4
                    ? "มาก"
                      : "สูง"}
          </div>
        </div>
      </div>


      <div className="absolute top-0 right-0 p-4 z-10 max-w-3xs w-full">
        {/* ถ้าข้อมูลยังโหลดไม่เสร็จ ให้แสดงข้อความว่า "กำลังโหลดข้อมูลพยากรณ์" พร้อมแสดงสถานะ */}
        {!isDataReady && !apiLimit ? (
          <div className="border border-gray-300 rounded-lg p-2 bg-white shadow-md">
            <p className="font-semibold text-xs">
              กำลังโหลดข้อมูลพยากรณ์ {loading_number}/77
            </p>
          </div>
        ) : null}

        {/* ถ้ามีการเรียก Api เกินกำหนด ให้แสดงข้อความว่า "ไม่สามารถโหลดข้อมูลได้เนื่องจากเกิน API limit" */}
        {apiLimit ? (
          <div className="border border-red-600 rounded-lg p-2 bg-red-100 shadow-md">
            <p className="font-semibold text-xs text-red-600">
              ไม่สามารถโหลดข้อมูลพยากรณ์ได้ เนื่องจากมีการเรียกใช้ API เกินกำหนด
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default ThailandMap;
