import { useState, useEffect } from "react";
import { Navbar } from "../../../components/Nav";
import { translations } from "../../../lib/translations";
import { BookOpen, Video, DownloadCloud } from "lucide-react";
import { Link } from "react-router-dom";

// Define supported language codes explicitly for type safety
export type Lang = "en" | "pidgin" | "igbo" | "yoruba" | "hausa";

// Example health education resources (articles/videos)
const resources = [
  {
    type: "article",
    title: "Understanding Malaria",
    description: "Learn the basics of malaria prevention and treatment.",
    lang: "en",
    link: "#",
    offline: true,
  },
  {
    type: "video",
    title: "Healthy Eating (Pidgin)",
    description: "Watch tips on healthy eating habits in Pidgin.",
    lang: "pidgin",
    link: "#",
    offline: false,
  },
  {
    type: "article",
    title: "Ọgwụ Mgbochi Iba (Igbo)",
    description: "Ihe ị ga-eme iji gbochie iba na Igbo.",
    lang: "igbo",
    link: "#",
    offline: true,
  },
  {
    type: "video",
    title: "Ìlera Ọmọde (Yoruba)",
    description: "Fídíò lori ìlera ọmọde ní èdè Yorùbá.",
    lang: "yoruba",
    link: "#",
    offline: false,
  },
  {
    type: "article",
    title: "Lafiya ga yara (Hausa)",
    description: "Labari akan lafiyar yara a Hausa.",
    lang: "hausa",
    link: "#",
    offline: true,
  },
];


const Education = () => {
  // State for selected language
  const [lang, setLang] = useState<Lang>("en");

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
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <header className="gradient-bg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <Navbar lang={lang} setLang={setLang} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-16">
        {/* Health Education Title */}
        <section className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Health Education
          </h1>
          <p className="text-lg text-gray-600">
            Simple health articles and videos in your language. Access some
            resources offline!
          </p>
          <p className="text-lg ">
            For more information, visit the official{" "}
            <Link
              to="https://www.nhia.gov.ng/"
              className="font-semibold text-blue-600 underline"
            >
              NHIS website
            </Link>
          </p>
        </section>

        {/* Education Resources Grid */}
        <section>
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((res, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  {res.type === "article" ? (
                    <BookOpen className="w-7 h-7 text-blue-600" />
                  ) : (
                    <Video className="w-7 h-7 text-purple-600" />
                  )}
                  <span className="text-sm font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700 uppercase">
                    {res.lang}
                  </span>
                  {res.offline && (
                    <span className="flex items-center gap-1 text-xs text-green-600 ml-2">
                      <DownloadCloud className="w-4 h-4" /> Offline
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {res.title}
                </h2>
                <p className="text-gray-700 mb-4">{res.description}</p>
                <a
                  href={res.link}
                  className="mt-auto inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold transition-all duration-200 shadow-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {res.type === "article" ? "Read Article" : "Watch Video"}
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Education;
