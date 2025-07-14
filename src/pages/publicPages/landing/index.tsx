/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Heart,
  Shield,
  Clock,
  Users,
  Phone,
  Star,
  LockKeyhole,
  HeartPlus,
} from "lucide-react";

import { translations } from "../../../lib/translations";
import { Navbar } from "../../../components/Nav";
import { Link } from "react-router-dom";

type TranslationSection = {
  title: string;
  purpose: string;
  features: string;
  fintech: string;
  mission: string;
};

type Translation = {
  sections: TranslationSection;
  title: string;
  purpose: string;
  features: string[];
  fintech: string;
  mission: string;
};

// Define supported language codes explicitly for type safety
export type Lang = "en" | "pidgin" | "igbo" | "yoruba" | "hausa";

const Hero = ({ t }: { t: Translation }) => (
  <>
    <section
      id="home"
      className="relative text-center py-20 px-4 overflow-hidden"
    >
      {/* Background gradient and pattern */}
      <div className="absolute inset-0 gradient-bg z-0 opacity-90"></div>
      <div
        className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] z-0 opacity-60`}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
          {t.title}
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-blue-100 leading-relaxed">
          {t.purpose}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Link
            to="/find-care"
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Find Care
          </Link>
          <Link
            to="/user/appointments"
            className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Book Appointment
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-blue-200">
          <Shield className="w-5 h-5" />
          <p className="text-sm italic">
            In partnership with NHIS - Trusted by 50,000+ Nigerians
          </p>
        </div>
      </div>
    </section>
  </>
);

const FeatureCard = ({
  icon: Icon,
  description,
}: {
  icon: any;
  description: string;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 flex flex-col items-center">
    <div className="feature-bg w-12 h-12 rounded-xl flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{description}</h3>
  </div>
);

const TestimonialCard = ({
  name,
  role,
  content,
  rating,
}: {
  name: string;
  role: string;
  content: string;
  rating: number;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg">
    <div className="flex items-center mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-700 mb-4 italic">"{content}"</p>
    <div>
      <p className="font-semibold text-gray-800">{name}</p>
      <p className="text-sm text-gray-600">{role}</p>
    </div>
  </div>
);

const Landing = () => {
  // State for selected language
  const [lang, setLang] = useState<Lang>("en");
  // Get translation for the selected language
  const t = translations[lang];

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

      {/* Hero Section */}
      <Hero t={t} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-20">
        {/* Features Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {t.sections.features}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for better healthcare management
            </p>
          </div>

          {/*
            Render feature cards using translated features from the selected language.
            The icons are mapped in order to the features array.
          */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(() => {
              // Define the icons to match the order of features
              const icons = [
                Users,
                Clock,
                Phone,
                Heart,
                Shield,
                Star,
                HeartPlus,
                LockKeyhole,
              ];
              return t.features.map((feature, idx) => {
                // Only render FeatureCard if the icon exists
                const IconComponent = icons[idx];
                if (!IconComponent) return null;
                return (
                  <FeatureCard
                    key={idx}
                    icon={IconComponent}
                    description={feature}
                  />
                );
              });
            })()}
          </div>
        </section>

        {/* Fintech Section */}
        <section className="blue-bg rounded-3xl p-8 md:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              {t.sections.fintech}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {t.fintech}
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  ₦2M+
                </div>
                <p className="text-gray-600">Saved on healthcare costs</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">15%</div>
                <p className="text-gray-600">Average cashback</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  50k+
                </div>
                <p className="text-gray-600">Active users</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              {t.sections.mission}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              {t.mission}
            </p>
          </div>
        </section>

        {/* Testimonials Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real people
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Adebayo Johnson"
              role="Lagos, Nigeria"
              content="NaijaCare made it so easy to find a specialist for my mother. The telemedicine feature is a game-changer!"
              rating={5}
            />
            <TestimonialCard
              name="Fatima Abdullahi"
              role="Abuja, Nigeria"
              content="I love how I can pay for all my medical expenses through the app. The cashback feature is amazing!"
              rating={5}
            />
            <TestimonialCard
              name="Chioma Okafor"
              role="Port Harcourt, Nigeria"
              content="The 24/7 support has been invaluable. I can get medical advice anytime, anywhere."
              rating={5}
            />
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
    </div>
  );
};

export default Landing;
