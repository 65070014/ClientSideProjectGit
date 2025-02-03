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