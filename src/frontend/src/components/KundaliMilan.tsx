import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { useState } from "react";
import { StarField } from "./StarField";

interface KundaliMilanProps {
  onBack: () => void;
}

// Nakshatra data with lord
const NAKSHATRAS = [
  {
    name: "अश्विनी",
    lord: "केतु",
    rashi: "मेष",
    gana: "देव",
    yoni: "अश्व",
    nadi: "आदि",
  },
  {
    name: "भरणी",
    lord: "शुक्र",
    rashi: "मेष",
    gana: "मनुष्य",
    yoni: "गज",
    nadi: "मध्य",
  },
  {
    name: "कृत्तिका",
    lord: "सूर्य",
    rashi: "मेष/वृषभ",
    gana: "राक्षस",
    yoni: "मेष",
    nadi: "अंत्य",
  },
  {
    name: "रोहिणी",
    lord: "चंद्र",
    rashi: "वृषभ",
    gana: "मनुष्य",
    yoni: "सर्प",
    nadi: "अंत्य",
  },
  {
    name: "मृगशिरा",
    lord: "मंगल",
    rashi: "वृषभ/मिथुन",
    gana: "देव",
    yoni: "सर्प",
    nadi: "मध्य",
  },
  {
    name: "आर्द्रा",
    lord: "राहु",
    rashi: "मिथुन",
    gana: "मनुष्य",
    yoni: "श्वान",
    nadi: "आदि",
  },
  {
    name: "पुनर्वसु",
    lord: "गुरु",
    rashi: "मिथुन/कर्क",
    gana: "देव",
    yoni: "मार्जार",
    nadi: "आदि",
  },
  {
    name: "पुष्य",
    lord: "शनि",
    rashi: "कर्क",
    gana: "देव",
    yoni: "मेष",
    nadi: "मध्य",
  },
  {
    name: "आश्लेषा",
    lord: "बुध",
    rashi: "कर्क",
    gana: "राक्षस",
    yoni: "मार्जार",
    nadi: "अंत्य",
  },
  {
    name: "मघा",
    lord: "केतु",
    rashi: "सिंह",
    gana: "राक्षस",
    yoni: "मूषक",
    nadi: "अंत्य",
  },
  {
    name: "पूर्वाफाल्गुनी",
    lord: "शुक्र",
    rashi: "सिंह",
    gana: "मनुष्य",
    yoni: "मूषक",
    nadi: "मध्य",
  },
  {
    name: "उत्तराफाल्गुनी",
    lord: "सूर्य",
    rashi: "सिंह/कन्या",
    gana: "मनुष्य",
    yoni: "गाय",
    nadi: "आदि",
  },
  {
    name: "हस्त",
    lord: "चंद्र",
    rashi: "कन्या",
    gana: "देव",
    yoni: "महिष",
    nadi: "आदि",
  },
  {
    name: "चित्रा",
    lord: "मंगल",
    rashi: "कन्या/तुला",
    gana: "राक्षस",
    yoni: "व्याघ्र",
    nadi: "मध्य",
  },
  {
    name: "स्वाति",
    lord: "राहु",
    rashi: "तुला",
    gana: "देव",
    yoni: "महिष",
    nadi: "अंत्य",
  },
  {
    name: "विशाखा",
    lord: "गुरु",
    rashi: "तुला/वृश्चिक",
    gana: "राक्षस",
    yoni: "व्याघ्र",
    nadi: "अंत्य",
  },
  {
    name: "अनुराधा",
    lord: "शनि",
    rashi: "वृश्चिक",
    gana: "देव",
    yoni: "मृग",
    nadi: "मध्य",
  },
  {
    name: "ज्येष्ठा",
    lord: "बुध",
    rashi: "वृश्चिक",
    gana: "राक्षस",
    yoni: "मृग",
    nadi: "आदि",
  },
  {
    name: "मूल",
    lord: "केतु",
    rashi: "धनु",
    gana: "राक्षस",
    yoni: "श्वान",
    nadi: "आदि",
  },
  {
    name: "पूर्वाषाढ़ा",
    lord: "शुक्र",
    rashi: "धनु",
    gana: "मनुष्य",
    yoni: "वानर",
    nadi: "मध्य",
  },
  {
    name: "उत्तराषाढ़ा",
    lord: "सूर्य",
    rashi: "धनु/मकर",
    gana: "मनुष्य",
    yoni: "नकुल",
    nadi: "अंत्य",
  },
  {
    name: "श्रवण",
    lord: "चंद्र",
    rashi: "मकर",
    gana: "देव",
    yoni: "वानर",
    nadi: "अंत्य",
  },
  {
    name: "धनिष्ठा",
    lord: "मंगल",
    rashi: "मकर/कुंभ",
    gana: "राक्षस",
    yoni: "सिंह",
    nadi: "मध्य",
  },
  {
    name: "शतभिषा",
    lord: "राहु",
    rashi: "कुंभ",
    gana: "राक्षस",
    yoni: "अश्व",
    nadi: "आदि",
  },
  {
    name: "पूर्वाभाद्रपद",
    lord: "गुरु",
    rashi: "कुंभ/मीन",
    gana: "मनुष्य",
    yoni: "सिंह",
    nadi: "आदि",
  },
  {
    name: "उत्तराभाद्रपद",
    lord: "शनि",
    rashi: "मीन",
    gana: "मनुष्य",
    yoni: "गाय",
    nadi: "मध्य",
  },
  {
    name: "रेवती",
    lord: "बुध",
    rashi: "मीन",
    gana: "देव",
    yoni: "गज",
    nadi: "अंत्य",
  },
];

const RASHIS = [
  "मेष",
  "वृषभ",
  "मिथुन",
  "कर्क",
  "सिंह",
  "कन्या",
  "तुला",
  "वृश्चिक",
  "धनु",
  "मकर",
  "कुंभ",
  "मीन",
];

const RASHI_LORDS: Record<string, string> = {
  मेष: "मंगल",
  वृषभ: "शुक्र",
  मिथुन: "बुध",
  कर्क: "चंद्र",
  सिंह: "सूर्य",
  कन्या: "बुध",
  तुला: "शुक्र",
  वृश्चिक: "मंगल",
  धनु: "गुरु",
  मकर: "शनि",
  कुंभ: "शनि",
  मीन: "गुरु",
};

const RASHI_ELEMENT: Record<string, string> = {
  मेष: "अग्नि",
  वृषभ: "पृथ्वी",
  मिथुन: "वायु",
  कर्क: "जल",
  सिंह: "अग्नि",
  कन्या: "पृथ्वी",
  तुला: "वायु",
  वृश्चिक: "जल",
  धनु: "अग्नि",
  मकर: "पृथ्वी",
  कुंभ: "वायु",
  मीन: "जल",
};

const RASHI_VARNA: Record<string, string> = {
  मेष: "क्षत्रिय",
  वृषभ: "वैश्य",
  मिथुन: "शूद्र",
  कर्क: "ब्राह्मण",
  सिंह: "क्षत्रिय",
  कन्या: "वैश्य",
  तुला: "शूद्र",
  वृश्चिक: "ब्राह्मण",
  धनु: "क्षत्रिय",
  मकर: "वैश्य",
  कुंभ: "शूद्र",
  मीन: "ब्राह्मण",
};

// Vashya groups
const VASHYA_GROUPS: string[][] = [
  ["मेष", "सिंह", "धनु"], // चतुष्पद
  ["वृषभ", "मकर"], // चतुष्पद
  ["मिथुन", "तुला", "कुंभ", "कन्या"], // मानव/द्विपद
  ["कर्क", "वृश्चिक", "मीन"], // जलचर
  ["वृश्चिक"], // कीट
];

function getRashiFromDate(dobStr: string, _tobStr: string): string {
  // Simplified moon sign estimation based on birth date
  // In real astrology, this requires ephemeris. We'll use a simplified cyclic method.
  const parts = dobStr.split("-");
  if (parts.length !== 3) return "मेष";
  const year = Number.parseInt(parts[0], 10);
  const month = Number.parseInt(parts[1], 10);
  const day = Number.parseInt(parts[2], 10);
  // Julian Day Number approximation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  // Moon completes cycle in ~27.32 days across 27 nakshatras
  const nakshatraIndex = Math.abs(jdn * 13 + 5) % 27;
  const nak = NAKSHATRAS[nakshatraIndex];
  const rashiStr = nak.rashi.split("/")[0];
  return rashiStr;
}

function getNakshatraFromDate(dobStr: string): number {
  const parts = dobStr.split("-");
  if (parts.length !== 3) return 0;
  const year = Number.parseInt(parts[0], 10);
  const month = Number.parseInt(parts[1], 10);
  const day = Number.parseInt(parts[2], 10);
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  return Math.abs(jdn * 13 + 5) % 27;
}

function getLagna(_dobStr: string, tobStr: string): string {
  const timeParts = tobStr.split(":");
  const hours = Number.parseInt(timeParts[0] || "12", 10);
  const lagnaIndex = Math.floor((hours * 2) / 2) % 12;
  return RASHIS[lagnaIndex];
}

function getMangalDosha(rashi: string, nakshatraIndex: number): boolean {
  // Mangal dosha: Mars in 1, 4, 7, 8, 12 houses from lagna/moon
  const mangalDoshaRashis = ["मेष", "वृश्चिक", "कर्क", "कन्या", "मकर"];
  return mangalDoshaRashis.includes(rashi) || nakshatraIndex % 6 === 0;
}

// GUNA MILAN CALCULATIONS

function calcVarna(varRashi: string, vadhuRashi: string): number {
  const varnaOrder: Record<string, number> = {
    ब्राह्मण: 4,
    क्षत्रिय: 3,
    वैश्य: 2,
    शूद्र: 1,
  };
  const v1 = varnaOrder[RASHI_VARNA[varRashi]] || 1;
  const v2 = varnaOrder[RASHI_VARNA[vadhuRashi]] || 1;
  return v1 >= v2 ? 1 : 0;
}

function calcVashya(varRashi: string, vadhuRashi: string): number {
  for (const group of VASHYA_GROUPS) {
    if (group.includes(varRashi) && group.includes(vadhuRashi)) return 2;
  }
  // Partial matches
  const friendly: Record<string, string[]> = {
    मेष: ["सिंह"],
    वृषभ: ["कर्क"],
    मिथुन: ["कन्या"],
    कर्क: ["वृश्चिक"],
    सिंह: ["धनु"],
    कन्या: ["मिथुन"],
    तुला: ["कुंभ"],
    वृश्चिक: ["मीन"],
    धनु: ["मेष"],
    मकर: ["वृषभ"],
    कुंभ: ["तुला"],
    मीन: ["वृश्चिक"],
  };
  if (friendly[varRashi]?.includes(vadhuRashi)) return 1;
  return 0;
}

function calcTara(varNak: number, vadhuNak: number): number {
  const tara = (((vadhuNak - varNak + 27) % 27) % 9) + 1;
  const goodTaras = [1, 2, 4, 6, 8];
  return goodTaras.includes(tara) ? 3 : 0;
}

function calcYoni(varNak: number, vadhuNak: number): number {
  const nak1 = NAKSHATRAS[varNak];
  const nak2 = NAKSHATRAS[vadhuNak];
  if (nak1.yoni === nak2.yoni) return 4;
  const friendly: Record<string, string[]> = {
    अश्व: ["अश्व", "महिष"],
    गज: ["गज", "सिंह"],
    मेष: ["मेष", "वानर"],
    सर्प: ["सर्प", "नकुल"],
    श्वान: ["श्वान", "मृग"],
    मार्जार: ["मार्जार", "गाय"],
    मूषक: ["मूषक", "गज"],
    गाय: ["गाय", "व्याघ्र"],
    महिष: ["महिष", "अश्व"],
    व्याघ्र: ["व्याघ्र", "गाय"],
    मृग: ["मृग", "श्वान"],
    वानर: ["वानर", "मेष"],
    नकुल: ["नकुल", "सर्प"],
    सिंह: ["सिंह", "गज"],
  };
  if (friendly[nak1.yoni]?.includes(nak2.yoni)) return 3;
  const hostile: Record<string, string[]> = {
    अश्व: ["महिष"],
    गज: ["सिंह"],
    मेष: ["वानर"],
    श्वान: ["मृग"],
    मार्जार: ["मूषक"],
  };
  if (hostile[nak1.yoni]?.includes(nak2.yoni)) return 0;
  return 2;
}

function calcGrahaMaitri(varRashi: string, vadhuRashi: string): number {
  const lord1 = RASHI_LORDS[varRashi];
  const lord2 = RASHI_LORDS[vadhuRashi];
  if (lord1 === lord2) return 5;
  const friendships: Record<string, string[]> = {
    सूर्य: ["चंद्र", "मंगल", "गुरु"],
    चंद्र: ["सूर्य", "बुध"],
    मंगल: ["सूर्य", "चंद्र", "गुरु"],
    बुध: ["सूर्य", "शुक्र"],
    गुरु: ["सूर्य", "चंद्र", "मंगल"],
    शुक्र: ["बुध", "शनि"],
    शनि: ["बुध", "शुक्र"],
    राहु: ["शनि", "शुक्र"],
    केतु: ["मंगल", "गुरु"],
  };
  if (
    friendships[lord1]?.includes(lord2) &&
    friendships[lord2]?.includes(lord1)
  )
    return 5;
  if (
    friendships[lord1]?.includes(lord2) ||
    friendships[lord2]?.includes(lord1)
  )
    return 4;
  const neutral: Record<string, string[]> = {
    सूर्य: ["बुध"],
    चंद्र: ["मंगल", "गुरु", "शुक्र", "शनि"],
    मंगल: ["बुध", "शुक्र", "शनि"],
    बुध: ["मंगल", "गुरु", "शनि"],
    गुरु: ["शुक्र", "शनि"],
    शुक्र: ["मंगल", "गुरु"],
    शनि: ["मंगल", "गुरु"],
  };
  if (neutral[lord1]?.includes(lord2)) return 3;
  return 1;
}

function calcGana(varNak: number, vadhuNak: number): number {
  const g1 = NAKSHATRAS[varNak].gana;
  const g2 = NAKSHATRAS[vadhuNak].gana;
  if (g1 === g2) return 6;
  if ((g1 === "देव" && g2 === "मनुष्य") || (g1 === "मनुष्य" && g2 === "देव"))
    return 5;
  if ((g1 === "देव" && g2 === "राक्षस") || (g1 === "राक्षस" && g2 === "देव"))
    return 1;
  if ((g1 === "मनुष्य" && g2 === "राक्षस") || (g1 === "राक्षस" && g2 === "मनुष्य"))
    return 3;
  return 0;
}

function calcBhakoot(varRashi: string, vadhuRashi: string): number {
  const r1 = RASHIS.indexOf(varRashi);
  const r2 = RASHIS.indexOf(vadhuRashi);
  const diff = ((r2 - r1 + 12) % 12) + 1;
  const bad = [6, 8, 12];
  if (bad.includes(diff)) return 0;
  return 7;
}

function calcNadi(varNak: number, vadhuNak: number): number {
  const n1 = NAKSHATRAS[varNak].nadi;
  const n2 = NAKSHATRAS[vadhuNak].nadi;
  return n1 === n2 ? 0 : 8;
}

interface PersonData {
  name: string;
  dob: string;
  tob: string;
  pob: string;
}

interface AstroProfile {
  rashi: string;
  nakshatra: string;
  nakshatraIndex: number;
  lagna: string;
  lord: string;
  element: string;
  varna: string;
  gana: string;
  nadi: string;
  mangalDosha: boolean;
}

function computeProfile(person: PersonData): AstroProfile {
  const nakIdx = getNakshatraFromDate(person.dob);
  const nak = NAKSHATRAS[nakIdx];
  const rashi = getRashiFromDate(person.dob, person.tob);
  const lagna = getLagna(person.dob, person.tob);
  const mangal = getMangalDosha(rashi, nakIdx);
  return {
    rashi,
    nakshatra: nak.name,
    nakshatraIndex: nakIdx,
    lagna,
    lord: RASHI_LORDS[rashi] || "—",
    element: RASHI_ELEMENT[rashi] || "—",
    varna: RASHI_VARNA[rashi] || "—",
    gana: nak.gana,
    nadi: nak.nadi,
    mangalDosha: mangal,
  };
}

interface KootaResult {
  name: string;
  maxScore: number;
  score: number;
  varDetail: string;
  vadhuDetail: string;
}

function computeGunas(
  varProfile: AstroProfile,
  vadhuProfile: AstroProfile,
): KootaResult[] {
  return [
    {
      name: "वर्ण",
      maxScore: 1,
      score: calcVarna(varProfile.rashi, vadhuProfile.rashi),
      varDetail: varProfile.varna,
      vadhuDetail: vadhuProfile.varna,
    },
    {
      name: "वश्य",
      maxScore: 2,
      score: calcVashya(varProfile.rashi, vadhuProfile.rashi),
      varDetail: varProfile.rashi,
      vadhuDetail: vadhuProfile.rashi,
    },
    {
      name: "तारा",
      maxScore: 3,
      score: calcTara(varProfile.nakshatraIndex, vadhuProfile.nakshatraIndex),
      varDetail: varProfile.nakshatra,
      vadhuDetail: vadhuProfile.nakshatra,
    },
    {
      name: "योनि",
      maxScore: 4,
      score: calcYoni(varProfile.nakshatraIndex, vadhuProfile.nakshatraIndex),
      varDetail: NAKSHATRAS[varProfile.nakshatraIndex].yoni,
      vadhuDetail: NAKSHATRAS[vadhuProfile.nakshatraIndex].yoni,
    },
    {
      name: "ग्रह मैत्री",
      maxScore: 5,
      score: calcGrahaMaitri(varProfile.rashi, vadhuProfile.rashi),
      varDetail: varProfile.lord,
      vadhuDetail: vadhuProfile.lord,
    },
    {
      name: "गण",
      maxScore: 6,
      score: calcGana(varProfile.nakshatraIndex, vadhuProfile.nakshatraIndex),
      varDetail: varProfile.gana,
      vadhuDetail: vadhuProfile.gana,
    },
    {
      name: "भकूट",
      maxScore: 7,
      score: calcBhakoot(varProfile.rashi, vadhuProfile.rashi),
      varDetail: varProfile.rashi,
      vadhuDetail: vadhuProfile.rashi,
    },
    {
      name: "नाड़ी",
      maxScore: 8,
      score: calcNadi(varProfile.nakshatraIndex, vadhuProfile.nakshatraIndex),
      varDetail: varProfile.nadi,
      vadhuDetail: vadhuProfile.nadi,
    },
  ];
}

function getVerdict(total: number): {
  text: string;
  color: string;
  emoji: string;
} {
  if (total >= 32)
    return { text: "अत्युत्तम मिलान — अति शुभ", color: "#22c55e", emoji: "🌟" };
  if (total >= 28)
    return { text: "उत्तम मिलान — शुभ", color: "#84cc16", emoji: "✅" };
  if (total >= 24)
    return { text: "मध्यम मिलान — सामान्य", color: "#f5d76e", emoji: "🔔" };
  if (total >= 18)
    return { text: "सामान्य मिलान — विचारणीय", color: "#fb923c", emoji: "⚠️" };
  return { text: "अल्प मिलान — अशुभ", color: "#ef4444", emoji: "❌" };
}

const INITIAL: PersonData = { name: "", dob: "", tob: "12:00", pob: "" };

export function KundaliMilan({ onBack }: KundaliMilanProps) {
  const [var_, setVar] = useState<PersonData>({ ...INITIAL });
  const [vadhu, setVadhu] = useState<PersonData>({ ...INITIAL });
  const [result, setResult] = useState<null | {
    varProfile: AstroProfile;
    vadhuProfile: AstroProfile;
    kootas: KootaResult[];
    total: number;
  }>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared">(
    "idle",
  );

  function handleCalculate() {
    if (!var_.dob || !vadhu.dob) return;
    const varProfile = computeProfile(var_);
    const vadhuProfile = computeProfile(vadhu);
    const kootas = computeGunas(varProfile, vadhuProfile);
    const total = kootas.reduce((s, k) => s + k.score, 0);
    setResult({ varProfile, vadhuProfile, kootas, total });
  }

  function buildReportText(): string {
    if (!result) return "";
    const v = getVerdict(result.total);
    const lines = [
      "═══════════════════════════════",
      "       कुंडली मिलान रिपोर्ट",
      "    ज्योतिषी उमेश जी",
      "═══════════════════════════════",
      "",
      `🤵 वर: ${var_.name || "—"}`,
      `   राशि: ${result.varProfile.rashi} | नक्षत्र: ${result.varProfile.nakshatra}`,
      `   लग्न: ${result.varProfile.lagna} | ग्रह: ${result.varProfile.lord}`,
      `   गण: ${result.varProfile.gana} | नाड़ी: ${result.varProfile.nadi}`,
      `   मंगल दोष: ${result.varProfile.mangalDosha ? "हाँ" : "नहीं"}`,
      "",
      `👰 वधु: ${vadhu.name || "—"}`,
      `   राशि: ${result.vadhuProfile.rashi} | नक्षत्र: ${result.vadhuProfile.nakshatra}`,
      `   लग्न: ${result.vadhuProfile.lagna} | ग्रह: ${result.vadhuProfile.lord}`,
      `   गण: ${result.vadhuProfile.gana} | नाड़ी: ${result.vadhuProfile.nadi}`,
      `   मंगल दोष: ${result.vadhuProfile.mangalDosha ? "हाँ" : "नहीं"}`,
      "",
      "── गुण मिलान (8 कूट) ──",
      ...result.kootas.map(
        (k) => `${k.name.padEnd(12)}: ${k.score}/${k.maxScore}`,
      ),
      "",
      `🔢 कुल गुण: ${result.total}/36`,
      `${v.emoji} परिणाम: ${v.text}`,
      "",
      "✨ ज्योतिषी उमेश जी",
      "📱 WhatsApp: +91 9654123331",
      "📸 Instagram: @umesh.astrology",
      "═══════════════════════════════",
    ];
    return lines.join("\n");
  }

  async function handleShare() {
    const text = buildReportText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "कुंडली मिलान रिपोर्ट — ज्योतिषी उमेश जी",
          text,
        });
        setShareStatus("shared");
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      setShareStatus("copied");
    }
    setTimeout(() => setShareStatus("idle"), 3000);
  }

  const verdict = result ? getVerdict(result.total) : null;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #04061a 0%, #080b20 30%, #0d1035 70%, #080b20 100%)",
      }}
    >
      <StarField />
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={onBack}
            data-ocid="kundali.back.button"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:scale-105"
            style={{
              background: "rgba(245,215,110,0.1)",
              border: "1px solid rgba(245,215,110,0.3)",
              color: "#f5d76e",
            }}
          >
            <ArrowLeft size={18} />
            <span className="devanagari text-sm">वापस</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="h-px flex-1 max-w-24"
              style={{
                background: "linear-gradient(90deg, transparent, #f5d76e)",
              }}
            />
            <span className="text-3xl">🔯</span>
            <div
              className="h-px flex-1 max-w-24"
              style={{
                background: "linear-gradient(90deg, #f5d76e, transparent)",
              }}
            />
          </div>
          <h1 className="cinzel text-4xl md:text-5xl font-bold gold-shimmer mb-2">
            कुंडली मिलान
          </h1>
          <p className="devanagari text-white/60 text-sm">
            वर-वधु ज्योतिष विवरण एवं गुण मिलान
          </p>
          <p className="devanagari text-white/40 text-xs mt-1">
            ज्योतिषी उमेश जी | +91 9654123331
          </p>
        </div>

        {/* Input Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Var (Groom) */}
          <div
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(30,20,80,0.7), rgba(50,30,100,0.5))",
              border: "1px solid rgba(100,80,200,0.4)",
            }}
          >
            <h2
              className="devanagari text-xl font-bold mb-4 text-center"
              style={{ color: "#a78bfa" }}
            >
              🤵 वर (दूल्हा)
            </h2>
            <div className="space-y-3">
              <div>
                <p className="devanagari text-xs text-white/50 block mb-1">
                  नाम
                </p>
                <input
                  type="text"
                  value={var_.name}
                  onChange={(e) => setVar({ ...var_, name: e.target.value })}
                  placeholder="वर का नाम"
                  data-ocid="kundali.var.name.input"
                  className="w-full px-3 py-2 rounded-lg text-sm devanagari"
                  style={{
                    background: "rgba(10,15,40,0.8)",
                    border: "1px solid rgba(167,139,250,0.3)",
                    color: "#e2d9f3",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <p className="devanagari text-xs text-white/50 block mb-1">
                  जन्म तिथि
                </p>
                <input
                  type="date"
                  value={var_.dob}
                  onChange={(e) => setVar({ ...var_, dob: e.target.value })}
                  data-ocid="kundali.var.dob.input"
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: "rgba(10,15,40,0.8)",
                    border: "1px solid rgba(167,139,250,0.3)",
                    color: "#e2d9f3",
                    outline: "none",
                    colorScheme: "dark",
                  }}
                />
              </div>
              <div>
                <p className="devanagari text-xs text-white/50 block mb-1">
                  जन्म समय
                </p>
                <input
                  type="time"
                  value={var_.tob}
                  onChange={(e) => setVar({ ...var_, tob: e.target.value })}
                  data-ocid="kundali.var.tob.input"
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: "rgba(10,15,40,0.8)",
                    border: "1px solid rgba(167,139,250,0.3)",
                    color: "#e2d9f3",
                    outline: "none",
                    colorScheme: "dark",
                  }}
                />
              </div>
              <div>
                <p className="devanagari text-xs text-white/50 block mb-1">
                  जन्म स्थान
                </p>
                <input
                  type="text"
                  value={var_.pob}
                  onChange={(e) => setVar({ ...var_, pob: e.target.value })}
                  placeholder="शहर / जिला"
                  data-ocid="kundali.var.pob.input"
                  className="w-full px-3 py-2 rounded-lg text-sm devanagari"
                  style={{
                    background: "rgba(10,15,40,0.8)",
                    border: "1px solid rgba(167,139,250,0.3)",
                    color: "#e2d9f3",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Vadhu (Bride) */}
          <div
            className="rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(80,20,50,0.7), rgba(120,30,80,0.5))",
              border: "1px solid rgba(244,114,182,0.4)",
            }}
          >
            <h2
              className="devanagari text-xl font-bold mb-4 text-center"
              style={{ color: "#f472b6" }}
            >
              👰 वधु (दुल्हन)
            </h2>
            <div className="space-y-3">
              <div>
                <p className="devanagari text-xs text-white/50 block mb-1">
                  नाम
                </p>
                <input
                  type="text"
                  value={vadhu.name}
                  onChange={(e) => setVadhu({ ...vadhu, name: e.target.value })}
                  placeholder="वधु का नाम"
                  data-ocid="kundali.vadhu.name.input"
                  className="w-full px-3 py-2 rounded-lg text-sm devanagari"
                  style={{
                    background: "rgba(40,5,25,0.8)",
                    border: "1px solid rgba(244,114,182,0.3)",
                    color: "#fce7f3",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <p className="devanagari text-xs text-white/50 block mb-1">
                  जन्म तिथि
                </p>
                <input
                  type="date"
                  value={vadhu.dob}
                  onChange={(e) => setVadhu({ ...vadhu, dob: e.target.value })}
                  data-ocid="kundali.vadhu.dob.input"
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: "rgba(40,5,25,0.8)",
                    border: "1px solid rgba(244,114,182,0.3)",
                    color: "#fce7f3",
                    outline: "none",
                    colorScheme: "dark",
                  }}
                />
              </div>
              <div>
                <p className="devanagari text-xs text-white/50 block mb-1">
                  जन्म समय
                </p>
                <input
                  type="time"
                  value={vadhu.tob}
                  onChange={(e) => setVadhu({ ...vadhu, tob: e.target.value })}
                  data-ocid="kundali.vadhu.tob.input"
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: "rgba(40,5,25,0.8)",
                    border: "1px solid rgba(244,114,182,0.3)",
                    color: "#fce7f3",
                    outline: "none",
                    colorScheme: "dark",
                  }}
                />
              </div>
              <div>
                <p className="devanagari text-xs text-white/50 block mb-1">
                  जन्म स्थान
                </p>
                <input
                  type="text"
                  value={vadhu.pob}
                  onChange={(e) => setVadhu({ ...vadhu, pob: e.target.value })}
                  placeholder="शहर / जिला"
                  data-ocid="kundali.vadhu.pob.input"
                  className="w-full px-3 py-2 rounded-lg text-sm devanagari"
                  style={{
                    background: "rgba(40,5,25,0.8)",
                    border: "1px solid rgba(244,114,182,0.3)",
                    color: "#fce7f3",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={handleCalculate}
            disabled={!var_.dob || !vadhu.dob}
            data-ocid="kundali.calculate.button"
            className="devanagari px-10 py-4 rounded-2xl text-xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, #e8b84b 0%, #f5d76e 40%, #c9962e 100%)",
              color: "#1a0a00",
              boxShadow: "0 0 30px rgba(232,184,75,0.6)",
              border: "1px solid rgba(245,215,110,0.8)",
            }}
          >
            🔯 गुण मिलान करें
          </button>
        </div>

        {/* Results */}
        {result && verdict && (
          <div data-ocid="kundali.result.section">
            {/* Score Banner */}
            <div
              className="rounded-2xl p-6 text-center mb-6"
              style={{
                background:
                  "linear-gradient(135deg, rgba(20,15,50,0.9), rgba(30,20,60,0.8))",
                border: `2px solid ${verdict.color}`,
                boxShadow: `0 0 30px ${verdict.color}40`,
              }}
            >
              <div
                className="text-6xl font-bold mb-2"
                style={{ color: verdict.color }}
              >
                {result.total}
                <span className="text-3xl text-white/40">/36</span>
              </div>
              <p
                className="devanagari text-2xl font-bold mb-1"
                style={{ color: verdict.color }}
              >
                {verdict.emoji} {verdict.text}
              </p>
              <p className="devanagari text-white/50 text-sm">
                {var_.name || "वर"} × {vadhu.name || "वधु"}
              </p>
            </div>

            {/* Astrological Profiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                {
                  label: "🤵 वर का ज्योतिष विवरण",
                  profile: result.varProfile,
                  name: var_.name,
                  color: "#a78bfa",
                  border: "rgba(167,139,250,0.4)",
                },
                {
                  label: "👰 वधु का ज्योतिष विवरण",
                  profile: result.vadhuProfile,
                  name: vadhu.name,
                  color: "#f472b6",
                  border: "rgba(244,114,182,0.4)",
                },
              ].map(({ label, profile, name, color, border }) => (
                <div
                  key={label}
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(10,15,40,0.7)",
                    border: `1px solid ${border}`,
                  }}
                >
                  <h3
                    className="devanagari font-bold text-lg mb-4"
                    style={{ color }}
                  >
                    {label}
                  </h3>
                  {name && (
                    <p className="devanagari text-white font-semibold mb-3">
                      {name}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      ["राशि", profile.rashi],
                      ["नक्षत्र", profile.nakshatra],
                      ["लग्न", profile.lagna],
                      ["स्वामी ग्रह", profile.lord],
                      ["तत्व", profile.element],
                      ["वर्ण", profile.varna],
                      ["गण", profile.gana],
                      ["नाड़ी", profile.nadi],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="rounded-lg p-2"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      >
                        <div className="devanagari text-white/40 text-xs">
                          {k}
                        </div>
                        <div className="devanagari text-white font-semibold">
                          {v}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="mt-3 rounded-lg p-3 text-center"
                    style={{
                      background: profile.mangalDosha
                        ? "rgba(239,68,68,0.15)"
                        : "rgba(34,197,94,0.1)",
                      border: `1px solid ${profile.mangalDosha ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.3)"}`,
                    }}
                  >
                    <span
                      className="devanagari text-sm font-semibold"
                      style={{
                        color: profile.mangalDosha ? "#f87171" : "#4ade80",
                      }}
                    >
                      {profile.mangalDosha ? "⚠️ मंगल दोष है" : "✅ मंगल दोष नहीं"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Guna Milan Table */}
            <div
              className="rounded-2xl overflow-hidden mb-6"
              style={{ border: "1px solid rgba(245,215,110,0.3)" }}
            >
              <div
                className="px-5 py-3"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(232,184,75,0.2), rgba(245,215,110,0.1))",
                }}
              >
                <h3
                  className="devanagari text-lg font-bold"
                  style={{ color: "#f5d76e" }}
                >
                  📊 गुण मिलान — 8 कूट विवरण
                </h3>
              </div>
              <div style={{ background: "rgba(10,15,40,0.8)" }}>
                {/* Header */}
                <div
                  className="grid grid-cols-4 gap-0 px-4 py-2 text-xs font-semibold"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(245,215,110,0.7)",
                  }}
                >
                  <span className="devanagari">कूट</span>
                  <span className="devanagari text-center">वर</span>
                  <span className="devanagari text-center">वधु</span>
                  <span className="devanagari text-right">गुण</span>
                </div>
                {result.kootas.map((k, i) => {
                  const pct = k.score / k.maxScore;
                  const scoreColor =
                    pct === 1
                      ? "#22c55e"
                      : pct >= 0.6
                        ? "#f5d76e"
                        : pct > 0
                          ? "#fb923c"
                          : "#ef4444";
                  return (
                    <div
                      key={k.name}
                      data-ocid={`kundali.koota.item.${i + 1}`}
                      className="grid grid-cols-4 gap-0 px-4 py-3 text-sm"
                      style={{
                        borderBottom:
                          i < 7 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      }}
                    >
                      <span className="devanagari text-white font-semibold">
                        {k.name}
                      </span>
                      <span className="devanagari text-white/60 text-center text-xs">
                        {k.varDetail}
                      </span>
                      <span className="devanagari text-white/60 text-center text-xs">
                        {k.vadhuDetail}
                      </span>
                      <span
                        className="devanagari font-bold text-right"
                        style={{ color: scoreColor }}
                      >
                        {k.score}/{k.maxScore}
                      </span>
                    </div>
                  );
                })}
                {/* Total row */}
                <div
                  className="grid grid-cols-4 gap-0 px-4 py-3"
                  style={{
                    background: "rgba(245,215,110,0.08)",
                    borderTop: "2px solid rgba(245,215,110,0.3)",
                  }}
                >
                  <span className="devanagari text-white font-bold col-span-3">
                    कुल गुण
                  </span>
                  <span
                    className="devanagari font-bold text-right text-lg"
                    style={{ color: verdict.color }}
                  >
                    {result.total}/36
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div
              className="rounded-2xl p-5 mb-6"
              style={{
                background:
                  "linear-gradient(135deg, rgba(20,15,50,0.9), rgba(30,20,60,0.8))",
                border: "1px solid rgba(245,215,110,0.25)",
              }}
            >
              <h3
                className="devanagari text-lg font-bold mb-3"
                style={{ color: "#f5d76e" }}
              >
                📋 ज्योतिषी परामर्श
              </h3>
              <p className="devanagari text-white/70 text-sm leading-relaxed">
                {result.total >= 32
                  ? `यह मिलान अत्यंत शुभ है। ${result.total} गुण मिलने से यह जोड़ी एक-दूसरे के लिए सर्वोत्तम है। दाम्पत्य जीवन सुखमय एवं समृद्धिशाली रहेगा।`
                  : result.total >= 28
                    ? `यह मिलान उत्तम है। ${result.total} गुण मिलने से यह जोड़ी सुखी जीवन व्यतीत करेगी। विवाह शुभ फलदायी रहेगा।`
                    : result.total >= 24
                      ? `यह मिलान मध्यम है। ${result.total} गुण मिले हैं। विस्तृत कुंडली मिलान के लिए ज्योतिषी उमेश जी से सम्पर्क करें।`
                      : result.total >= 18
                        ? `इस मिलान में ${result.total} गुण हैं। कुछ दोष हो सकते हैं। विस्तृत परामर्श के लिए ज्योतिषी उमेश जी से व्यक्तिगत रूप से मिलें।`
                        : `इस मिलान में केवल ${result.total} गुण हैं। पूर्ण कुंडली मिलान एवं उपाय जानने के लिए ज्योतिषी उमेश जी से तुरंत सम्पर्क करें।`}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/919654123331"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="kundali.whatsapp.link"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm devanagari font-semibold transition-all hover:scale-105"
                  style={{
                    background: "rgba(37,211,102,0.15)",
                    border: "1px solid rgba(37,211,102,0.4)",
                    color: "#4ade80",
                  }}
                >
                  📱 विस्तृत परामर्श लें
                </a>
              </div>
            </div>

            {/* Share Button */}
            <div className="flex justify-center mb-8">
              <button
                type="button"
                onClick={handleShare}
                data-ocid="kundali.share.button"
                className="devanagari flex items-center justify-center gap-3 w-full max-w-md px-8 py-4 rounded-2xl text-lg font-bold transition-all hover:scale-105 active:scale-95"
                style={{
                  background:
                    shareStatus !== "idle"
                      ? "linear-gradient(135deg, #27ae60, #1e8449)"
                      : "linear-gradient(135deg, #e8b84b 0%, #f5d76e 40%, #c9962e 100%)",
                  color: shareStatus !== "idle" ? "#ffffff" : "#1a0a00",
                  boxShadow: "0 0 25px rgba(232,184,75,0.5)",
                  border: "1px solid rgba(245,215,110,0.6)",
                }}
              >
                <Share2 size={20} />
                {shareStatus === "copied"
                  ? "✅ कॉपी हो गया!"
                  : shareStatus === "shared"
                    ? "✅ शेयर हो गया!"
                    : "📤 रिपोर्ट शेयर करें"}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center pb-6">
          <p className="devanagari text-white/30 text-sm">
            ज्योतिषी उमेश जी | +91 9654123331
          </p>
        </footer>
      </div>
    </div>
  );
}
