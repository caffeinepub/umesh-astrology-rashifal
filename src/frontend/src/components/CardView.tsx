import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { SiInstagram, SiWhatsapp } from "react-icons/si";
import type { Rashifal } from "../backend.d";
import { useIsAdmin, useRashifalByDate } from "../hooks/useQueries";
import { RashiCard } from "./RashiCard";
import { StarField } from "./StarField";

interface CardViewProps {
  selectedDate: string;
  onAdminClick: () => void;
  onDateChange: (date: string) => void;
}

const RASHIS = [
  {
    symbol: "♈",
    name: "मेष",
    gradient: "linear-gradient(135deg, #1a0533 0%, #4a0e8f 50%, #2d0a5e 100%)",
    border: "linear-gradient(135deg, #9b59b6, #f5d76e, #9b59b6)",
  },
  {
    symbol: "♉",
    name: "वृषभ",
    gradient: "linear-gradient(135deg, #0a2e1a 0%, #1a6e3c 50%, #0f3d22 100%)",
    border: "linear-gradient(135deg, #27ae60, #f5d76e, #27ae60)",
  },
  {
    symbol: "♊",
    name: "मिथुन",
    gradient: "linear-gradient(135deg, #0a1e3d 0%, #1a4e8f 50%, #0d2a5e 100%)",
    border: "linear-gradient(135deg, #3498db, #f5d76e, #3498db)",
  },
  {
    symbol: "♋",
    name: "कर्क",
    gradient: "linear-gradient(135deg, #2e1a0a 0%, #8f5a1a 50%, #5e3a0f 100%)",
    border: "linear-gradient(135deg, #e67e22, #f5d76e, #e67e22)",
  },
  {
    symbol: "♌",
    name: "सिंह",
    gradient: "linear-gradient(135deg, #2e0a0a 0%, #8f1a1a 50%, #5e0f0f 100%)",
    border: "linear-gradient(135deg, #e74c3c, #f5d76e, #e74c3c)",
  },
  {
    symbol: "♍",
    name: "कन्या",
    gradient: "linear-gradient(135deg, #1a2e0a 0%, #4a8f1a 50%, #2d5e0f 100%)",
    border: "linear-gradient(135deg, #8bc34a, #f5d76e, #8bc34a)",
  },
  {
    symbol: "♎",
    name: "तुला",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #4a4a8f 50%, #2d2d5e 100%)",
    border: "linear-gradient(135deg, #7986cb, #f5d76e, #7986cb)",
  },
  {
    symbol: "♏",
    name: "वृश्चिक",
    gradient: "linear-gradient(135deg, #1a0a2e 0%, #5a1a7a 50%, #3a0f4e 100%)",
    border: "linear-gradient(135deg, #ab47bc, #f5d76e, #ab47bc)",
  },
  {
    symbol: "♐",
    name: "धनु",
    gradient: "linear-gradient(135deg, #1a1a0a 0%, #7a6a0a 50%, #4e430f 100%)",
    border: "linear-gradient(135deg, #ffc107, #f5d76e, #ffc107)",
  },
  {
    symbol: "♑",
    name: "मकर",
    gradient: "linear-gradient(135deg, #0a2e2e 0%, #1a6e6e 50%, #0f3d3d 100%)",
    border: "linear-gradient(135deg, #26a69a, #f5d76e, #26a69a)",
  },
  {
    symbol: "♒",
    name: "कुंभ",
    gradient: "linear-gradient(135deg, #0a1a2e 0%, #1a3a6e 50%, #0f253d 100%)",
    border: "linear-gradient(135deg, #42a5f5, #f5d76e, #42a5f5)",
  },
  {
    symbol: "♓",
    name: "मीन",
    gradient: "linear-gradient(135deg, #0a1a2e 0%, #1a5a8f 50%, #0f3a5e 100%)",
    border: "linear-gradient(135deg, #29b6f6, #f5d76e, #29b6f6)",
  },
];

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const months = [
      "जनवरी",
      "फरवरी",
      "मार्च",
      "अप्रैल",
      "मई",
      "जून",
      "जुलाई",
      "अगस्त",
      "सितंबर",
      "अक्टूबर",
      "नवंबर",
      "दिसंबर",
    ];
    const day = parts[0];
    const month = months[Number.parseInt(parts[1], 10) - 1] || parts[1];
    const year = parts[2];
    return `${day} ${month} ${year}`;
  }
  return dateStr;
}

export function CardView({
  selectedDate,
  onAdminClick,
  onDateChange,
}: CardViewProps) {
  const { data: rashifalList = [], isLoading } =
    useRashifalByDate(selectedDate);
  const { data: isAdmin } = useIsAdmin();

  const predictionMap: Record<string, string> = {};
  for (const r of rashifalList as Rashifal[]) {
    predictionMap[r.rashi] = r.prediction;
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #04061a 0%, #080b20 30%, #0d1035 70%, #080b20 100%)",
      }}
    >
      {/* Background image */}
      <div
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "url('/assets/generated/cosmic-bg.dim_1200x800.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <StarField />

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          {/* Top decoration */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="h-px flex-1 max-w-24"
              style={{
                background: "linear-gradient(90deg, transparent, #f5d76e)",
              }}
            />
            <span className="text-2xl">🙏</span>
            <div
              className="h-px flex-1 max-w-24"
              style={{
                background: "linear-gradient(90deg, #f5d76e, transparent)",
              }}
            />
          </div>

          <p
            className="devanagari text-lg mb-2 font-medium"
            style={{
              color: "#f5d76e",
              textShadow: "0 0 20px rgba(245,215,110,0.5)",
            }}
          >
            जय श्री राम 🙏
          </p>

          <h1 className="cinzel text-5xl md:text-6xl font-bold mb-3 gold-shimmer">
            दैनिक राशिफल
          </h1>

          {/* Date display + picker */}
          <div className="flex flex-col items-center gap-3 mb-4">
            <div
              className="inline-block px-8 py-3 rounded-full border"
              style={{
                background:
                  "linear-gradient(135deg, rgba(232,184,75,0.15), rgba(245,215,110,0.05))",
                border: "1px solid rgba(245,215,110,0.4)",
                boxShadow: "0 0 20px rgba(245,215,110,0.2)",
              }}
            >
              <p
                className="devanagari text-xl font-semibold"
                style={{ color: "#f5d76e" }}
              >
                📅 {formatDisplayDate(selectedDate)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                placeholder="DD/MM/YYYY"
                data-ocid="rashifal.date.input"
                className="w-36 text-center text-sm bg-transparent"
                style={{
                  borderColor: "rgba(245,215,110,0.3)",
                  color: "rgba(245,215,110,0.8)",
                  background: "rgba(10,15,40,0.6)",
                }}
              />
            </div>
          </div>

          {/* Astrologer name */}
          <div className="mb-4">
            <h2
              className="devanagari text-3xl font-bold text-white mb-1"
              style={{ textShadow: "0 0 30px rgba(255,200,100,0.6)" }}
            >
              ✨ ज्योतिषी उमेश ✨
            </h2>
            <p className="text-white/60 text-sm">
              Vedic Astrologer &amp; Spiritual Guide
            </p>
          </div>

          {/* Contact info */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <a
              href="https://wa.me/919654123331"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="contact.whatsapp.link"
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, rgba(37,211,102,0.2), rgba(37,211,102,0.1))",
                border: "1px solid rgba(37,211,102,0.5)",
                color: "#4ade80",
              }}
            >
              <SiWhatsapp size={18} />
              <span className="font-semibold text-sm">+91 9654123331</span>
            </a>

            <a
              href="https://instagram.com/umesh.astrology"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="contact.instagram.link"
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, rgba(228,64,95,0.2), rgba(131,58,180,0.2))",
                border: "1px solid rgba(228,64,95,0.5)",
                color: "#f472b6",
              }}
            >
              <SiInstagram size={18} />
              <span className="font-semibold text-sm">@umesh.astrology</span>
            </a>
          </div>

          {/* Decorative bottom */}
          <div className="flex items-center justify-center gap-2">
            <div
              className="h-px flex-1 max-w-32"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(245,215,110,0.5))",
              }}
            />
            <span style={{ color: "#f5d76e" }}>☽ ✦ ☾</span>
            <div
              className="h-px flex-1 max-w-32"
              style={{
                background:
                  "linear-gradient(90deg, rgba(245,215,110,0.5), transparent)",
              }}
            />
          </div>
        </header>

        {/* Loading state */}
        {isLoading && (
          <div data-ocid="rashifal.loading_state" className="text-center py-8">
            <div className="inline-flex items-center gap-3 text-white/60">
              <div
                className="w-5 h-5 border-2 rounded-full animate-spin"
                style={{
                  borderColor: "rgba(232,184,75,0.4)",
                  borderTopColor: "#e8b84b",
                }}
              />
              <span className="devanagari">राशिफल लोड हो रहा है...</span>
            </div>
          </div>
        )}

        {/* Grid of rashi cards */}
        {!isLoading && (
          <div
            data-ocid="rashifal.list"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10"
          >
            {RASHIS.map((rashi, i) => (
              <RashiCard
                key={rashi.name}
                symbol={rashi.symbol}
                name={rashi.name}
                prediction={predictionMap[rashi.name] || ""}
                gradient={rashi.gradient}
                borderColor={rashi.border}
                index={i + 1}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center pb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className="h-px flex-1 max-w-32"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(245,215,110,0.3))",
              }}
            />
            <span className="text-white/30 text-sm">✦</span>
            <div
              className="h-px flex-1 max-w-32"
              style={{
                background:
                  "linear-gradient(90deg, rgba(245,215,110,0.3), transparent)",
              }}
            />
          </div>
          <p className="devanagari text-white/40 text-sm mb-1">
            ज्योतिषी उमेश | Vedic Astrology
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

      {/* Admin floating button */}
      {isAdmin && (
        <Button
          onClick={onAdminClick}
          data-ocid="admin.open_modal_button"
          className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 p-0 shadow-lg border-0"
          style={{
            background: "linear-gradient(135deg, #e8b84b, #c9962e)",
            color: "#080b1a",
            boxShadow: "0 0 20px rgba(232,184,75,0.5)",
          }}
        >
          <Settings size={24} />
        </Button>
      )}
    </div>
  );
}
