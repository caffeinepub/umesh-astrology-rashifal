import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { useState } from "react";
import { StarField } from "./StarField";

interface KundaliMilanProps {
  onBack: () => void;
}

// ===== ACCURATE ASTRONOMICAL CALCULATIONS =====
// Based on Jean Meeus "Astronomical Algorithms" (2nd Edition)

function toJulianDay(dateStr: string, timeStr: string): number {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return 2451545.0;
  let year = Number.parseInt(parts[0], 10);
  let month = Number.parseInt(parts[1], 10);
  const day = Number.parseInt(parts[2], 10);
  const timeParts = timeStr.split(":");
  const hour = Number.parseInt(timeParts[0] || "12", 10);
  const min = Number.parseInt(timeParts[1] || "0", 10);
  // Convert local India time (IST = UTC+5:30) to UTC
  const totalMinutesUTC = hour * 60 + min - 330;
  const hourUTC = totalMinutesUTC / 60;

  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    B -
    1524.5 +
    hourUTC / 24
  );
}

// Lahiri Ayanamsha (Chitrapaksha) - accurate formula
function getLahiriAyanamsha(T: number): number {
  // T in Julian centuries from J2000.0
  // Reference value at J2000.0 is 23.85° with annual precession ~50.3"
  return 23.85 + T * 1.3969; // degrees
}

// Accurate Moon tropical longitude using Meeus Chapter 47
function getMoonTropicalLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;

  // Moon's mean longitude L'
  let Lp =
    218.3164477 +
    481267.88123421 * T -
    0.0015786 * T * T +
    (T * T * T) / 538841 -
    (T * T * T * T) / 65194000;

  // Moon's mean elongation D
  let D =
    297.8501921 +
    445267.1114034 * T -
    0.0018819 * T * T +
    (T * T * T) / 545868 -
    (T * T * T * T) / 113065000;

  // Sun's mean anomaly M
  let M =
    357.5291092 +
    35999.0502909 * T -
    0.0001536 * T * T +
    (T * T * T) / 24490000;

  // Moon's mean anomaly M'
  let Mp =
    134.9633964 +
    477198.8675055 * T +
    0.0087414 * T * T +
    (T * T * T) / 69699 -
    (T * T * T * T) / 14712000;

  // Moon's argument of latitude F
  let F =
    93.272095 +
    483202.0175233 * T -
    0.0036539 * T * T -
    (T * T * T) / 3526000 +
    (T * T * T * T) / 863310000;

  // Additional arguments
  const A1 = 119.75 + 131.849 * T;
  const A2 = 53.09 + 479264.29 * T;
  const _A3 = 313.45 + 481266.484 * T;

  const r = Math.PI / 180;
  D = ((D % 360) + 360) % 360;
  M = ((M % 360) + 360) % 360;
  Mp = ((Mp % 360) + 360) % 360;
  F = ((F % 360) + 360) % 360;
  Lp = ((Lp % 360) + 360) % 360;

  const Dr = D * r;
  const Mr = M * r;
  const Mpr = Mp * r;
  const Fr = F * r;

  // Sum of periodic terms for longitude (0.000001 degree units)
  let dL =
    6288774 * Math.sin(Mpr) +
    1274027 * Math.sin(2 * Dr - Mpr) +
    658314 * Math.sin(2 * Dr) +
    213618 * Math.sin(2 * Mpr) -
    185116 * Math.sin(Mr) -
    114332 * Math.sin(2 * Fr) +
    58793 * Math.sin(2 * Dr - 2 * Mpr) +
    57066 * Math.sin(2 * Dr - Mr - Mpr) +
    53322 * Math.sin(2 * Dr + Mpr) +
    45758 * Math.sin(2 * Dr - Mr) -
    40923 * Math.sin(Mr - Mpr) -
    34720 * Math.sin(Dr) -
    30383 * Math.sin(Mr + Mpr) +
    15327 * Math.sin(2 * Dr - 2 * Fr) -
    12528 * Math.sin(Mpr + 2 * Fr) +
    10980 * Math.sin(Mpr - 2 * Fr) +
    10675 * Math.sin(4 * Dr - Mpr) +
    10034 * Math.sin(3 * Mpr) +
    8548 * Math.sin(4 * Dr - 2 * Mpr) -
    7888 * Math.sin(2 * Dr + Mr - Mpr) -
    6766 * Math.sin(2 * Dr + Mr) -
    5163 * Math.sin(Dr - Mpr) +
    4987 * Math.sin(Dr + Mr) +
    4036 * Math.sin(2 * Dr - Mr + Mpr) +
    3994 * Math.sin(2 * Dr + 2 * Mpr) +
    3861 * Math.sin(4 * Dr) +
    3665 * Math.sin(2 * Dr - 3 * Mpr) -
    2689 * Math.sin(Mr - 2 * Mpr) -
    2602 * Math.sin(2 * Dr - Mpr + 2 * Fr) +
    2390 * Math.sin(2 * Dr - Mr - 2 * Mpr) -
    2348 * Math.sin(Dr + Mpr) +
    2236 * Math.sin(2 * Dr - 2 * Mr) -
    2120 * Math.sin(Mr + 2 * Mpr) -
    2069 * Math.sin(2 * Mr) +
    2048 * Math.sin(2 * Dr - 2 * Mr - Mpr) -
    1773 * Math.sin(2 * Dr + Mpr - 2 * Fr) -
    1595 * Math.sin(2 * Dr + 2 * Fr) +
    1215 * Math.sin(4 * Dr - Mr - Mpr) -
    1110 * Math.sin(2 * Mpr + 2 * Fr) -
    892 * Math.sin(3 * Dr - Mpr) -
    810 * Math.sin(2 * Dr + Mr + Mpr) +
    759 * Math.sin(4 * Dr - Mr - 2 * Mpr) -
    713 * Math.sin(2 * Mr - Mpr) -
    700 * Math.sin(2 * Dr + 2 * Mr - Mpr) +
    691 * Math.sin(2 * Dr + Mr - 2 * Mpr) +
    596 * Math.sin(2 * Dr - Mr - 2 * Fr) +
    549 * Math.sin(4 * Dr + Mpr) +
    537 * Math.sin(4 * Mpr) +
    520 * Math.sin(4 * Dr - Mr) -
    487 * Math.sin(Dr - 2 * Mpr) -
    399 * Math.sin(2 * Dr + Mr - 2 * Fr) -
    381 * Math.sin(2 * Mpr - 2 * Fr) +
    351 * Math.sin(Dr + Mr + Mpr) -
    340 * Math.sin(3 * Dr - 2 * Mpr) +
    330 * Math.sin(4 * Dr - 3 * Mpr) +
    327 * Math.sin(2 * Dr - Mr + 2 * Mpr) -
    323 * Math.sin(2 * Mr + Mpr) +
    299 * Math.sin(Dr + Mr - Mpr) +
    294 * Math.sin(2 * Dr + 3 * Mpr);

  // Additional corrections
  dL +=
    3958 * Math.sin(A1 * r) +
    1962 * Math.sin((Lp - F) * r) +
    318 * Math.sin(A2 * r);
  dL = dL / 1000000; // convert to degrees

  const tropicalLong = (((Lp + dL) % 360) + 360) % 360;
  return tropicalLong;
}

function getMoonSiderealLongitude(dateStr: string, timeStr: string): number {
  const jd = toJulianDay(dateStr, timeStr);
  const T = (jd - 2451545.0) / 36525.0;
  const tropical = getMoonTropicalLongitude(jd);
  const ayanamsha = getLahiriAyanamsha(T);
  return (((tropical - ayanamsha) % 360) + 360) % 360;
}

// Calculate Lagna (Ascendant) using sidereal time
function getLagnaIndex(
  dateStr: string,
  timeStr: string,
  pobLat = 22.0,
  pobLon = 82.5,
): number {
  const jd = toJulianDay(dateStr, timeStr);
  const T = (jd - 2451545.0) / 36525.0;

  // Greenwich Mean Sidereal Time at 0h UT
  const jd0 = Math.floor(jd - 0.5) + 0.5;
  const T0 = (jd0 - 2451545.0) / 36525.0;
  let GMST0 =
    100.4606184 +
    36000.77004 * T0 +
    0.000387933 * T0 * T0 -
    (T0 * T0 * T0) / 38710000;
  GMST0 = ((GMST0 % 360) + 360) % 360;

  // UT hours
  const timeParts = timeStr.split(":");
  const hour = Number.parseInt(timeParts[0] || "12", 10);
  const min = Number.parseInt(timeParts[1] || "0", 10);
  // Convert IST to UT
  const utHours = (hour * 60 + min - 330) / 60;
  const utHoursAdj = ((utHours % 24) + 24) % 24;

  // GMST at UT
  let GMST = GMST0 + 360.98564724 * (utHoursAdj / 24);
  GMST = ((GMST % 360) + 360) % 360;

  // Local Sidereal Time (degrees)
  let LST = (((GMST + pobLon) % 360) + 360) % 360;

  // Apply Lahiri Ayanamsha for sidereal LST
  const ayanamsha = getLahiriAyanamsha(T);
  let siderealLST = (((LST - ayanamsha) % 360) + 360) % 360;

  // Convert LST to RAMC
  const RAMC = siderealLST;

  // Calculate ascendant from RAMC using obliquity of ecliptic (~23.4°)
  const e = (23.439291111 - 0.013004167 * T) * (Math.PI / 180);
  const ramcRad = RAMC * (Math.PI / 180);
  const latRad = pobLat * (Math.PI / 180);

  // Ascendant formula
  const ascendantRad = Math.atan2(
    Math.cos(ramcRad),
    -(Math.sin(ramcRad) * Math.cos(e) + Math.tan(latRad) * Math.sin(e)),
  );
  let ascendant = (ascendantRad * 180) / Math.PI;
  ascendant = ((ascendant % 360) + 360) % 360;

  return Math.floor(ascendant / 30) % 12;
}

// Nakshatra data
const NAKSHATRAS = [
  { name: "अश्विनी", lord: "केतु", gana: "देव", yoni: "अश्व", nadi: "आदि" },
  { name: "भरणी", lord: "शुक्र", gana: "मनुष्य", yoni: "गज", nadi: "मध्य" },
  { name: "कृत्तिका", lord: "सूर्य", gana: "राक्षस", yoni: "मेष", nadi: "अंत्य" },
  { name: "रोहिणी", lord: "चंद्र", gana: "मनुष्य", yoni: "सर्प", nadi: "अंत्य" },
  { name: "मृगशिरा", lord: "मंगल", gana: "देव", yoni: "सर्प", nadi: "मध्य" },
  { name: "आर्द्रा", lord: "राहु", gana: "मनुष्य", yoni: "श्वान", nadi: "आदि" },
  { name: "पुनर्वसु", lord: "गुरु", gana: "देव", yoni: "मार्जार", nadi: "आदि" },
  { name: "पुष्य", lord: "शनि", gana: "देव", yoni: "मेष", nadi: "मध्य" },
  { name: "आश्लेषा", lord: "बुध", gana: "राक्षस", yoni: "मार्जार", nadi: "अंत्य" },
  { name: "मघा", lord: "केतु", gana: "राक्षस", yoni: "मूषक", nadi: "अंत्य" },
  { name: "पूर्वाफाल्गुनी", lord: "शुक्र", gana: "मनुष्य", yoni: "मूषक", nadi: "मध्य" },
  { name: "उत्तराफाल्गुनी", lord: "सूर्य", gana: "मनुष्य", yoni: "गाय", nadi: "आदि" },
  { name: "हस्त", lord: "चंद्र", gana: "देव", yoni: "महिष", nadi: "आदि" },
  { name: "चित्रा", lord: "मंगल", gana: "राक्षस", yoni: "व्याघ्र", nadi: "मध्य" },
  { name: "स्वाति", lord: "राहु", gana: "देव", yoni: "महिष", nadi: "अंत्य" },
  { name: "विशाखा", lord: "गुरु", gana: "राक्षस", yoni: "व्याघ्र", nadi: "अंत्य" },
  { name: "अनुराधा", lord: "शनि", gana: "देव", yoni: "मृग", nadi: "मध्य" },
  { name: "ज्येष्ठा", lord: "बुध", gana: "राक्षस", yoni: "मृग", nadi: "आदि" },
  { name: "मूल", lord: "केतु", gana: "राक्षस", yoni: "श्वान", nadi: "आदि" },
  { name: "पूर्वाषाढ़ा", lord: "शुक्र", gana: "मनुष्य", yoni: "वानर", nadi: "मध्य" },
  { name: "उत्तराषाढ़ा", lord: "सूर्य", gana: "मनुष्य", yoni: "नकुल", nadi: "अंत्य" },
  { name: "श्रवण", lord: "चंद्र", gana: "देव", yoni: "वानर", nadi: "अंत्य" },
  { name: "धनिष्ठा", lord: "मंगल", gana: "राक्षस", yoni: "सिंह", nadi: "मध्य" },
  { name: "शतभिषा", lord: "राहु", gana: "राक्षस", yoni: "अश्व", nadi: "आदि" },
  { name: "पूर्वाभाद्रपद", lord: "गुरु", gana: "मनुष्य", yoni: "सिंह", nadi: "आदि" },
  { name: "उत्तराभाद्रपद", lord: "शनि", gana: "मनुष्य", yoni: "गाय", nadi: "मध्य" },
  { name: "रेवती", lord: "बुध", gana: "देव", yoni: "गज", nadi: "अंत्य" },
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

const VASHYA_GROUPS: string[][] = [
  ["मेष", "सिंह", "धनु"],
  ["वृषभ", "मकर"],
  ["मिथुन", "तुला", "कुंभ", "कन्या"],
  ["कर्क", "वृश्चिक", "मीन"],
];

// Mangal dosha: Mars in 1, 2, 4, 7, 8, 12 from lagna
// We check based on lagna rashi
function _getMangalDosha(lagnaRashi: string, rashiOfMars: string): boolean {
  const lagnaIdx = RASHIS.indexOf(lagnaRashi);
  const marsIdx = RASHIS.indexOf(rashiOfMars);
  if (lagnaIdx < 0 || marsIdx < 0) return false;
  const pos = ((marsIdx - lagnaIdx + 12) % 12) + 1;
  return [1, 2, 4, 7, 8, 12].includes(pos);
}

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
    अश्व: ["महिष"],
    गज: ["सिंह"],
    मेष: ["वानर"],
    सर्प: ["नकुल"],
    श्वान: ["मृग"],
    मार्जार: ["गाय"],
    मूषक: ["गज"],
    गाय: ["व्याघ्र"],
    महिष: ["अश्व"],
    व्याघ्र: ["गाय"],
    मृग: ["श्वान"],
    वानर: ["मेष"],
    नकुल: ["सर्प"],
    सिंह: ["गज"],
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
  rashiIndex: number;
  nakshatra: string;
  nakshatraIndex: number;
  nakshatraPada: number;
  moonDegree: string;
  lagna: string;
  lord: string;
  element: string;
  varna: string;
  gana: string;
  nadi: string;
  mangalDosha: boolean;
}

function computeProfile(person: PersonData): AstroProfile {
  // Calculate accurate Moon sidereal longitude
  const moonLong = getMoonSiderealLongitude(person.dob, person.tob);

  // Rashi from Moon longitude (each rashi = 30°)
  const rashiIndex = Math.floor(moonLong / 30) % 12;
  const rashi = RASHIS[rashiIndex];

  // Nakshatra from Moon longitude (each nakshatra = 13°20' = 13.3333°)
  const nakshatraIndex = Math.floor(moonLong / (360 / 27)) % 27;
  const pada = Math.floor((moonLong % (360 / 27)) / (360 / 108)) + 1; // 4 padas per nakshatra
  const nak = NAKSHATRAS[nakshatraIndex];

  // Lagna calculation
  const lagnaIndex = getLagnaIndex(person.dob, person.tob);
  const lagna = RASHIS[lagnaIndex];

  // Moon degree within rashi
  const degInRashi = moonLong % 30;
  const degStr = `${Math.floor(degInRashi)}°${Math.floor((degInRashi % 1) * 60)}'`;

  // Mangal dosha check: Mars is the lord of Mesha and Vrischika
  // For simplified check, we use rashi-based Mangal dosha rule
  const mangalDoshaRashis = ["मेष", "वृश्चिक", "कर्क", "कन्या", "मकर", "कुंभ"];
  const mangalDosha = mangalDoshaRashis.includes(lagna);

  return {
    rashi,
    rashiIndex,
    nakshatra: nak.name,
    nakshatraIndex,
    nakshatraPada: pada,
    moonDegree: degStr,
    lagna,
    lord: RASHI_LORDS[rashi] || "—",
    element: RASHI_ELEMENT[rashi] || "—",
    varna: RASHI_VARNA[rashi] || "—",
    gana: nak.gana,
    nadi: nak.nadi,
    mangalDosha,
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
      `   राशि: ${result.varProfile.rashi} (${result.varProfile.moonDegree})`,
      `   नक्षत्र: ${result.varProfile.nakshatra} पाद ${result.varProfile.nakshatraPada}`,
      `   लग्न: ${result.varProfile.lagna} | स्वामी: ${result.varProfile.lord}`,
      `   गण: ${result.varProfile.gana} | नाड़ी: ${result.varProfile.nadi}`,
      `   मंगल दोष: ${result.varProfile.mangalDosha ? "हाँ" : "नहीं"}`,
      "",
      `👰 वधु: ${vadhu.name || "—"}`,
      `   राशि: ${result.vadhuProfile.rashi} (${result.vadhuProfile.moonDegree})`,
      `   नक्षत्र: ${result.vadhuProfile.nakshatra} पाद ${result.vadhuProfile.nakshatraPada}`,
      `   लग्न: ${result.vadhuProfile.lagna} | स्वामी: ${result.vadhuProfile.lord}`,
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
            लाहिड़ी अयनांश आधारित सटीक गणना
          </p>
          <p className="devanagari text-white/30 text-xs">
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
                  जन्म समय (IST)
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
                  जन्म समय (IST)
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

        {/* Note about accuracy */}
        <div
          className="rounded-xl p-3 mb-6 text-center"
          style={{
            background: "rgba(245,215,110,0.05)",
            border: "1px solid rgba(245,215,110,0.15)",
          }}
        >
          <p className="devanagari text-white/40 text-xs">
            ⚡ लाहिड़ी अयनांश आधारित सटीक चंद्र राशि गणना | जन्म समय IST में भरें
          </p>
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
              {(
                [
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
                ] as const
              ).map(({ label, profile, name, color, border }) => (
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
                      ["🌙 राशि (जन्म)", profile.rashi],
                      [
                        "⭐ नक्षत्र",
                        `${profile.nakshatra} (पाद ${profile.nakshatraPada})`,
                      ],
                      ["🔭 चंद्र स्थान", profile.moonDegree],
                      ["🏠 लग्न", profile.lagna],
                      ["👑 स्वामी ग्रह", profile.lord],
                      ["🌿 तत्व", profile.element],
                      ["🔱 वर्ण", profile.varna],
                      ["✨ गण", profile.gana],
                      ["💧 नाड़ी", profile.nadi],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="rounded-lg p-2"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      >
                        <div className="devanagari text-white/40 text-xs">
                          {k}
                        </div>
                        <div className="devanagari text-white font-semibold text-xs">
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
                      border: `1px solid ${
                        profile.mangalDosha
                          ? "rgba(239,68,68,0.4)"
                          : "rgba(34,197,94,0.3)"
                      }`,
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
