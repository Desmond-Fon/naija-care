import { useState, useEffect } from "react";
import { Navbar } from "../../../components/Nav";
import { translations } from "../../../lib/translations";
import { MessageCircle, Send, HelpCircle, ChevronDown } from "lucide-react";

// Define supported language codes explicitly for type safety
export type Lang = "en" | "pidgin" | "igbo" | "yoruba" | "hausa";

const faqs = [
  {
    question: "How do I contact support?",
    answer: "You can reach us via live chat or by submitting the feedback form below."
  },
  {
    question: "Is live chat available 24/7?",
    answer: "Yes, our support team is available round the clock to assist you."
  },
  {
    question: "How do I give feedback?",
    answer: "Fill out the feedback form below and our team will review your suggestions."
  }
];

const Contact = () => {
  // State for selected language
  const [lang, setLang] = useState<Lang>("en");
  // State for FAQ open/close
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // Feedback form state
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("naijacare-lang");
    if (savedLang && Object.keys(translations).includes(savedLang)) {
      setLang(savedLang as Lang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("naijacare-lang", lang);
  }, [lang]);

  // Handle feedback form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFeedback("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <Navbar lang={lang} setLang={setLang} />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-16 space-y-16">
        {/* Support Title */}
        <section className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Support & Contact
          </h1>
          <p className="text-lg text-gray-600">
            We're here to help you with FAQs, live chat, and feedback.
          </p>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-600" /> Frequently Asked
            Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-4 border border-gray-100"
              >
                <button
                  className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-800 focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                >
                  {faq.question}
                  <ChevronDown
                    className={`w-5 h-5 ml-2 transition-transform ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="mt-2 text-gray-700 text-base border-t border-gray-100 pt-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Live Chat Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 flex flex-col items-center text-center">
          <MessageCircle className="w-10 h-10 text-blue-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Live Chat</h2>
          <p className="text-gray-700 mb-4">
            Need immediate help? Start a live chat with our support team.
          </p>
          <a
            href="https://wa.me/2348012345678?text=Hi%20NaijaCare%2C%20I%20need%20some%20help"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg"
          >
            Start Live Chat
          </a>
        </section>

        {/* Feedback Form Section */}
        <section className="bg-white rounded-2xl shadow p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Send className="w-6 h-6 text-blue-600" /> Feedback
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none min-h-[100px] text-gray-800"
              placeholder="Your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg"
            >
              Submit Feedback
            </button>
            {submitted && (
              <div className="text-green-600 font-medium">
                Thank you for your feedback!
              </div>
            )}
          </form>
        </section>
      </main>
    </div>
  );
};

export default Contact;
