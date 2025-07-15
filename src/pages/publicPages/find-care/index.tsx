/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Navbar } from "../../../components/Nav";
import { translations } from "../../../lib/translations";
import { MapPin, Hospital, Search, LocateFixed } from "lucide-react";
import { hospitals } from "../../../lib/HospitalData";

// Define supported language codes explicitly for type safety
export type Lang = "en" | "pidgin" | "igbo" | "yoruba" | "hausa";

/**
 * Calculates the distance between two latitude/longitude points using the Haversine formula.
 */
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * FindCare page component displaying a list of hospitals/clinics with filter by city/state and geolocation support.
 * Uses the shared design system for layout and card styles.
 */
const FindCare = () => {
  // State for selected language
  const [lang, setLang] = useState<Lang>("en");
  // State for search/filter
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(hospitals);
  // State for user location
  const [userLoc, setUserLoc] = useState<{lat: number; lng: number} | null>(null);
  // State for sorted hospitals by distance
  const [sorted, setSorted] = useState<typeof hospitals>(hospitals);
  // State for geolocation error
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("naijacare-lang");
    if (savedLang && Object.keys(translations).includes(savedLang)) {
      setLang(savedLang as Lang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("naijacare-lang", lang);
  }, [lang]);

  // Filter hospitals by search (city, state, or name)
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setFiltered(hospitals);
    } else {
      setFiltered(
        hospitals.filter(h =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.state.toLowerCase().includes(q)
        )
      );
    }
  }, [search]);

  // Sort hospitals by distance if user location is available
  useEffect(() => {
    if (userLoc) {
      setSorted(
        [...filtered].sort((a, b) =>
          getDistance(userLoc.lat, userLoc.lng, a.lat, a.lng) -
          getDistance(userLoc.lat, userLoc.lng, b.lat, b.lng)
        )
      );
    } else {
      setSorted(filtered);
    }
  }, [userLoc, filtered]);

  // Handle geolocation request
  const handleLocate = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      _err => {
        setGeoError("Unable to retrieve your location.");
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <header className="gradient-bg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <Navbar lang={lang} setLang={setLang} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-12">
        {/* Find Care Title */}
        <section className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Find a Hospital or Clinic
          </h1>
          <p className="text-lg text-gray-600">
            Search for hospitals or clinics near you and register in person.
          </p>
        </section>

        {/* Search/Filter & Locate Section */}
        <section className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 max-w-md w-full">
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
              placeholder="Search by city, state, or hospital name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="w-6 h-6 text-blue-600" />
          </div>
          <button
            onClick={handleLocate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold transition-all duration-200 shadow-lg"
          >
            <LocateFixed className="w-5 h-5" /> Find Nearest
          </button>
        </section>
        {geoError && (
          <div className="text-red-600 text-center mb-4">{geoError}</div>
        )}

        {/* Hospitals List Section */}
        <section>
          <div className="grid md:grid-cols-3 gap-8">
            {sorted.length === 0 ? (
              <div className="col-span-2 text-center text-gray-500">
                No hospitals or clinics found.
              </div>
            ) : (
              sorted.map((h, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Hospital className="w-7 h-7 text-blue-600" />
                    <span className="text-lg font-semibold text-gray-800">
                      {h.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin className="w-5 h-5" />
                    <span>{h.address}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {h.city}, {h.state}
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    Type: {h.type}
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    Phone:{" "}
                    <a
                      href={`tel:${h.phone}`}
                      className="text-blue-600 underline"
                    >
                      {h.phone}
                    </a>
                  </div>
                  {userLoc && (
                    <div className="text-xs text-gray-500 mb-2">
                      Distance:{" "}
                      {getDistance(
                        userLoc.lat,
                        userLoc.lng,
                        h.lat,
                        h.lng
                      ).toFixed(1)}{" "}
                      km
                    </div>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      h.address
                    )}`}
                    className="mt-auto inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold transition-all duration-200 shadow-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Map
                  </a>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FindCare;
