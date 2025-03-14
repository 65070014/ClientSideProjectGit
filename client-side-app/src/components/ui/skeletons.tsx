export function WeatherSkeleton() {
    return (
      <div>
        <div className="mb-6 p-4 bg-blue-50 rounded-lg shadow-md animate-pulse">
          <div className="h-6 w-40 bg-gray-300 rounded-md mb-2"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="w-24 h-6 bg-gray-300 rounded-md"></div>
            </div>
            <div className="w-24 h-6 bg-gray-300 rounded-md"></div>
          </div>
        </div>
  
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-50 p-2 rounded-lg shadow-sm text-center animate-pulse"
            >
              <div className="h-6 w-24 bg-gray-300 rounded-md mx-auto mb-2"></div>
              <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto"></div>
              <div className="h-6 w-20 bg-gray-300 rounded-md mx-auto mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  export function AirQualitySkeleton() {
    return (
      <div>
        {/* Today's Air Quality Skeleton */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg shadow-md animate-pulse">
          <div className="h-6 w-40 bg-gray-300 rounded-md mb-2"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="w-32 h-6 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>
  
        {/* Future Air Quality Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-50 p-2 rounded-lg shadow-sm text-center animate-pulse"
            >
              <div className="h-6 w-24 bg-gray-300 rounded-md mx-auto mb-2"></div>
              <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto my-2"></div>
              <div className="h-6 w-24 bg-gray-300 rounded-md mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  export function MapSkeleton (){
    return (
      <div style={{ width: '100%', height: '420px', backgroundColor: '#f0f0f0', position: 'relative' }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 25%, rgba(200, 200, 200, 0.8) 50%, rgba(255, 255, 255, 0.8) 75%)',
            animation: 'loading 1.5s infinite linear',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#888', // Change color based on api limit
          }}
        >
          <span>{`กำลังโหลดแผนที่...`}</span>
        </div>
      </div>
    );
  }
  const WeatherMetricSkeleton: React.FC = () => {
    return (
      <div className="bg-gray-200 rounded-xl p-6 shadow-md flex flex-col items-center justify-center animate-pulse">
        <div className="mb-4 w-16 h-16 bg-gray-300 rounded-full"></div>
        <div className="w-24 h-6 bg-gray-300 rounded mb-2"></div>
        <div className="w-20 h-10 bg-gray-400 rounded"></div>
        <div className="w-16 h-4 bg-gray-300 rounded mt-1"></div>
      </div>
    );
  };
  
 export const WeatherMetricsSkeleton: React.FC = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <WeatherMetricSkeleton />
        <WeatherMetricSkeleton />
        <WeatherMetricSkeleton />
      </div>
    );
  };
  