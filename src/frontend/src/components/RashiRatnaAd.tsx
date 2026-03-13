import { ArrowLeft, Gem, Heart, Shield, Star, Zap } from "lucide-react";
import { SiInstagram, SiWhatsapp } from "react-icons/si";
import { StarField } from "./StarField";

interface RashiRatnaAdProps {
  onBack: () => void;
}

const RATNA_IMAGES: Record<string, string> = {
  moonga: "/assets/generated/ratna-moonga-transparent.dim_200x200.png",
  heera: "/assets/generated/ratna-heera-transparent.dim_200x200.png",
  panna: "/assets/generated/ratna-panna-transparent.dim_200x200.png",
  moti: "/assets/generated/ratna-moti-transparent.dim_200x200.png",
  manik: "/assets/generated/ratna-manik-transparent.dim_200x200.png",
  pukhraj: "/assets/generated/ratna-pukhraj-transparent.dim_200x200.png",
  neelam: "/assets/generated/ratna-neelam-transparent.dim_200x200.png",
  lahsuniya: "/assets/generated/ratna-lahsuniya-transparent.dim_200x200.png",
};

const RATNA_DATA = [
  {
    symbol: "♈",
    name: "मेष",
    ratna: "मूंगा",
    ratnaEn: "Red Coral",
    ratnaImg: RATNA_IMAGES.moonga,
    color: "#e74c3c",
    gradient: "linear-gradient(135deg, #1a0533 0%, #4a0e8f 50%, #2d0a5e 100%)",
    border: "linear-gradient(135deg, #e74c3c, #f5d76e, #e74c3c)",
    benefit: "साहस, शक्ति और सफलता",
    planet: "मंगल",
  },
  {
    symbol: "♉",
    name: "वृषभ",
    ratna: "हीरा / ओपल",
    ratnaEn: "Diamond / Opal",
    ratnaImg: RATNA_IMAGES.heera,
    color: "#27ae60",
    gradient: "linear-gradient(135deg, #0a2e1a 0%, #1a6e3c 50%, #0f3d22 100%)",
    border: "linear-gradient(135deg, #27ae60, #f5d76e, #27ae60)",
    benefit: "धन, सौंदर्य और प्रेम",
    planet: "शुक्र",
  },
  {
    symbol: "♊",
    name: "मिथुन",
    ratna: "पन्ना",
    ratnaEn: "Emerald",
    ratnaImg: RATNA_IMAGES.panna,
    color: "#3498db",
    gradient: "linear-gradient(135deg, #0a1e3d 0%, #1a4e8f 50%, #0d2a5e 100%)",
    border: "linear-gradient(135deg, #3498db, #f5d76e, #3498db)",
    benefit: "बुद्धि, व्यापार और वाणी",
    planet: "बुध",
  },
  {
    symbol: "♋",
    name: "कर्क",
    ratna: "मोती",
    ratnaEn: "Pearl",
    ratnaImg: RATNA_IMAGES.moti,
    color: "#e67e22",
    gradient: "linear-gradient(135deg, #2e1a0a 0%, #8f5a1a 50%, #5e3a0f 100%)",
    border: "linear-gradient(135deg, #e67e22, #f5d76e, #e67e22)",
    benefit: "मानसिक शांति और माँ का आशीर्वाद",
    planet: "चंद्रमा",
  },
  {
    symbol: "♌",
    name: "सिंह",
    ratna: "माणिक",
    ratnaEn: "Ruby",
    ratnaImg: RATNA_IMAGES.manik,
    color: "#c0392b",
    gradient: "linear-gradient(135deg, #2e0a0a 0%, #8f1a1a 50%, #5e0f0f 100%)",
    border: "linear-gradient(135deg, #c0392b, #f5d76e, #c0392b)",
    benefit: "मान, सम्मान और नेतृत्व",
    planet: "सूर्य",
  },
  {
    symbol: "♍",
    name: "कन्या",
    ratna: "पन्ना",
    ratnaEn: "Emerald",
    ratnaImg: RATNA_IMAGES.panna,
    color: "#8bc34a",
    gradient: "linear-gradient(135deg, #1a2e0a 0%, #4a8f1a 50%, #2d5e0f 100%)",
    border: "linear-gradient(135deg, #8bc34a, #f5d76e, #8bc34a)",
    benefit: "विद्या, नौकरी और स्वास्थ्य",
    planet: "बुध",
  },
  {
    symbol: "♎",
    name: "तुला",
    ratna: "हीरा / ओपल",
    ratnaEn: "Diamond / Opal",
    ratnaImg: RATNA_IMAGES.heera,
    color: "#7986cb",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #4a4a8f 50%, #2d2d5e 100%)",
    border: "linear-gradient(135deg, #7986cb, #f5d76e, #7986cb)",
    benefit: "प्रेम, संबंध और संतुलन",
    planet: "शुक्र",
  },
  {
    symbol: "♏",
    name: "वृश्चिक",
    ratna: "मूंगा",
    ratnaEn: "Red Coral",
    ratnaImg: RATNA_IMAGES.moonga,
    color: "#ab47bc",
    gradient: "linear-gradient(135deg, #1a0a2e 0%, #5a1a7a 50%, #3a0f4e 100%)",
    border: "linear-gradient(135deg, #ab47bc, #f5d76e, #ab47bc)",
    benefit: "शत्रु नाश और शक्ति प्राप्ति",
    planet: "मंगल",
  },
  {
    symbol: "♐",
    name: "धनु",
    ratna: "पुखराज",
    ratnaEn: "Yellow Sapphire",
    ratnaImg: RATNA_IMAGES.pukhraj,
    color: "#ffc107",
    gradient: "linear-gradient(135deg, #1a1a0a 0%, #7a6a0a 50%, #4e430f 100%)",
    border: "linear-gradient(135deg, #ffc107, #f5d76e, #ffc107)",
    benefit: "धर्म, धन और ज्ञान",
    planet: "गुरु (बृहस्पति)",
  },
  {
    symbol: "♑",
    name: "मकर",
    ratna: "नीलम",
    ratnaEn: "Blue Sapphire",
    ratnaImg: RATNA_IMAGES.neelam,
    color: "#26a69a",
    gradient: "linear-gradient(135deg, #0a2e2e 0%, #1a6e6e 50%, #0f3d3d 100%)",
    border: "linear-gradient(135deg, #26a69a, #f5d76e, #26a69a)",
    benefit: "करियर, अनुशासन और सफलता",
    planet: "शनि",
  },
  {
    symbol: "♒",
    name: "कुंभ",
    ratna: "नीलम / लहसुनिया",
    ratnaEn: "Blue Sapphire / Cat's Eye",
    ratnaImg: RATNA_IMAGES.lahsuniya,
    color: "#42a5f5",
    gradient: "linear-gradient(135deg, #0a1a2e 0%, #1a3a6e 50%, #0f253d 100%)",
    border: "linear-gradient(135deg, #42a5f5, #f5d76e, #42a5f5)",
    benefit: "मित्रता, ज्ञान और नवीनता",
    planet: "शनि",
  },
  {
    symbol: "♓",
    name: "मीन",
    ratna: "पुखराज",
    ratnaEn: "Yellow Sapphire",
    ratnaImg: RATNA_IMAGES.pukhraj,
    color: "#29b6f6",
    gradient: "linear-gradient(135deg, #0a1a2e 0%, #1a5a8f 50%, #3a5e0f 100%)",
    border: "linear-gradient(135deg, #29b6f6, #f5d76e, #29b6f6)",
    benefit: "आध्यात्म, मोक्ष और शांति",
    planet: "गुरु (बृहस्पति)",
  },
];

const BENEFITS = [
  {
    icon: <Shield size={22} />,
    title: "सुरक्षा",
    desc: "बुरी नजर और नकारात्मक ऊर्जा से रक्षा",
  },
  {
    icon: <Zap size={22} />,
    title: "सफलता",
    desc: "व्यापार और करियर में तेजी से उन्नति",
  },
  { icon: <Heart size={22} />, title: "प्रेम", desc: "रिश्तों में मधुरता और सुख-शांति" },
  {
    icon: <Star size={22} />,
    title: "भाग्य",
    desc: "ग्रह दोष निवारण और भाग्य जागरण",
  },
];

export function RashiRatnaAd({ onBack }: RashiRatnaAdProps) {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #04061a 0%, #080b20 30%, #0d1035 70%, #080b20 100%)",
      }}
    >
      <StarField />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          data-ocid="ratna.back.button"
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-sm devanagari transition-all hover:scale-105"
          style={{
            background: "rgba(245,215,110,0.1)",
            border: "1px solid rgba(245,215,110,0.3)",
            color: "#f5d76e",
          }}
        >
          <ArrowLeft size={16} />
          वापस जाएं
        </button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="h-px flex-1 max-w-24"
              style={{
                background: "linear-gradient(90deg, transparent, #f5d76e)",
              }}
            />
            <Gem size={28} style={{ color: "#f5d76e" }} />
            <div
              className="h-px flex-1 max-w-24"
              style={{
                background: "linear-gradient(90deg, #f5d76e, transparent)",
              }}
            />
          </div>

          <h1 className="cinzel text-4xl md:text-5xl font-bold mb-3 gold-shimmer">
            राशि रत्न उपाय
          </h1>
          <p
            className="devanagari text-xl md:text-2xl font-semibold mb-2"
            style={{
              color: "#f5d76e",
              textShadow: "0 0 20px rgba(245,215,110,0.5)",
            }}
          >
            ✨ सही रत्न — सही जीवन ✨
          </p>
          <p className="devanagari text-base text-white/70 max-w-2xl mx-auto leading-relaxed mb-6">
            आपकी राशि के अनुसार सही रत्न धारण करने से ग्रहों की शक्ति प्राप्त होती है, जीवन
            में सुख, समृद्धि और शांति आती है।
          </p>

          {/* CTA Contact */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <a
              href="https://wa.me/919654123331?text=नमस्ते%20उमेश%20जी%2C%20मुझे%20राशि%20रत्न%20के%20बारे%20में%20जानकारी%20चाहिए"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="ratna.whatsapp.button"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-base devanagari transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #25d366, #128c7e)",
                color: "#ffffff",
                boxShadow: "0 0 20px rgba(37,211,102,0.4)",
              }}
            >
              <SiWhatsapp size={20} />
              अभी परामर्श लें
            </a>
            <a
              href="https://instagram.com/umesh.astrology"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="ratna.instagram.button"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-base devanagari transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #e1306c, #833ab4)",
                color: "#ffffff",
                boxShadow: "0 0 20px rgba(228,64,95,0.4)",
              }}
            >
              <SiInstagram size={20} />
              @umesh.astrology
            </a>
          </div>

          {/* Astrologer name */}
          <div
            className="inline-block px-8 py-3 rounded-2xl"
            style={{
              background: "rgba(245,215,110,0.08)",
              border: "1px solid rgba(245,215,110,0.25)",
            }}
          >
            <p
              className="devanagari text-lg font-bold"
              style={{ color: "#f5d76e" }}
            >
              🔮 ज्योतिषी उमेश जी — 20+ वर्षों का अनुभव
            </p>
          </div>
        </div>

        {/* Benefits strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {BENEFITS.map((b, i) => (
            <div
              key={b.title}
              data-ocid={`ratna.benefit.item.${i + 1}`}
              className="flex flex-col items-center text-center p-4 rounded-2xl"
              style={{
                background: "rgba(245,215,110,0.06)",
                border: "1px solid rgba(245,215,110,0.2)",
              }}
            >
              <div className="mb-2" style={{ color: "#f5d76e" }}>
                {b.icon}
              </div>
              <h3 className="devanagari font-bold text-white mb-1">
                {b.title}
              </h3>
              <p className="devanagari text-xs text-white/60 leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Section title */}
        <div className="text-center mb-8">
          <h2
            className="cinzel text-3xl font-bold mb-2"
            style={{
              color: "#f5d76e",
              textShadow: "0 0 20px rgba(245,215,110,0.4)",
            }}
          >
            12 राशियों के रत्न
          </h2>
          <p className="devanagari text-white/50 text-sm">
            अपनी राशि पहचानें — अपना रत्न जानें
          </p>
        </div>

        {/* Ratna Grid */}
        <div
          data-ocid="ratna.list"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12"
        >
          {RATNA_DATA.map((r, i) => (
            <div
              key={r.name}
              data-ocid={`ratna.item.${i + 1}`}
              className="relative rounded-2xl p-[1px] transition-all duration-300 hover:scale-105"
              style={{ background: r.border }}
            >
              <div
                className="rounded-2xl p-4 h-full flex flex-col"
                style={{ background: r.gradient }}
              >
                {/* Symbol */}
                <div className="text-center mb-1">
                  <span
                    className="text-3xl"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(255,200,100,0.8))",
                    }}
                  >
                    {r.symbol}
                  </span>
                </div>

                {/* Rashi Name */}
                <h3
                  className="text-center font-bold text-lg devanagari mb-1 text-white"
                  style={{
                    textShadow:
                      "0 0 10px rgba(255,220,100,0.8), 0 1px 2px rgba(0,0,0,0.8)",
                  }}
                >
                  {r.name}
                </h3>

                {/* Planet */}
                <p
                  className="text-center devanagari text-xs mb-3"
                  style={{ color: "rgba(245,215,110,0.7)" }}
                >
                  ग्रह: {r.planet}
                </p>

                {/* Gemstone Image */}
                <div className="flex justify-center mb-3">
                  <div
                    className="relative w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      boxShadow: `0 0 20px ${r.color}60, 0 0 40px ${r.color}30, inset 0 0 15px rgba(0,0,0,0.5)`,
                      border: `1px solid ${r.color}50`,
                    }}
                  >
                    <img
                      src={r.ratnaImg}
                      alt={r.ratnaEn}
                      className="w-16 h-16 object-contain drop-shadow-lg"
                      style={{
                        filter: `drop-shadow(0 0 8px ${r.color}80) drop-shadow(0 2px 4px rgba(0,0,0,0.8))`,
                      }}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="w-full h-px mb-3 opacity-40"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #f5d76e, transparent)",
                  }}
                />

                {/* Gemstone Name */}
                <div className="text-center mb-2">
                  <span
                    className="devanagari font-bold text-base block"
                    style={{
                      color: r.color,
                      textShadow: `0 0 10px ${r.color}80`,
                    }}
                  >
                    {r.ratna}
                  </span>
                  <span className="text-xs text-white/40">{r.ratnaEn}</span>
                </div>

                {/* Divider */}
                <div
                  className="w-full h-px my-2 opacity-30"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #f5d76e, transparent)",
                  }}
                />

                {/* Benefit */}
                <p
                  className="devanagari text-xs text-center leading-relaxed flex-1"
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.9)",
                  }}
                >
                  ✨ {r.benefit}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div
          className="text-center py-10 px-6 rounded-3xl mb-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,215,110,0.08), rgba(245,215,110,0.03))",
            border: "1px solid rgba(245,215,110,0.25)",
            boxShadow: "0 0 40px rgba(245,215,110,0.08)",
          }}
        >
          <h2
            className="cinzel text-3xl font-bold mb-3"
            style={{ color: "#f5d76e" }}
          >
            अभी परामर्श लें
          </h2>
          <p className="devanagari text-white/70 text-base leading-relaxed mb-6 max-w-xl mx-auto">
            राशि रत्न धारण करने से पहले किसी अनुभवी ज्योतिषी से परामर्श अवश्य लें। ज्योतिषी
            उमेश जी आपकी कुंडली देखकर सही रत्न बताएंगे।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/919654123331?text=नमस्ते%20उमेश%20जी%2C%20मुझे%20राशि%20रत्न%20के%20बारे%20में%20जानकारी%20चाहिए"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="ratna.cta_whatsapp.button"
              className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg devanagari transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #25d366, #128c7e)",
                color: "#ffffff",
                boxShadow:
                  "0 0 30px rgba(37,211,102,0.5), 0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <SiWhatsapp size={24} />
              WhatsApp पर संपर्क करें
            </a>

            <div
              className="flex flex-col items-center gap-1 px-6 py-3 rounded-2xl"
              style={{
                background: "rgba(245,215,110,0.08)",
                border: "1px solid rgba(245,215,110,0.25)",
              }}
            >
              <span className="devanagari text-sm text-white/60">
                📞 कॉल / WhatsApp
              </span>
              <span className="font-bold text-xl" style={{ color: "#f5d76e" }}>
                +91 9654123331
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pb-8">
          <p className="devanagari text-white/40 text-sm mb-1">
            ज्योतिषी उमेश | Vedic Astrology & Gemstone Expert
          </p>
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="hover:text-white/40 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
