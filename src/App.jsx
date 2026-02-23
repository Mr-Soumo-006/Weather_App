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
    if (city === "") { alert("Enter city name"); return; }
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`
      );
      const data = await res.json();
      if (data.error) { setError(data.error.message); setWeather(null); }
      else { setWeather(data); setError(""); setCity(""); }
    } catch { setError("Something went wrong"); setWeather(null); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") getWeather(); };

  const dateBuilder = (d) => {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  let bgImage = clearGif;
  if (weather) {
    const c = weather.current.condition.text.toLowerCase();
    const isDay = weather.current.is_day === 1;
    if (c.includes("rain") || c.includes("drizzle"))                    bgImage = rainGif;
    else if (c.includes("cloud") || c.includes("overcast"))             bgImage = cloudyGif;
    else if ((c.includes("sunny") || c.includes("clear")) && isDay)    bgImage = sunnyGif;
  }

  const uvLabel  = (v) => v <= 2 ? "Low" : v <= 5 ? "Moderate" : v <= 7 ? "High" : v <= 10 ? "Very High" : "Extreme";
  const aqiLabel = (v) => v === 1 ? "Good" : v === 2 ? "Moderate" : v === 3 ? "Unhealthy" : v === 4 ? "Unhealthy" : v === 5 ? "Very Bad" : "Hazardous";

  const hasResult = weather !== null || error !== "";

  const cards = weather ? [
    { icon: "💧", label: "Humidity",      value: `${weather.current.humidity}%`,                                   sub: null },
    { icon: "🌡️", label: "Feels Like",    value: `${Math.round(weather.current.feelslike_c)}°C`,                  sub: null },
    { icon: "☀️", label: "UV Index",      value: weather.current.uv,                                               sub: uvLabel(weather.current.uv) },
    { icon: "🍃", label: "Air Quality",   value: weather.current.air_quality?.["us-epa-index"] ?? "N/A",
      sub: weather.current.air_quality ? aqiLabel(weather.current.air_quality["us-epa-index"]) : "N/A" },
    { icon: "💨", label: "Wind",          value: `${Math.round(weather.current.wind_kph)} km/h`,                  sub: null },
    { icon: "👁️", label: "Visibility",    value: `${weather.current.vis_km} km`,                                 sub: null },
    { icon: "🔽", label: "Pressure",      value: `${weather.current.pressure_mb} mb`,                            sub: null },
    { icon: "🌧️", label: "Precipitation", value: `${weather.current.precip_mm} mm`,                             sub: null },
  ] : [];

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", overflow: "hidden" }}>

      {/* Background — never unmounts, src just changes */}
      <img src={bgImage} alt="bg" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
        filter: weather && weather.current.temp_c > 16 ? "brightness(1.05)" : "brightness(0.85)",
        transition: "filter 0.4s ease"
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5), rgba(0,0,0,0.72))"
      }} />

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        * { font-family: 'Nunito', sans-serif !important; box-sizing: border-box; }

        .search-input {
          width: 100%;
          padding: 14px 22px;
          font-size: 1.1rem;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255,255,255,0.4);
          border-radius: 16px;
          color: #1a1a2e;
          outline: none;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          transition: background 0.3s;
        }
        .search-input::placeholder { color: #555; }
        .search-input:focus { background: rgba(255,255,255,0.75); }

        .card {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 18px;
          padding: 20px 12px;
          text-align: center;
          transition: transform 0.25s ease, background 0.25s ease;
        }
        .card:hover { transform: translateY(-4px) scale(1.03); background: rgba(255,255,255,0.25); }
        .cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        @media (max-width: 700px) { .cards-grid { grid-template-columns: repeat(2, 1fr); } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease both; }
      ` }} />

      {/* Outer wrapper */}
      <div style={{ position: "relative", zIndex: 10, minHeight: "100vh" }}>

        {/* ── HERO (before search) — always in DOM, fades out ── */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", padding: "0 16px",
          opacity: hasResult ? 0 : 1,
          pointerEvents: hasResult ? "none" : "auto",
          transition: "opacity 0.3s ease"
        }}>
          <p style={{ color: "white", fontSize: "2rem", fontWeight: 800,
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)", marginBottom: 8, textAlign: "center" }}>
            🌤️ Daily Weather Forecast
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", marginBottom: 24, textAlign: "center" }}>
            Enter a city to get started
          </p>
          <div style={{ width: "100%", maxWidth: 520 }}>
            <input className="search-input" type="text" placeholder="Search location..."
                   value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={handleKeyDown} />
          </div>
        </div>

        {/* ── RESULTS (after search) — always in DOM, fades in ── */}
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          opacity: hasResult ? 1 : 0,
          pointerEvents: hasResult ? "auto" : "none",
          transition: "opacity 0.3s ease"
        }}>

          {/* Search bar pinned at top */}
          <div style={{ padding: "18px 16px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: 520 }}>
              <input className="search-input" type="text" placeholder="Search location..."
                     value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ maxWidth: 520, margin: "0 auto 16px", width: "90%",
                          background: "rgba(180,30,30,0.35)", border: "1px solid rgba(255,100,100,0.4)",
                          borderRadius: 14, padding: "10px 20px", textAlign: "center", backdropFilter: "blur(10px)" }}>
              <p style={{ color: "#fca5a5", fontSize: "1rem" }}>{error}</p>
            </div>
          )}

          {/* Weather content */}
          {weather && (
            <div className="fade-up" style={{ flex: 1, maxWidth: 960, margin: "0 auto", width: "100%", padding: "0 16px 32px" }}>

              {/* City + Date */}
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <h1 style={{ color: "white", fontSize: "clamp(1.6rem, 4.5vw, 3rem)", fontWeight: 800,
                             textShadow: "0 3px 10px rgba(0,0,0,0.5)", lineHeight: 1.2 }}>
                  {weather.location.name}, {weather.location.country}
                </h1>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", fontStyle: "italic", marginTop: 6 }}>
                  {dateBuilder(new Date())}
                </p>
              </div>

              {/* Temperature */}
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)",
                              backdropFilter: "blur(16px)", borderRadius: 28,
                              padding: "24px 52px", border: "1px solid rgba(255,255,255,0.2)",
                              boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                  <div style={{ color: "white", fontSize: "clamp(3.5rem, 10vw, 6.5rem)",
                                fontWeight: 900, lineHeight: 1, textShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                    {Math.round(weather.current.temp_c)}°C
                  </div>
                </div>
                <p style={{ color: "white", fontSize: "clamp(1.3rem, 3vw, 1.9rem)", fontWeight: 700,
                            marginTop: 14, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                  {weather.current.condition.text}
                </p>
              </div>

              {/* Cards */}
              <div className="cards-grid">
                {cards.map(({ icon, label, value, sub }) => (
                  <div key={label} className="card">
                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>{icon}</div>
                    <p style={{ color: "rgba(255,255,255,0.95)", fontSize: "0.72rem",
                                textTransform: "uppercase", letterSpacing: "0.15em",
                                fontWeight: 700, marginBottom: 6 }}>
                      {label}
                    </p>
                    <p style={{ color: "white", fontSize: "1.55rem", fontWeight: 900,
                                textShadow: "0 2px 6px rgba(0,0,0,0.4)", lineHeight: 1.1 }}>
                      {value}
                    </p>
                    {sub && (
                      <p style={{ color: "#fde68a", fontSize: "0.8rem", fontWeight: 700, marginTop: 4 }}>
                        {sub}
                      </p>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;