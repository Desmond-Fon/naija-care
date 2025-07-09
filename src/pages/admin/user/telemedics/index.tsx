import { useState, useEffect } from "react";
import { Navbar } from "../../../../components/Nav";
import { translations } from "../../../../lib/translations";

// Define supported language codes explicitly for type safety
export type Lang = "en" | "pidgin" | "igbo" | "yoruba" | "hausa";

const Telemedicine = () => {
  // State for selected language
  const [lang, setLang] = useState<Lang>("en");
  // Get translation for the selected language

  useEffect(() => {
    const savedLang = localStorage.getItem("naijacare-lang");
    if (savedLang && Object.keys(translations).includes(savedLang)) {
      setLang(savedLang as Lang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("naijacare-lang", lang);
  }, [lang]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header with gradient background */}
        <header className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <Navbar lang={lang} setLang={setLang} />
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Telemedicine;
