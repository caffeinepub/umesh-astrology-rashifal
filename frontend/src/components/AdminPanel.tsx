import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Rashifal } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateOrUpdateRashifal,
  useIsAdmin,
  useRashifalByDate,
} from "../hooks/useQueries";

interface AdminPanelProps {
  initialDate: string;
  onBack: () => void;
}

const RASHIS = [
  { symbol: "♈", name: "मेष" },
  { symbol: "♉", name: "वृषभ" },
  { symbol: "♊", name: "मिथुन" },
  { symbol: "♋", name: "कर्क" },
  { symbol: "♌", name: "सिंह" },
  { symbol: "♍", name: "कन्या" },
  { symbol: "♎", name: "तुला" },
  { symbol: "♏", name: "वृश्चिक" },
  { symbol: "♐", name: "धनु" },
  { symbol: "♑", name: "मकर" },
  { symbol: "♒", name: "कुंभ" },
  { symbol: "♓", name: "मीन" },
];

export function AdminPanel({ initialDate, onBack }: AdminPanelProps) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [editDate, setEditDate] = useState(initialDate);
  const { data: rashifalList = [], isLoading } = useRashifalByDate(editDate);
  const [predictions, setPredictions] = useState<Record<string, string>>({});
  const { mutateAsync: saveRashifal, isPending } = useCreateOrUpdateRashifal();
  const [savingRashi, setSavingRashi] = useState<string | null>(null);

  useEffect(() => {
    const map: Record<string, string> = {};
    for (const r of rashifalList as Rashifal[]) {
      map[r.rashi] = r.prediction;
    }
    setPredictions(map);
  }, [rashifalList]);

  const handleSingleSave = async (rashiName: string) => {
    try {
      setSavingRashi(rashiName);
      await saveRashifal({
        date: editDate,
        rashi: rashiName,
        prediction: predictions[rashiName] || "",
      });
      toast.success(`${rashiName} राशिफल सहेजा गया!`);
    } catch {
      toast.error("सहेजने में त्रुटि हुई");
    } finally {
      setSavingRashi(null);
    }
  };

  const handleSaveAll = async () => {
    try {
      await Promise.all(
        RASHIS.map((r) =>
          saveRashifal({
            date: editDate,
            rashi: r.name,
            prediction: predictions[r.name] || "",
          }),
        ),
      );
      toast.success("सभी राशिफल सहेजे गए!");
    } catch {
      toast.error("सहेजने में त्रुटि हुई");
    }
  };

  // Not logged in
  if (!identity) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(180deg, #04061a 0%, #080b20 100%)",
        }}
      >
        <div
          className="text-center p-10 rounded-3xl max-w-md w-full mx-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,26,69,0.9), rgba(13,16,48,0.9))",
            border: "1px solid rgba(245,215,110,0.3)",
            boxShadow: "0 0 40px rgba(0,0,0,0.6)",
          }}
        >
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="devanagari text-2xl font-bold text-white mb-3">
            लॉगिन करें
          </h2>
          <p className="devanagari text-white/60 mb-6 text-sm">
            प्रबंधन पैनल तक पहुंचने के लिए कृपया लॉगिन करें।
          </p>
          <Button
            onClick={() => login()}
            data-ocid="admin.login.primary_button"
            disabled={loginStatus === "logging-in"}
            className="w-full devanagari text-lg py-6"
            style={{
              background: "linear-gradient(135deg, #e8b84b, #c9962e)",
              color: "#080b1a",
            }}
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                लॉगिन हो रहे हैं...
              </>
            ) : (
              "लॉगिन करें"
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={onBack}
            data-ocid="admin.back.button"
            className="w-full mt-3 devanagari text-white/50 hover:text-white/80"
          >
            <ArrowLeft size={16} className="mr-2" /> वापस जाएं
          </Button>
        </div>
      </div>
    );
  }

  // Logged in but not admin
  if (!adminLoading && !isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(180deg, #04061a 0%, #080b20 100%)",
        }}
      >
        <div
          className="text-center p-10 rounded-3xl max-w-md w-full mx-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,0,0,0.2), rgba(20,10,10,0.95))",
            border: "1px solid rgba(231,76,60,0.4)",
          }}
        >
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="devanagari text-2xl font-bold text-white mb-3">
            अनुमति नहीं है
          </h2>
          <p className="devanagari text-white/60 mb-6">
            आपके पास एडमिन अधिकार नहीं हैं।
          </p>
          <Button
            onClick={onBack}
            data-ocid="admin.back.button"
            variant="outline"
            className="devanagari"
          >
            <ArrowLeft size={16} className="mr-2" /> वापस जाएं
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #04061a 0%, #080b20 30%, #0d1035 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            data-ocid="admin.back.button"
            className="text-white/60 hover:text-white"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span className="devanagari">वापस</span>
          </Button>

          <div className="flex-1">
            <h1
              className="devanagari text-3xl font-bold"
              style={{
                color: "#f5d76e",
                textShadow: "0 0 20px rgba(245,215,110,0.4)",
              }}
            >
              ⚙️ प्रबंधन पैनल
            </h1>
            <p className="devanagari text-white/50 text-sm">राशिफल अपडेट करें</p>
          </div>
        </div>

        {/* Date picker */}
        <div
          className="p-5 rounded-2xl mb-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(20,26,69,0.8), rgba(13,16,48,0.8))",
            border: "1px solid rgba(245,215,110,0.2)",
          }}
        >
          <Label className="devanagari text-white/80 text-base mb-3 flex items-center gap-2">
            <Calendar size={18} style={{ color: "#f5d76e" }} />
            तारीख चुनें
          </Label>
          <Input
            type="text"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            placeholder="DD/MM/YYYY"
            data-ocid="admin.date.input"
            className="devanagari max-w-xs text-white bg-transparent"
            style={{ borderColor: "rgba(245,215,110,0.3)", color: "white" }}
          />
          <p className="text-white/40 text-xs mt-2">उदाहरण: 13/03/2026</p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div
            data-ocid="admin.rashifal.loading_state"
            className="text-center py-8 text-white/60"
          >
            <Loader2 className="animate-spin inline mr-2" size={20} />
            <span className="devanagari">लोड हो रहा है...</span>
          </div>
        )}

        {/* Rashi textareas */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {RASHIS.map((rashi, i) => (
              <div
                key={rashi.name}
                data-ocid={`admin.rashi.item.${i + 1}`}
                className="p-5 rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(20,26,69,0.7), rgba(13,16,48,0.7))",
                  border: "1px solid rgba(100,100,200,0.2)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <Label className="devanagari text-white font-bold text-base flex items-center gap-2">
                    <span className="text-2xl">{rashi.symbol}</span>
                    {rashi.name}
                  </Label>
                  <Button
                    size="sm"
                    onClick={() => handleSingleSave(rashi.name)}
                    data-ocid={`admin.rashi.save_button.${i + 1}`}
                    disabled={savingRashi === rashi.name || isPending}
                    style={{
                      background: "linear-gradient(135deg, #e8b84b, #c9962e)",
                      color: "#080b1a",
                    }}
                    className="text-xs font-semibold"
                  >
                    {savingRashi === rashi.name ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        <Save size={14} className="mr-1" />
                        सहेजें
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  value={predictions[rashi.name] || ""}
                  onChange={(e) =>
                    setPredictions((prev) => ({
                      ...prev,
                      [rashi.name]: e.target.value,
                    }))
                  }
                  data-ocid={`admin.rashi.textarea.${i + 1}`}
                  placeholder={`${rashi.name} राशि का आज का राशिफल यहाँ लिखें...`}
                  rows={4}
                  className="devanagari text-sm resize-none bg-transparent text-white/90 placeholder:text-white/30"
                  style={{ borderColor: "rgba(100,100,200,0.3)" }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Save All button */}
        {!isLoading && (
          <div className="text-center pb-8">
            <Button
              onClick={handleSaveAll}
              data-ocid="admin.save_all.primary_button"
              disabled={isPending}
              size="lg"
              className="devanagari text-lg px-10 py-6 rounded-full font-bold"
              style={{
                background: "linear-gradient(135deg, #e8b84b, #c9962e)",
                color: "#080b1a",
                boxShadow: "0 0 30px rgba(232,184,75,0.4)",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  सहेज रहे हैं...
                </>
              ) : (
                <>✨ सभी सहेजें</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
