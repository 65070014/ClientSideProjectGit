"use client"

import React, { useEffect, useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { ClipLoader } from 'react-spinners';

const ThailandMap = () => {
  const [selectedRegion, setSelectedRegion] = useState("")
  const [thailandTopology, setThailandTopology] = useState("")
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    setLoading(true);

    const fetchThailandTopology = async () => {
      // Replace this URL with the raw GitHub URL of your file
      const url = "https://raw.githubusercontent.com/cvibhagool/thailand-map/master/thailand-provinces.topojson";
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        setThailandTopology(data);  // Set the JSON data to the state
      } catch (error) {
        console.error("Error fetching the JSON:", error);
      }finally {
        setLoading(false);
      }
    };

    fetchThailandTopology();
  }, []);

  return (
    <div className="relative">
      {loading ? (
        <div className="flex justify-center items-center">
          <ClipLoader size={50} color="#4b9cd3" loading={loading} />
        </div>
      ) : (
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1800,
            center: [101, 13],
          }}
          width={400}
          height={400}
          style={{
            width: '100%',
            height: 'auto',
          }}
        >
          <Geographies geography={thailandTopology}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={selectedRegion === geo.properties.name ? '#FFA500' : '#88CCEE'}
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#F53', outline: 'none', transition: 'all 0.3s' },
                    pressed: { fill: '#E42', outline: 'none' },
                  }}
                  onClick={() => setSelectedRegion(geo.properties.name)}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      )}

      {selectedRegion && (
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-md text-blue-800 font-semibold">
          Selected: {selectedRegion}
        </div>
      )}
    </div>
  );
}

export default ThailandMap

