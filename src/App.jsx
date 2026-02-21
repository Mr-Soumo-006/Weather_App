import { useState } from "react";
import sunnyGif from "./assets/sunny.gif";
import rainGif from "./assets/rain.gif";
import cloudyGif from "./assets/cloudy.gif";
import clearGif from "./assets/clear.gif";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const apiKey = "73543bd7f6534afb927201646261202";

  const getWeather = async () => {
    if (city === "") {
      alert("Enter city name");
      return;
    }
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`
      );
      const data = await response.json();
      
      if (data.error) {
        setError(data.error.message);
        setWeather(null);
      } else {
        setWeather(data);
        setError("");
        setCity("");
      }
    } catch (err) {
      setError("Something went wrong");
      setWeather(null);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getWeather();
    }
  };

  const dateBuilder = (d) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${date} ${month} ${year}`;
  };

  // Pick background based on weather condition
  let bgImage = clearGif;
  if (weather) {
    const condition = weather.current.condition.text.toLowerCase();
    if (condition.includes("sunny") || condition.includes("clear") && weather.current.is_day === 1) {
      bgImage = sunnyGif;
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      bgImage = cloudyGif;
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      bgImage = rainGif;
    } else if (condition.includes("clear")) {
      bgImage = clearGif;
    }
  }

  // Check if it's warm (>16°C like the reference design)
  const isWarm = weather && weather.current.temp_c > 16;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background GIF */}
      <img
        key={bgImage}
        src={bgImage}
        alt="weather background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: isWarm ? 'brightness(1.1) saturate(1.2)' : 'brightness(0.9)' }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/75" />

      {/* Content */}
      <main className="relative z-10 min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:px-10 lg:px-12 md:py-12 overflow-y-auto">
        {/* Search Box */}
        <div className="w-full max-w-xl lg:max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <input
            type="text"
            placeholder="Search location..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg md:text-xl 
                     bg-white/50 backdrop-blur-sm rounded-b-2xl -mt-4 sm:-mt-6 
                     shadow-lg text-gray-800 placeholder-gray-600
                     focus:bg-white/75 focus:outline-none transition-all duration-300
                     border-t-4 border-white/30"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-xl lg:max-w-2xl mx-auto mb-6 sm:mb-8">
            <p className="text-red-300 text-center text-sm sm:text-base md:text-lg 
                         bg-red-900/30 backdrop-blur-sm rounded-xl px-4 py-2 sm:px-6 sm:py-3 
                         border border-red-500/30">
              {error}
            </p>
          </div>
        )}

        {/* Weather Display */}
        {weather && (
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 animate-fade-in pb-8">
            {/* Location & Date */}
            <div className="text-center space-y-1 sm:space-y-2 px-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
                           font-semibold text-white break-words
                           drop-shadow-[3px_3px_rgba(50,50,70,0.5)]">
                {weather.location.name}, {weather.location.country}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 font-light italic 
                          drop-shadow-[2px_2px_rgba(50,50,70,0.5)]">
                {dateBuilder(new Date())}
              </p>
            </div>

            {/* Temperature Display */}
            <div className="text-center px-2">
              <div className="inline-block bg-white/20 backdrop-blur-md 
                            rounded-2xl sm:rounded-3xl 
                            px-6 py-4 sm:px-8 sm:py-6 md:px-12 md:py-8 
                            shadow-[3px_6px_rgba(0,0,0,0.2)]
                            border border-white/10">
                <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl 
                              font-black text-white 
                              drop-shadow-[3px_6px_rgba(50,50,70,0.5)]">
                  {Math.round(weather.current.temp_c)}°C
                </div>
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
                          font-bold text-white mt-4 sm:mt-6 px-4
                          drop-shadow-[3px_3px_rgba(50,50,70,0.5)]">
                {weather.current.condition.text}
              </p>
            </div>

            {/* Additional Weather Info Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 
                          gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-6xl mx-auto">
              {/* Humidity */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl 
                            p-3 sm:p-4 md:p-5 lg:p-6 
                            border border-white/20 shadow-lg text-center
                            hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">💧</div>
                <p className="text-white/70 text-xs sm:text-sm uppercase tracking-wide mb-1">Humidity</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {weather.current.humidity}%
                </p>
              </div>

              {/* Feels Like */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl 
                            p-3 sm:p-4 md:p-5 lg:p-6 
                            border border-white/20 shadow-lg text-center
                            hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🌡️</div>
                <p className="text-white/70 text-xs sm:text-sm uppercase tracking-wide mb-1">Feels Like</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {Math.round(weather.current.feelslike_c)}°C
                </p>
              </div>

              {/* UV Index */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl 
                            p-3 sm:p-4 md:p-5 lg:p-6 
                            border border-white/20 shadow-lg text-center
                            hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">☀️</div>
                <p className="text-white/70 text-xs sm:text-sm uppercase tracking-wide mb-1">UV Index</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {weather.current.uv}
                </p>
                <p className="text-xs text-white/60 mt-1">
                  {weather.current.uv <= 2 ? "Low" : 
                   weather.current.uv <= 5 ? "Moderate" :
                   weather.current.uv <= 7 ? "High" :
                   weather.current.uv <= 10 ? "Very High" : "Extreme"}
                </p>
              </div>

              {/* AQI (Air Quality Index) */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl 
                            p-3 sm:p-4 md:p-5 lg:p-6 
                            border border-white/20 shadow-lg text-center
                            hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🍃</div>
                <p className="text-white/70 text-xs sm:text-sm uppercase tracking-wide mb-1">Air Quality</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {weather.current.air_quality ? 
                    Math.round(weather.current.air_quality["us-epa-index"]) : "N/A"}
                </p>
                <p className="text-xs text-white/60 mt-1">
                  {weather.current.air_quality ? 
                    (weather.current.air_quality["us-epa-index"] === 1 ? "Good" :
                     weather.current.air_quality["us-epa-index"] === 2 ? "Moderate" :
                     weather.current.air_quality["us-epa-index"] === 3 ? "Unhealthy" :
                     weather.current.air_quality["us-epa-index"] === 4 ? "Unhealthy" :
                     weather.current.air_quality["us-epa-index"] === 5 ? "Very Bad" : "Hazardous")
                    : "Not Available"}
                </p>
              </div>

              {/* Wind Speed */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl 
                            p-3 sm:p-4 md:p-5 lg:p-6 
                            border border-white/20 shadow-lg text-center
                            hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">💨</div>
                <p className="text-white/70 text-xs sm:text-sm uppercase tracking-wide mb-1">Wind</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {Math.round(weather.current.wind_kph)} km/h
                </p>
              </div>

              {/* Visibility */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl 
                            p-3 sm:p-4 md:p-5 lg:p-6 
                            border border-white/20 shadow-lg text-center
                            hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">👁️</div>
                <p className="text-white/70 text-xs sm:text-sm uppercase tracking-wide mb-1">Visibility</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {weather.current.vis_km} km
                </p>
              </div>

              {/* Pressure */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl 
                            p-3 sm:p-4 md:p-5 lg:p-6 
                            border border-white/20 shadow-lg text-center
                            hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🔽</div>
                <p className="text-white/70 text-xs sm:text-sm uppercase tracking-wide mb-1">Pressure</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {weather.current.pressure_mb} mb
                </p>
              </div>

              {/* Precipitation */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl 
                            p-3 sm:p-4 md:p-5 lg:p-6 
                            border border-white/20 shadow-lg text-center
                            hover:bg-white/20 hover:scale-105 transition-all duration-300">
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🌧️</div>
                <p className="text-white/70 text-xs sm:text-sm uppercase tracking-wide mb-1">Precipitation</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  {weather.current.precip_mm} mm
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;