import { useState, useEffect } from "react";
import { Navbar } from "../../../components/Nav";
import { translations } from "../../../lib/translations";
import type { Lang } from "../landing";

export default function TermsPage() {
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
    <div className="max-w-4xl mx-auto py-12 px-4 lg:px-0 text-gray-800">
      <h1 className="text-4xl font-bold text-[#000] mb-6">
        Terms & Conditions
      </h1>

      <div className="space-y-8 text-lg leading-relaxed">
        {/* Introduction */}
        <section>
          <p>
            Welcome to <strong>NaijaCare</strong>. These Terms and Conditions
            govern your use of our website and services. By accessing or using
            our platform, you agree to be bound by these terms. Please read them
            carefully.
          </p>
        </section>

        {/* 1. Acceptance of Terms */}
        <section>
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By using NaijaCare, you confirm that you are at least 18 years old
            or are using the platform under the supervision of a guardian.
            Continued use implies acceptance of these terms.
          </p>
        </section>

        {/* 2. Health Disclaimer */}
        <section>
          <h2 className="text-2xl font-semibold">2. Health Disclaimer</h2>
          <p>
            NaijaCare provides information for general health awareness and
            connection to licensed professionals. It does <strong>not</strong>{" "}
            replace professional diagnosis or treatment. Always consult with a
            certified health practitioner.
          </p>
        </section>

        {/* 3. User Responsibilities */}
        <section>
          <h2 className="text-2xl font-semibold">3. User Responsibilities</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide accurate personal and medical information.</li>
            <li>Do not impersonate another person or use false information.</li>
            <li>Avoid posting harmful, offensive, or misleading content.</li>
          </ul>
        </section>

        {/* 4. Privacy & Data */}
        <section>
          <h2 className="text-2xl font-semibold">4. Privacy & Data</h2>
          <p>
            We respect your privacy. Any personal data collected is protected
            under our Privacy Policy. We do not share your information without
            your consent, except where required by law.
          </p>
        </section>

        {/* 5. Third-Party Services */}
        <section>
          <h2 className="text-2xl font-semibold">5. Third-Party Services</h2>
          <p>
            NaijaCare may include links to third-party websites or services. We
            are not responsible for the practices or content of these external
            platforms.
          </p>
        </section>

        {/* 6. Service Modifications */}
        <section>
          <h2 className="text-2xl font-semibold">6. Service Modifications</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of
            the website or services at any time without prior notice.
          </p>
        </section>

        {/* 7. Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
          <p>
            NaijaCare is not liable for any indirect, incidental, or
            consequential damages arising from the use or inability to use our
            services.
          </p>
        </section>

        {/* 8. Termination */}
        <section>
          <h2 className="text-2xl font-semibold">8. Termination</h2>
          <p>
            We may terminate or suspend your access if you breach these terms or
            act in a manner that harms the platform or its users.
          </p>
        </section>

        {/* 9. Governing Law */}
        <section>
          <h2 className="text-2xl font-semibold">9. Governing Law</h2>
          <p>
            These terms are governed by the laws of the Federal Republic of
            Nigeria.
          </p>
        </section>

        {/* 10. Contact Us */}
        <section>
          <h2 className="text-2xl font-semibold">10. Contact Us</h2>
          <p>
            For any questions or clarifications, please reach out to us at:{" "}
            <a
              href="mailto:support@naijacare.ng"
              className="text-[#000] underline"
            >
              support@naijacare.ng
            </a>
          </p>
        </section>
      </div>
      </div>
    </div>
  );
}
