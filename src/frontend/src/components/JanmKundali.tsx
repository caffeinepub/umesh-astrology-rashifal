import { useState } from "react";

interface Props {
  onBack: () => void;
}

// ─── Math helpers ───────────────────────────────────────────────────────────
function deg2rad(d: number) {
  return (d * Math.PI) / 180;
}
function normalise(d: number): number {
  const r = d % 360;
  return r < 0 ? r + 360 : r;
}
function julianDay(
  year: number,
  month: number,
  day: number,
  hourUT: number,
): number {
  let y = year;
  let mo = month;
  if (mo <= 2) {
    y -= 1;
    mo += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (mo + 1)) +
    day +
    hourUT / 24 +
    B -
    1524.5
  );
}

function lahiriAyanamsha(year: number): number {
  return 23.85 + 0.0136 * (year - 2000);
}

function sunLongitude(JD: number, year: number): number {
  const d = JD - 2451545.0;
  const L = normalise(280.46 + 0.9856474 * d);
  const g = normalise(357.528 + 0.9856003 * d);
  const λ = L + 1.915 * Math.sin(deg2rad(g)) + 0.02 * Math.sin(deg2rad(2 * g));
  return normalise(λ - lahiriAyanamsha(year));
}

function moonLongitude(JD: number, year: number): number {
  const T = (JD - 2451545.0) / 36525;
  const L0 = 218.3164477 + 481267.88123421 * T;
  const M = 357.5291092 + 35999.0502909 * T;
  const Mprime = 134.9633964 + 477198.8675055 * T;
  const D = 297.8501921 + 445267.1114034 * T;
  const F = 93.295 + 483202.0175233 * T;
  let lon =
    L0 +
    6.288774 * Math.sin(deg2rad(Mprime)) +
    1.274027 * Math.sin(deg2rad(2 * D - Mprime)) +
    0.658314 * Math.sin(deg2rad(2 * D)) +
    0.213618 * Math.sin(deg2rad(2 * Mprime)) -
    0.185116 * Math.sin(deg2rad(M)) -
    0.114332 * Math.sin(deg2rad(2 * F)) +
    0.058793 * Math.sin(deg2rad(2 * D - 2 * Mprime)) +
    0.057066 * Math.sin(deg2rad(2 * D - M - Mprime)) +
    0.053322 * Math.sin(deg2rad(2 * D + Mprime)) +
    0.045874 * Math.sin(deg2rad(2 * D - M)) +
    0.041024 * Math.sin(deg2rad(Mprime - M)) -
    0.034718 * Math.sin(deg2rad(D)) -
    0.030465 * Math.sin(deg2rad(M + Mprime)) +
    0.015326 * Math.sin(deg2rad(2 * D - 2 * F)) -
    0.012528 * Math.sin(deg2rad(2 * F + Mprime)) -
    0.01098 * Math.sin(deg2rad(2 * F - Mprime));
  return normalise(lon - lahiriAyanamsha(year));
}

function planetLongitude(
  JD: number,
  year: number,
  L0base: number,
  Lrate: number,
  M0base: number,
  Mrate: number,
  ecc: number,
): number {
  const T = (JD - 2451545.0) / 36525;
  const L = L0base + Lrate * T;
  const M = normalise(M0base + Mrate * T);
  const eoc = (180 / Math.PI) * 2 * ecc * Math.sin(deg2rad(M));
  return normalise(L + eoc - lahiriAyanamsha(year));
}

function rahuLongitude(JD: number, year: number): number {
  const d = JD - 2451545.0;
  return normalise(125.0 - 0.05295 * d - lahiriAyanamsha(year));
}

function lagnaLongitude(JD: number, year: number, hourIST: number): number {
  // Local sidereal time (IST = UTC+5.5)
  const hourUT = hourIST - 5.5;
  const T = (JD - 2451545.0) / 36525;
  const GMST0h = normalise(
    280.46061837 +
      360.98564736629 * (JD - 2451545.0) +
      0.000387933 * T * T -
      (T * T * T) / 38710000,
  );
  const LST = normalise(GMST0h + hourUT * 15);
  const obl = 23.4393 - 0.013 * T;
  // RAMC -> Ascendant ecliptic lon
  const RAMC = deg2rad(LST);
  const e = deg2rad(obl);
  const asc = Math.atan2(Math.cos(RAMC), -(Math.sin(RAMC) * Math.cos(e)));
  let ascDeg = (asc * 180) / Math.PI;
  if (ascDeg < 0) ascDeg += 360;
  return normalise(ascDeg - lahiriAyanamsha(year));
}

// ─── Rashi / Nakshatra helpers ───────────────────────────────────────────────
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
const NAKSHATRA_NAMES = [
  "अश्विनी",
  "भरणी",
  "कृत्तिका",
  "रोहिणी",
  "मृगशिरा",
  "आर्द्रा",
  "पुनर्वसु",
  "पुष्य",
  "आश्लेषा",
  "मघा",
  "पूर्वाफाल्गुनी",
  "उत्तराफाल्गुनी",
  "हस्त",
  "चित्रा",
  "स्वाती",
  "विशाखा",
  "अनुराधा",
  "ज्येष्ठा",
  "मूल",
  "पूर्वाषाढा",
  "उत्तराषाढा",
  "श्रवण",
  "धनिष्ठा",
  "शतभिषा",
  "पूर्वाभाद्रपद",
  "उत्तराभाद्रपद",
  "रेवती",
];
const NAKSHATRA_LORDS = [
  "केतु",
  "शुक्र",
  "सूर्य",
  "चंद्र",
  "मंगल",
  "राहु",
  "गुरु",
  "शनि",
  "बुध",
  "केतु",
  "शुक्र",
  "सूर्य",
  "चंद्र",
  "मंगल",
  "राहु",
  "गुरु",
  "शनि",
  "बुध",
  "केतु",
  "शुक्र",
  "सूर्य",
  "चंद्र",
  "मंगल",
  "राहु",
  "गुरु",
  "शनि",
  "बुध",
];

function rashiFromLon(lon: number) {
  return RASHIS[Math.floor(lon / 30) % 12];
}
function rashiIndexFromLon(lon: number) {
  return Math.floor(lon / 30) % 12;
}
function nakshatraFromLon(lon: number) {
  const idx = Math.floor(lon / (360 / 27)) % 27;
  const pada = Math.floor((lon % (360 / 27)) / (360 / 27 / 4)) + 1;
  return { name: NAKSHATRA_NAMES[idx], lord: NAKSHATRA_LORDS[idx], pada, idx };
}

// ─── Exaltation / Debilitation ───────────────────────────────────────────────
const EXALT: Record<string, number> = {
  सूर्य: 0,
  चंद्र: 1,
  मंगल: 9,
  बुध: 5,
  गुरु: 3,
  शुक्र: 11,
  शनि: 6,
  राहु: 2,
  केतु: 8,
};
const DEBIL: Record<string, number> = {
  सूर्य: 6,
  चंद्र: 7,
  मंगल: 3,
  बुध: 11,
  गुरु: 9,
  शुक्र: 5,
  शनि: 0,
  राहु: 8,
  केतु: 2,
};
const OWN: Record<string, number[]> = {
  सूर्य: [4],
  चंद्र: [3],
  मंगल: [0, 7],
  बुध: [2, 5],
  गुरु: [8, 11],
  शुक्र: [1, 6],
  शनि: [9, 10],
};
function grahaStatus(name: string, rashiIdx: number): string {
  if (EXALT[name] === rashiIdx) return "उच्च";
  if (DEBIL[name] === rashiIdx) return "नीच";
  if (OWN[name]?.includes(rashiIdx)) return "स्वगृह";
  return "-";
}

// ─── Vimshottari Dasha ───────────────────────────────────────────────────────
const DASHA_LORDS = [
  "केतु",
  "शुक्र",
  "सूर्य",
  "चंद्र",
  "मंगल",
  "राहु",
  "गुरु",
  "शनि",
  "बुध",
];
const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17];
const DASHA_COLORS: Record<string, string> = {
  केतु: "#9b59b6",
  शुक्र: "#e91e63",
  सूर्य: "#ff9800",
  चंद्र: "#42a5f5",
  मंगल: "#f44336",
  राहु: "#607d8b",
  गुरु: "#ffc107",
  शनि: "#78909c",
  बुध: "#4caf50",
};

function dateAddYears(d: Date, years: number): Date {
  const r = new Date(d);
  r.setFullYear(r.getFullYear() + Math.floor(years));
  const fracDays = (years - Math.floor(years)) * 365.25;
  r.setDate(r.getDate() + Math.round(fracDays));
  return r;
}
function formatDate(d: Date): string {
  return d.toLocaleDateString("hi-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface DashaPeriod {
  lord: string;
  start: Date;
  end: Date;
  antardasha: {
    lord: string;
    start: Date;
    end: Date;
    pratyantar: { lord: string; start: Date; end: Date }[];
  }[];
}

function calcVimshottariDasha(moonLon: number, birthDate: Date): DashaPeriod[] {
  const nakshatraSpan = 360 / 27;
  const nakshatraIdx = Math.floor(moonLon / nakshatraSpan) % 27;
  const degWithinNakshatra = moonLon % nakshatraSpan;
  const progressedFraction = degWithinNakshatra / nakshatraSpan;

  // Which dasha lord does this nakshatra belong to?
  const lordName = NAKSHATRA_LORDS[nakshatraIdx];
  const lordIndex = DASHA_LORDS.indexOf(lordName);

  const balance = (1 - progressedFraction) * DASHA_YEARS[lordIndex];

  const periods: DashaPeriod[] = [];
  let cursor = new Date(birthDate);

  for (let i = 0; i < 9; i++) {
    const li = (lordIndex + i) % 9;
    const lord = DASHA_LORDS[li];
    const yrs = i === 0 ? balance : DASHA_YEARS[li];
    const end = dateAddYears(cursor, yrs);

    // Antardasha
    const ad: {
      lord: string;
      start: Date;
      end: Date;
      pratyantar: { lord: string; start: Date; end: Date }[];
    }[] = [];
    let adCursor = new Date(cursor);
    for (let j = 0; j < 9; j++) {
      const ali = (li + j) % 9;
      const adLord = DASHA_LORDS[ali];
      const adYrs = (yrs * DASHA_YEARS[ali]) / 120;
      const adEnd = dateAddYears(adCursor, adYrs);
      // Pratyantar dasha
      const pratyantar: { lord: string; start: Date; end: Date }[] = [];
      let ptCursor = new Date(adCursor);
      for (let k = 0; k < 9; k++) {
        const pli = (ali + k) % 9;
        const ptLord = DASHA_LORDS[pli];
        const ptYrs = (adYrs * DASHA_YEARS[pli]) / 120;
        const ptEnd = dateAddYears(ptCursor, ptYrs);
        pratyantar.push({
          lord: ptLord,
          start: new Date(ptCursor),
          end: ptEnd,
        });
        ptCursor = ptEnd;
      }
      ad.push({
        lord: adLord,
        start: new Date(adCursor),
        end: adEnd,
        pratyantar,
      });
      adCursor = adEnd;
    }

    periods.push({ lord, start: new Date(cursor), end, antardasha: ad });
    cursor = end;
  }
  return periods;
}

function findCurrentDasha(
  periods: DashaPeriod[],
  today: Date,
): { mahaIdx: number; antarIdx: number } {
  let mahaIdx = 0;
  for (let i = 0; i < periods.length; i++) {
    if (today >= periods[i].start && today < periods[i].end) {
      mahaIdx = i;
      break;
    }
    if (i === periods.length - 1) mahaIdx = i;
  }
  const ad = periods[mahaIdx].antardasha;
  let antarIdx = 0;
  for (let j = 0; j < ad.length; j++) {
    if (today >= ad[j].start && today < ad[j].end) {
      antarIdx = j;
      break;
    }
    if (j === ad.length - 1) antarIdx = j;
  }
  return { mahaIdx, antarIdx };
}

function findCurrentPratyantar(
  periods: DashaPeriod[],
  mahaIdx: number,
  antarIdx: number,
  today: Date,
): number {
  const pt = periods[mahaIdx].antardasha[antarIdx].pratyantar;
  for (let k = 0; k < pt.length; k++) {
    if (today >= pt[k].start && today < pt[k].end) return k;
    if (k === pt.length - 1) return k;
  }
  return 0;
}

// ─── Dasha Phala ─────────────────────────────────────────────────────────────
const MAHADASHA_PHALA: Record<string, string> = {
  सूर्य: "सूर्य महादशा में जातक को राज्य, सरकार, पिता और अधिकारियों से लाभ मिलता है। आत्मविश्वास, मान-प्रतिष्ठा और नेतृत्व क्षमता में वृद्धि होती है। स्वास्थ्य, नेत्र और हृदय पर ध्यान रखना आवश्यक है। उच्च अधिकारियों और सरकारी कार्यों में सफलता मिलती है।",
  चंद्र: "चंद्र महादशा में मन, माता, जल, यात्रा और व्यापार से संबंधित कार्यों में प्रगति होती है। भावनात्मक जीवन सक्रिय रहता है। धन-संपत्ति में वृद्धि, विदेश यात्रा और जनसंपर्क में लाभ मिलता है। स्वास्थ्य में चंद्र दोष के कारण मन की अस्थिरता हो सकती है।",
  मंगल: "मंगल महादशा में साहस, पराक्रम, भूमि, भवन और भाई-बहनों से संबंधित मामलों में उन्नति होती है। ऊर्जा और उत्साह उच्च रहता है। सेना, पुलिस, चिकित्सा और तकनीकी क्षेत्र में सफलता मिलती है। क्रोध पर नियंत्रण और दुर्घटनाओं से सावधानी आवश्यक है।",
  राहु: "राहु महादशा में अचानक परिवर्तन, विदेश यात्रा, तकनीक, और अपरंपरागत क्षेत्रों में सफलता मिलती है। भौतिक उन्नति तीव्र गति से होती है। राजनीति, व्यापार और विदेशी संबंधों में लाभ। मायावी परिस्थितियों और धोखे से सावधान रहें।",
  गुरु: "गुरु महादशा जातक के जीवन की सर्वोत्तम अवधियों में से एक होती है। ज्ञान, धर्म, संतान, विवाह और धन में अभूतपूर्व वृद्धि होती है। गुरुजनों का आशीर्वाद प्राप्त होता है। शिक्षा, अध्यात्म और न्याय के क्षेत्र में उत्कृष्ट परिणाम मिलते हैं।",
  शनि: "शनि महादशा में कठिन परिश्रम, धैर्य और अनुशासन से सफलता मिलती है। करियर में स्थिरता आती है परंतु विलंब होता है। न्याय, सेवा, कृषि और खनन क्षेत्र में प्रगति। स्वास्थ्य, हड्डी और वात रोगों पर ध्यान दें। कर्म और सत्य के मार्ग पर चलना लाभकारी है।",
  बुध: "बुध महादशा में बुद्धि, वाणिज्य, लेखन, संचार और व्यापार में असाधारण उन्नति होती है। शिक्षा, विज्ञान, तकनीक और मीडिया में सफलता मिलती है। वाणी और विवेक का सदुपयोग करें। त्वचा और नर्वस सिस्टम पर ध्यान दें।",
  केतु: "केतु महादशा में आध्यात्मिक उन्नति, वैराग्य और मोक्ष की ओर रुझान बढ़ता है। तांत्रिक विद्या, ज्योतिष और रहस्यमय विद्याओं में रुचि जागती है। अचानक लाभ-हानि दोनों संभव। पूर्व जन्म के कर्मों का फल मिलता है। विदेश यात्रा और संन्यास के योग बनते हैं।",
  शुक्र: "शुक्र महादशा सुख, सौंदर्य, प्रेम, विवाह, कला और भौतिक समृद्धि की महादशा है। वाहन, आभूषण, विलास सामग्री और धन में वृद्धि होती है। कला, संगीत, फिल्म और फैशन में सफलता। प्रेम संबंध और वैवाहिक जीवन सुखमय रहता है। गुर्दे और प्रजनन स्वास्थ्य पर ध्यान दें।",
};

const ANTARDASHA_PHALA: Record<string, Record<string, string>> = {
  सूर्य: {
    सूर्य: "सूर्य-सूर्य: आत्मविश्वास और नेतृत्व शक्ति बढ़ेगी। सरकारी कार्यों में सफलता। पिता और वरिष्ठों से लाभ। स्वास्थ्य में सतर्कता आवश्यक।",
    चंद्र: "सूर्य-चंद्र: मन और आत्मा में द्वंद्व। माता से संबंध सुधरेंगे। गृह जीवन में शांति। यात्राएं लाभकारी। भावनात्मक स्थिरता आएगी।",
    मंगल: "सूर्य-मंगल: साहस और पराक्रम में वृद्धि। भूमि-भवन के विवाद सुलझेंगे। सेना/पुलिस में सफलता। दुर्घटना से सावधानी रखें।",
    राहु: "सूर्य-राहु: अचानक बदलाव आएंगे। विदेश से संपर्क बढ़ेगा। स्वास्थ्य पर ध्यान दें। भ्रम और धोखे से बचें। राजनीति में उतार-चढ़ाव।",
    गुरु: "सूर्य-गुरु: यह अत्यंत शुभ अंतर्दशा है। पद-प्रतिष्ठा में वृद्धि। संतान सुख। धार्मिक कार्यों में रुचि। गुरुजनों का आशीर्वाद।",
    शनि: "सूर्य-शनि: कठिनाइयां आएंगी परंतु मेहनत सफल होगी। पिता से मतभेद संभव। सरकारी कार्यों में विलंब। धैर्य रखें।",
    बुध: "सूर्य-बुध: बुद्धि और वाणी का लाभ मिलेगा। व्यापार में वृद्धि। शिक्षा में सफलता। लेखन और मीडिया से लाभ।",
    केतु: "सूर्य-केतु: आध्यात्मिक रुझान बढ़ेगा। अचानक परिवर्तन। तीर्थ यात्रा की संभावना। स्वास्थ्य में सावधानी।",
    शुक्र: "सूर्य-शुक्र: प्रेम और रोमांस में वृद्धि। कला में रुचि। धन और विलास में सुख। विवाहित जीवन सुखमय।",
  },
  चंद्र: {
    सूर्य: "चंद्र-सूर्य: मान-प्रतिष्ठा बढ़ेगी। सरकार से सहयोग। पिता का आशीर्वाद। आत्मविश्वास में वृद्धि।",
    चंद्र: "चंद्र-चंद्र: भावनात्मक जीवन सक्रिय। माता से विशेष लाभ। जल यात्राएं शुभ। व्यापार में उन्नति। मन प्रसन्न रहेगा।",
    मंगल: "चंद्र-मंगल: भूमि और संपत्ति से लाभ। साहसी कार्यों में सफलता। परिवार में उत्साह। जल्दबाजी से बचें।",
    राहु: "चंद्र-राहु: मन में अस्थिरता। विदेश यात्रा संभव। मायावी परिस्थितियां। माता के स्वास्थ्य पर ध्यान दें।",
    गुरु: "चंद्र-गुरु: अत्यंत शुभ काल। धन-संपत्ति में वृद्धि। संतान सुख। धार्मिक कार्यों में रुचि। मन प्रसन्न।",
    शनि: "चंद्र-शनि: मन में उदासी संभव। कठिन परिश्रम आवश्यक। विलंब से सफलता। माता के स्वास्थ्य की देखभाल करें।",
    बुध: "चंद्र-बुध: बौद्धिक कार्यों में सफलता। व्यापार में वृद्धि। संचार कौशल उत्तम। विद्यार्थियों के लिए शुभ।",
    केतु: "चंद्र-केतु: मानसिक उलझन संभव। आध्यात्मिक रुझान बढ़ेगा। तीर्थ यात्रा शुभ। स्वप्न विचित्र आएंगे।",
    शुक्र: "चंद्र-शुक्र: सुख-समृद्धि का काल। प्रेम जीवन सुखमय। कला और संगीत में आनंद। वाहन-सुख की प्राप्ति।",
  },
  मंगल: {
    सूर्य: "मंगल-सूर्य: राज्य और सरकार से सहायता। नेतृत्व में वृद्धि। भूमि-भवन के कार्य सफल। क्रोध पर नियंत्रण रखें।",
    चंद्र: "मंगल-चंद्र: माता से लाभ। व्यापार में वृद्धि। भावनात्मक उतार-चढ़ाव। यात्राएं लाभकारी।",
    मंगल: "मंगल-मंगल: साहस और ऊर्जा का उच्चतम काल। भूमि-भवन में लाभ। खेल और प्रतियोगिता में विजय। दुर्घटना से सावधान।",
    राहु: "मंगल-राहु: अत्यंत सावधानी का काल। विवाद और कानूनी झमेले। विदेश से संबंध। स्वास्थ्य पर विशेष ध्यान।",
    गुरु: "मंगल-गुरु: शुभ काल। धार्मिक कार्यों में रुचि। भूमि-भवन से लाभ। भाई-बहनों का सहयोग।",
    शनि: "मंगल-शनि: बाधाएं आएंगी। मेहनत आवश्यक। भूमि विवाद संभव। स्वास्थ्य पर ध्यान दें।",
    बुध: "मंगल-बुध: व्यापार और तकनीक में सफलता। बुद्धि और साहस का समन्वय। शिक्षा में उन्नति।",
    केतु: "मंगल-केतु: आध्यात्मिक जागरण। तांत्रिक रुचि। चोट-दुर्घटना से सावधान। अचानक परिवर्तन।",
    शुक्र: "मंगल-शुक्र: प्रेम और रोमांस। विवाह के योग। धन-समृद्धि। कला में रुचि बढ़ेगी।",
  },
  राहु: {
    सूर्य: "राहु-सूर्य: पिता-पुत्र संबंध में तनाव। सरकारी कार्यों में बाधा। विदेश से लाभ। स्वास्थ्य सावधानी आवश्यक।",
    चंद्र: "राहु-चंद्र: मानसिक अशांति। माता के स्वास्थ्य पर ध्यान दें। विदेश यात्रा। भ्रम से बचें।",
    मंगल: "राहु-मंगल: दुर्घटना और विवाद से सावधान। अचानक धन लाभ संभव। साहसी कदम उठाने से बचें।",
    राहु: "राहु-राहु: बड़े परिवर्तनों का काल। विदेश में सफलता। अपरंपरागत कार्यों से लाभ। धोखे से बचें।",
    गुरु: "राहु-गुरु: भौतिक उन्नति के साथ आध्यात्मिक ज्ञान। गुरु कृपा से बाधाएं दूर। धर्म में आस्था।",
    शनि: "राहु-शनि: अत्यंत कठिन काल। न्याय और कर्म पर ध्यान। विलंब से सफलता। धैर्य और संयम आवश्यक।",
    बुध: "राहु-बुध: व्यापार में चतुराई। तकनीक से लाभ। वाद-विवाद से बचें। बौद्धिक कार्यों में सफलता।",
    केतु: "राहु-केतु: मानसिक उथल-पुथल। आध्यात्मिक उन्नति। अचानक बदलाव। पूर्व कर्मों का फल।",
    शुक्र: "राहु-शुक्र: भौतिक सुख-समृद्धि। विदेशी संपर्क से लाभ। विलास में वृद्धि। प्रेम जीवन में उतार-चढ़ाव।",
  },
  गुरु: {
    सूर्य: "गुरु-सूर्य: पद और प्रतिष्ठा में अभूतपूर्व वृद्धि। सरकारी सम्मान। पिता से विशेष आशीर्वाद। अत्यंत शुभ काल।",
    चंद्र: "गुरु-चंद्र: मन में शांति और प्रसन्नता। माता से लाभ। विद्या में वृद्धि। व्यापार में उन्नति।",
    मंगल: "गुरु-मंगल: साहसी कार्यों में विजय। भूमि-भवन से लाभ। भाइयों का सहयोग। धार्मिक यात्राएं।",
    राहु: "गुरु-राहु: ज्ञान और भौतिकता का द्वंद्व। विदेश से लाभ। गुरु की कृपा से बाधाएं दूर। सावधानी रखें।",
    गुरु: "गुरु-गुरु: जीवन का स्वर्णिम काल। संतान सुख। विवाह के योग। धन-समृद्धि। ज्ञान और यश में वृद्धि।",
    शनि: "गुरु-शनि: कठिन परिश्रम से सफलता। न्याय और धर्म का मार्ग। करियर में स्थिरता। धीरे-धीरे उन्नति।",
    बुध: "गुरु-बुध: बौद्धिक विकास। शिक्षा में उत्कृष्ट सफलता। व्यापार में वृद्धि। वाणी और लेखन से लाभ।",
    केतु: "गुरु-केतु: आध्यात्मिक उन्नति का विशेष काल। मोक्ष की ओर रुझान। तीर्थ यात्राएं। ज्ञान का विस्तार।",
    शुक्र: "गुरु-शुक्र: सुख, सौंदर्य और समृद्धि। विवाह के उत्तम योग। कला में प्रसिद्धि। वाहन-भवन सुख।",
  },
  शनि: {
    सूर्य: "शनि-सूर्य: पिता और सरकार से संघर्ष। कठिन परिश्रम आवश्यक। विलंब से सफलता। स्वास्थ्य सावधानी।",
    चंद्र: "शनि-चंद्र: मानसिक कठिनाइयां। माता के स्वास्थ्य की देखभाल। उदासी संभव। ध्यान और योग से लाभ।",
    मंगल: "शनि-मंगल: कठिन और बाधाओं का काल। विवाद-मुकदमे से बचें। दुर्घटना से सावधान। संयम रखें।",
    राहु: "शनि-राहु: अत्यंत कठिन काल। हर कदम सोच-समझकर रखें। कर्म और सत्य पर टिके रहें। परेशानियां अस्थायी हैं।",
    गुरु: "शनि-गुरु: गुरु कृपा से कठिनाइयां कम होंगी। धर्म-कर्म से सहायता। करियर में धीरे-धीरे उन्नति।",
    शनि: "शनि-शनि: कठिन परिश्रम और अनुशासन का काल। न्याय से कार्य करें। दीर्घकालिक स्थिरता मिलेगी। धैर्य रखें।",
    बुध: "शनि-बुध: बुद्धि और विवेक से काम लें। व्यापार में सावधानी। लेखन और अनुसंधान में सफलता।",
    केतु: "शनि-केतु: आध्यात्मिक रुझान। पूर्व कर्मों का लेखा-जोखा। त्याग और सेवा से लाभ।",
    शुक्र: "शनि-शुक्र: भौतिक सुखों में कमी संभव। विवाह में बाधाएं। कला में सफलता। धीरे-धीरे सुख मिलेगा।",
  },
  बुध: {
    सूर्य: "बुध-सूर्य: बौद्धिक नेतृत्व। सरकारी कार्यों में सफलता। लेखन और वाणी से प्रतिष्ठा। शिक्षा में उन्नति।",
    चंद्र: "बुध-चंद्र: मन और बुद्धि का समन्वय। व्यापार में वृद्धि। माता का सहयोग। भावनात्मक संतुलन।",
    मंगल: "बुध-मंगल: तकनीकी क्षेत्र में सफलता। साहस और बुद्धि का उपयोग। विवादों से बचें। ऊर्जावान काल।",
    राहु: "बुध-राहु: चतुराई से काम लें। तकनीक और इंटरनेट से लाभ। धोखे से सावधान। विदेशी संबंध।",
    गुरु: "बुध-गुरु: ज्ञान और विद्या का उत्तम काल। शिक्षा में विशेष सफलता। गुरु का मार्गदर्शन। आध्यात्मिक ज्ञान।",
    शनि: "बुध-शनि: कठिन परिश्रम से सफलता। अनुसंधान में उन्नति। व्यापार में विलंब। धैर्य आवश्यक।",
    बुध: "बुध-बुध: बुद्धि का सर्वोच्च काल। व्यापार, लेखन और संचार में असाधारण सफलता। शिक्षा में उत्कृष्टता।",
    केतु: "बुध-केतु: रहस्यमय ज्ञान में रुचि। ज्योतिष और तंत्र-मंत्र। बौद्धिक भटकाव से बचें।",
    शुक्र: "बुध-शुक्र: कला और व्यापार में लाभ। वाणी से आकर्षण। संचार और सौंदर्य क्षेत्र में सफलता।",
  },
  केतु: {
    सूर्य: "केतु-सूर्य: आत्म-विश्लेषण का काल। सरकारी बाधाएं। पिता से अलगाव संभव। आध्यात्मिक उन्नति।",
    चंद्र: "केतु-चंद्र: मन में उलझन। माता की सेहत पर ध्यान। अंतर्मुखी होने का काल। ध्यान से लाभ।",
    मंगल: "केतु-मंगल: अचानक घटनाएं। साहसी कार्यों में सावधानी। आग और धातु से सावधान। आध्यात्मिक साधना शुभ।",
    राहु: "केतु-राहु: भारी उथल-पुथल। पूर्व कर्मों का विशेष फल। अचानक परिवर्तन। त्याग से लाभ।",
    गुरु: "केतु-गुरु: आध्यात्मिक गुरु की प्राप्ति। मोक्ष मार्ग पर चलने का समय। धर्म से विशेष लाभ।",
    शनि: "केतु-शनि: वैराग्य और त्याग का काल। सांसारिक कठिनाइयां। सेवा कार्य से मन की शांति।",
    बुध: "केतु-बुध: बुद्धि में विरोधाभास। ज्योतिष और रहस्य विद्या में रुचि। व्यापार में सावधानी।",
    केतु: "केतु-केतु: पूर्ण वैराग्य का काल। आत्म-साक्षात्कार। तीर्थ यात्रा अत्यंत शुभ। सांसारिक सुखों से विरक्ति।",
    शुक्र: "केतु-शुक्र: भौतिक सुखों में रुचि कम। प्रेम में निराशा संभव। कला और संगीत से आत्मिक सुख।",
  },
  शुक्र: {
    सूर्य: "शुक्र-सूर्य: पद-प्रतिष्ठा के साथ भौतिक सुख। कला और नेतृत्व का संगम। विवाहित जीवन में उत्साह।",
    चंद्र: "शुक्र-चंद्र: भावनात्मक सुख। माता से लाभ। विलास और कला में आनंद। प्रेम जीवन सुखमय।",
    मंगल: "शुक्र-मंगल: प्रेम में जुनून। विवाह के तीव्र योग। भूमि और वाहन से लाभ। अहंकार से बचें।",
    राहु: "शुक्र-राहु: विदेशी संपर्क से धन लाभ। प्रेम जीवन में भ्रम। भौतिक सुखों की अति से बचें।",
    गुरु: "शुक्र-गुरु: जीवन का अत्यंत सुखमय काल। विवाह, संतान और धन की प्राप्ति। देवी कृपा।",
    शनि: "शुक्र-शनि: सौंदर्य और कठोरता का मेल। करियर में स्थिरता। विलंब से सुख। कला में गहराई।",
    बुध: "शुक्र-बुध: कला और व्यापार में विशेष सफलता। लेखन से प्रसिद्धि। संचार कौशल से लाभ।",
    केतु: "शुक्र-केतु: भौतिक सुखों में संयम। आध्यात्मिक कला में रुचि। रहस्यमय प्रेम का अनुभव।",
    शुक्र: "शुक्र-शुक्र: जीवन का सर्वाधिक सुखमय और समृद्ध काल। प्रेम, विवाह, धन और कला सभी में शिखर। देवी लक्ष्मी की विशेष कृपा।",
  },
};

const PRATYANTAR_PHALA: Record<string, string> = {
  सूर्य: "सूर्य पर्यन्तर: आत्मबल, यश और सरकारी कार्यों में सफलता। पिता और अधिकारियों का सहयोग।",
  चंद्र: "चंद्र पर्यन्तर: मन में प्रसन्नता, माता का सहयोग। यात्राएं और व्यापार में लाभ।",
  मंगल: "मंगल पर्यन्तर: साहस और उत्साह में वृद्धि। भूमि-भवन कार्यों में सफलता। क्रोध से बचें।",
  राहु: "राहु पर्यन्तर: अचानक परिवर्तन। विदेशी संबंध। भ्रम और धोखे से सावधान रहें।",
  गुरु: "गुरु पर्यन्तर: ज्ञान और आशीर्वाद की प्राप्ति। धार्मिक कार्यों में शुभता। संतान सुख।",
  शनि: "शनि पर्यन्तर: कठोर परिश्रम आवश्यक। धैर्य से कार्य करें। न्याय और सत्य का पालन करें।",
  बुध: "बुध पर्यन्तर: बुद्धि और वाणी का लाभ। व्यापार और संचार में उन्नति। शिक्षा में सफलता।",
  केतु: "केतु पर्यन्तर: आध्यात्मिक रुझान। अचानक घटनाएं। ध्यान और साधना से मन की शांति।",
  शुक्र: "शुक्र पर्यन्तर: सुख, सौंदर्य और प्रेम में वृद्धि। कला और भौतिक समृद्धि का आनंद।",
};

// ─── getDashaPhala ────────────────────────────────────────────────────────────
const HOUSE_SUFFIX: Record<number, string> = {
  1: "लग्न में होने से स्वास्थ्य और व्यक्तित्व पर प्रभाव पड़ेगा।",
  2: "द्वितीय भाव में होने से धन और परिवार पर विशेष प्रभाव।",
  3: "तृतीय भाव में होने से साहस और भाई-बहन के मामलों पर प्रभाव।",
  4: "चतुर्थ भाव में होने से माता, घर और सुख पर प्रभाव।",
  5: "पंचम भाव में होने से संतान, बुद्धि और प्रेम पर प्रभाव।",
  6: "षष्ठ भाव में होने से शत्रु, रोग और सेवा पर प्रभाव।",
  7: "सप्तम भाव में होने से विवाह और साझेदारी पर प्रभाव।",
  8: "अष्टम भाव में होने से आयु, उत्तराधिकार और रहस्य पर प्रभाव।",
  9: "नवम भाव में होने से भाग्य, धर्म और पिता पर विशेष प्रभाव।",
  10: "दशम भाव में होने से करियर और राज्य पर अत्यंत अनुकूल प्रभाव।",
  11: "एकादश भाव में होने से लाभ और मित्रों से विशेष फल।",
  12: "द्वादश भाव में होने से खर्च, विदेश और मोक्ष पर प्रभाव।",
};

function getDashaPhala(
  lord: string,
  type: "maha" | "antar" | "pratyantar",
  mahaLord: string,
  antarLord: string,
  grahas: GrahaData[],
): string {
  const graha = grahas.find((g) => g.name === lord);
  let base = "";
  if (type === "maha") base = MAHADASHA_PHALA[lord] || "फलादेश उपलब्ध नहीं है।";
  else if (type === "antar")
    base = ANTARDASHA_PHALA[mahaLord]?.[antarLord] || "फलादेश उपलब्ध नहीं है।";
  else base = PRATYANTAR_PHALA[lord] || "फलादेश उपलब्ध नहीं है।";

  if (!graha) return base;

  let prefix = "";
  if (graha.status === "उच्च") {
    prefix = "यह ग्रह उच्च राशि में होने से फल अत्यंत शुभ और बलवान होगा — ";
  } else if (graha.status === "नीच") {
    prefix = "यह ग्रह नीच राशि में है, फल में कुछ बाधाएं आ सकती हैं — ";
  } else if (graha.status === "स्वगृह") {
    prefix = "यह ग्रह अपनी राशि में होने से उत्तम फल देगा — ";
  }

  const suffix = graha.house ? ` ${HOUSE_SUFFIX[graha.house] || ""}` : "";
  return prefix + base + suffix;
}

function getGrahaBadgeText(lord: string, grahas: GrahaData[]): string | null {
  const graha = grahas.find((g) => g.name === lord);
  if (!graha) return null;
  const statusPart =
    graha.status && graha.status !== "-" ? ` • ${graha.status}` : "";
  return `${graha.name} • ${graha.rashi} • भाव ${graha.house}${statusPart}`;
}

// ─── Remedies ────────────────────────────────────────────────────────────────
const REMEDIES: Record<
  string,
  {
    mantra: string;
    count: string;
    gemstone: string;
    charity: string;
    fast: string;
    color: string;
    deity: string;
    rudraksha: string;
  }
> = {
  सूर्य: {
    mantra: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
    count: "१०८ बार रविवार को",
    gemstone: "माणिक (Ruby)",
    charity: "रविवार को गेहूं, गुड़, तांबा दान करें",
    fast: "रविवार",
    color: "लाल",
    deity: "भगवान सूर्य देव",
    rudraksha: "१ मुखी रुद्राक्ष",
  },
  चंद्र: {
    mantra: "ॐ श्रां श्रीं श्रौं सः चंद्राय नमः",
    count: "१०८ बार सोमवार को",
    gemstone: "मोती (Pearl)",
    charity: "सोमवार को चावल, दूध, चांदी दान",
    fast: "सोमवार",
    color: "सफेद",
    deity: "भगवान शिव",
    rudraksha: "२ मुखी रुद्राक्ष",
  },
  मंगल: {
    mantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    count: "१०८ बार मंगलवार को",
    gemstone: "मूंगा (Red Coral)",
    charity: "मंगलवार को मसूर, लाल वस्त्र दान",
    fast: "मंगलवार",
    color: "लाल",
    deity: "हनुमान जी",
    rudraksha: "३ मुखी रुद्राक्ष",
  },
  बुध: {
    mantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
    count: "१०८ बार बुधवार को",
    gemstone: "पन्ना (Emerald)",
    charity: "बुधवार को हरी मूंग, हरे वस्त्र दान",
    fast: "बुधवार",
    color: "हरा",
    deity: "गणेश जी",
    rudraksha: "४ मुखी रुद्राक्ष",
  },
  गुरु: {
    mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    count: "१०८ बार गुरुवार को",
    gemstone: "पुखराज (Yellow Sapphire)",
    charity: "गुरुवार को चने की दाल, पीले वस्त्र दान",
    fast: "गुरुवार",
    color: "पीला",
    deity: "बृहस्पति देव",
    rudraksha: "५ मुखी रुद्राक्ष",
  },
  शुक्र: {
    mantra: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
    count: "१०८ बार शुक्रवार को",
    gemstone: "हीरा (Diamond) या ओपल",
    charity: "शुक्रवार को चावल, सफेद वस्त्र, दही दान",
    fast: "शुक्रवार",
    color: "सफेद/गुलाबी",
    deity: "माँ लक्ष्मी",
    rudraksha: "६ मुखी रुद्राक्ष",
  },
  शनि: {
    mantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
    count: "१०८ बार शनिवार को",
    gemstone: "नीलम (Blue Sapphire) — ज्योतिषी से परामर्श के बाद",
    charity: "शनिवार को उड़द, सरसों का तेल, काले वस्त्र दान",
    fast: "शनिवार",
    color: "काला/नीला",
    deity: "शनि देव / हनुमान जी",
    rudraksha: "७ मुखी रुद्राक्ष",
  },
  राहु: {
    mantra: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः",
    count: "१०८ बार शनिवार को",
    gemstone: "गोमेद (Hessonite Garnet)",
    charity: "शनिवार को सरसों, नारियल दान",
    fast: "शनिवार",
    color: "धूमिल/धुंधला",
    deity: "भैरव जी",
    rudraksha: "८ मुखी रुद्राक्ष",
  },
  केतु: {
    mantra: "ॐ स्त्रां स्त्रीं स्त्रौं सः केतवे नमः",
    count: "१०८ बार मंगलवार को",
    gemstone: "लहसुनिया (Cat's Eye)",
    charity: "मंगलवार को तिल, कंबल दान",
    fast: "मंगलवार",
    color: "धूसर",
    deity: "गणेश जी / चित्रगुप्त",
    rudraksha: "९ मुखी रुद्राक्ष",
  },
};

const GRAHA_ABBR: Record<string, string> = {
  सूर्य: "सू",
  चंद्र: "च",
  मंगल: "मं",
  बुध: "बु",
  गुरु: "गु",
  शुक्र: "शु",
  शनि: "श",
  राहु: "रा",
  केतु: "के",
};

// ─── Kundali data type ───────────────────────────────────────────────────────
interface GrahaData {
  name: string;
  lon: number;
  rashi: string;
  rashiIdx: number;
  nakshatra: string;
  nakshatraLord: string;
  status: string;
  house: number;
}

interface KundaliData {
  name: string;
  dateStr: string;
  timeStr: string;
  city: string;
  lagna: string;
  lagnaIdx: number;
  chandraRashi: string;
  nakshatra: string;
  nakshatraPada: number;
  grahas: GrahaData[];
  dashas: DashaPeriod[];
  currentMaha: number;
  currentAntar: number;
  currentPratyantar: number;
}

function computeKundali(
  name: string,
  day: number,
  month: number,
  year: number,
  hour: number,
  minute: number,
  city: string,
): KundaliData {
  const hourIST = hour + minute / 60;
  const hourUT = hourIST - 5.5;
  const JD = julianDay(year, month, day, hourUT);

  const sunLon = sunLongitude(JD, year);
  const moonLon = moonLongitude(JD, year);
  const marsLon = planetLongitude(
    JD,
    year,
    355.433275,
    19140.9296648,
    319.994,
    19139.8585,
    0.0935,
  );
  const mercLon = planetLongitude(
    JD,
    year,
    252.250906,
    149472.6746358,
    174.7948,
    149472.515,
    0.2056,
  );
  const jupLon = planetLongitude(
    JD,
    year,
    34.351519,
    3034.9056606,
    20.9,
    3034.6,
    0.0489,
  );
  const venLon = planetLongitude(
    JD,
    year,
    181.979801,
    58517.815676,
    50.416,
    58517.8,
    0.0067,
  );
  const satLon = planetLongitude(
    JD,
    year,
    50.077444,
    1222.1138488,
    317.0207,
    1221.55,
    0.0565,
  );
  const rahuLon = rahuLongitude(JD, year);
  const ketuLon = normalise(rahuLon + 180);
  const lagnaLon = lagnaLongitude(JD, year, hourIST);

  const lagnaIdx = rashiIndexFromLon(lagnaLon);

  function house(lon: number): number {
    return ((rashiIndexFromLon(lon) - lagnaIdx + 12) % 12) + 1;
  }

  const moonNak = nakshatraFromLon(moonLon);
  const chandraRashi = rashiFromLon(moonLon);

  const rawGrahas: [string, number][] = [
    ["सूर्य", sunLon],
    ["चंद्र", moonLon],
    ["मंगल", marsLon],
    ["बुध", mercLon],
    ["गुरु", jupLon],
    ["शुक्र", venLon],
    ["शनि", satLon],
    ["राहु", rahuLon],
    ["केतु", ketuLon],
  ];
  const grahas: GrahaData[] = rawGrahas.map(([gname, lon]) => {
    const ri = rashiIndexFromLon(lon);
    const nak = nakshatraFromLon(lon);
    return {
      name: gname,
      lon,
      rashi: RASHIS[ri],
      rashiIdx: ri,
      nakshatra: nak.name,
      nakshatraLord: nak.lord,
      status: grahaStatus(gname, ri),
      house: house(lon),
    };
  });

  const birthDate = new Date(year, month - 1, day, hour, minute);
  const dashas = calcVimshottariDasha(moonLon, birthDate);
  const today = new Date();
  const { mahaIdx, antarIdx } = findCurrentDasha(dashas, today);

  const currentPratyantar = findCurrentPratyantar(
    dashas,
    mahaIdx,
    antarIdx,
    today,
  );

  return {
    name,
    dateStr: `${day}/${month}/${year}`,
    timeStr: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    city,
    lagna: RASHIS[lagnaIdx],
    lagnaIdx,
    chandraRashi,
    nakshatra: moonNak.name,
    nakshatraPada: moonNak.pada,
    grahas,
    dashas,
    currentMaha: mahaIdx,
    currentAntar: antarIdx,
    currentPratyantar,
  };
}

// ─── Remedy Card ─────────────────────────────────────────────────────────────
function RemedyCard({
  lord,
  title,
}: {
  lord: string;
  title: string;
}) {
  const r = REMEDIES[lord];
  const color = DASHA_COLORS[lord] || "#f5d76e";
  if (!r) return null;
  return (
    <div
      className="rounded-2xl p-4 mb-4"
      style={{
        background: "rgba(5,8,30,0.8)",
        border: `1px solid ${color}50`,
        boxShadow: `0 0 18px ${color}20`,
      }}
    >
      <h4 className="devanagari font-bold text-base mb-3" style={{ color }}>
        {title} — {lord} दशा उपाय
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {(
          [
            ["🕉️ मंत्र", r.mantra],
            ["📿 संख्या", r.count],
            ["💎 रत्न", r.gemstone],
            ["🙏 दान", r.charity],
            ["🌙 व्रत", r.fast],
            ["🎨 रंग", r.color],
            ["🛕 देवता", r.deity],
            ["📿 रुद्राक्ष", r.rudraksha],
          ] as [string, string][]
        ).map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <span className="text-white/80 flex-shrink-0 w-24">{k}:</span>
            <span className="devanagari text-white/90">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── North Indian Chart ───────────────────────────────────────────────────────
function NorthIndianChart({
  lagnaIdx,
  grahas,
}: {
  lagnaIdx: number;
  grahas: GrahaData[];
}) {
  const RASHI_SHORT = [
    "मेष",
    "वृष",
    "मिथु",
    "कर्क",
    "सिंह",
    "कन्या",
    "तुला",
    "वृश्चि",
    "धनु",
    "मकर",
    "कुंभ",
    "मीन",
  ];

  // Build house → planets map
  const houseMap: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];
  for (const g of grahas) {
    houseMap[g.house].push(GRAHA_ABBR[g.name] || g.name.slice(0, 2));
  }

  // 4x4 grid, each cell 100x100, total 400x400
  // Standard North Indian layout:
  // Row 0: H12  H1   H2   H3
  // Row 1: H11  [C]  [C]  H4
  // Row 2: H10  [C]  [C]  H5
  // Row 3: H9   H8   H7   H6
  const S = 400;
  const C = 100; // cell size

  const houseGrid: Record<number, { col: number; row: number }> = {
    1: { col: 1, row: 0 },
    2: { col: 2, row: 0 },
    3: { col: 3, row: 0 },
    4: { col: 3, row: 1 },
    5: { col: 3, row: 2 },
    6: { col: 3, row: 3 },
    7: { col: 2, row: 3 },
    8: { col: 1, row: 3 },
    9: { col: 0, row: 3 },
    10: { col: 0, row: 2 },
    11: { col: 0, row: 1 },
    12: { col: 0, row: 0 },
  };

  const goldLine = "rgba(253,230,138,0.4)";
  const goldBright = "#fcd34d";

  return (
    <div
      className="mx-auto"
      style={{ width: "min(360px, 100%)", position: "relative" }}
    >
      <svg
        role="img"
        viewBox={`0 0 ${S} ${S}`}
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <title>उत्तर भारतीय जन्म कुंडली</title>

        {/* Background */}
        <rect width={S} height={S} fill="rgba(4,6,20,0.97)" rx="4" />

        {/* Center 2x2 decorative area */}
        <rect
          x={C}
          y={C}
          width={C * 2}
          height={C * 2}
          fill="rgba(253,230,138,0.06)"
        />
        <line
          x1={C}
          y1={C}
          x2={C * 3}
          y2={C * 3}
          stroke={goldLine}
          strokeWidth="1.5"
        />
        <line
          x1={C * 3}
          y1={C}
          x2={C}
          y2={C * 3}
          stroke={goldLine}
          strokeWidth="1.5"
        />
        <text
          x={S / 2}
          y={S / 2}
          fontSize="14"
          fill="rgba(253,230,138,0.5)"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Noto Sans Devanagari', 'Mangal', serif"
          fontWeight="bold"
        >
          कुंडली
        </text>

        {/* Grid lines — vertical */}
        {[1, 2, 3].map((i) => (
          <line
            key={`vl-${i}`}
            x1={i * C}
            y1={0}
            x2={i * C}
            y2={S}
            stroke={goldLine}
            strokeWidth="1.5"
          />
        ))}
        {/* Grid lines — horizontal */}
        {[1, 2, 3].map((i) => (
          <line
            key={`hl-${i}`}
            x1={0}
            y1={i * C}
            x2={S}
            y2={i * C}
            stroke={goldLine}
            strokeWidth="1.5"
          />
        ))}

        {/* Outer border */}
        <rect
          width={S}
          height={S}
          fill="none"
          stroke={goldBright}
          strokeWidth="2.5"
          rx="4"
        />

        {/* 12 house cells */}
        {(
          Object.entries(houseGrid) as [string, { col: number; row: number }][]
        ).map(([hStr, { col, row }]) => {
          const h = Number(hStr);
          const rashiIdx = (lagnaIdx + h - 1) % 12;
          const rashiName = RASHI_SHORT[rashiIdx];
          const planets = houseMap[h] || [];
          const isLagna = h === 1;

          const x = col * C;
          const y = row * C;
          const cx = x + C / 2;
          const cy = y + C / 2;

          // Lines to render: house number, rashi, lagna marker, planets
          const lines: {
            text: string;
            color: string;
            size: number;
            bold?: boolean;
            font?: string;
          }[] = [];
          lines.push({
            text: rashiName,
            color: goldBright,
            size: 11,
            bold: true,
            font: "'Noto Sans Devanagari', 'Mangal', serif",
          });
          if (isLagna) {
            lines.push({
              text: "ल•",
              color: "#fbbf24",
              size: 11,
              bold: true,
              font: "'Noto Sans Devanagari', serif",
            });
          }
          for (const p of planets) {
            lines.push({
              text: p,
              color: "#86efac",
              size: 12,
              bold: true,
              font: "serif",
            });
          }

          const lineH = 14;
          const totalH = lines.length * lineH;
          const startY = cy - totalH / 2 + lineH * 0.5;

          return (
            <g key={`house-${h}`}>
              {/* Lagna highlight */}
              {isLagna && (
                <rect
                  x={x + 1}
                  y={y + 1}
                  width={C - 2}
                  height={C - 2}
                  fill="rgba(253,230,138,0.07)"
                />
              )}
              {/* House number — top-left corner */}
              <text
                x={x + 7}
                y={y + 13}
                fontSize="12"
                fill={isLagna ? goldBright : "rgba(255,255,255,0.85)"}
                textAnchor="start"
                fontFamily="serif"
                fontWeight="bold"
              >
                {h}
              </text>
              {/* Rashi + planets centered */}
              {lines.map((line, idx) => (
                <text
                  key={`${h}-line-${line.text}`}
                  x={cx}
                  y={startY + idx * lineH}
                  fontSize={line.size}
                  fill={line.color}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily={line.font || "serif"}
                  fontWeight={line.bold ? "bold" : "normal"}
                >
                  {line.text}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function JanmKundali({ onBack }: Props) {
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [city, setCity] = useState("");
  const [kundali, setKundali] = useState<KundaliData | null>(null);
  const [error, setError] = useState("");
  const [expandedAntar, setExpandedAntar] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const d = Number(day);
    const mo = Number(month);
    const yr = Number(year);
    const h = Number(hour);
    const mi = Number(minute);
    if (!name.trim()) {
      setError("कृपया नाम दर्ज करें");
      return;
    }
    if (!d || !mo || !yr || mo > 12 || d > 31 || yr < 1900 || yr > 2100) {
      setError("कृपया सही जन्म तिथि दर्ज करें");
      return;
    }
    if (h < 0 || h > 23 || mi < 0 || mi > 59) {
      setError("कृपया सही समय दर्ज करें");
      return;
    }
    try {
      const result = computeKundali(
        name.trim(),
        d,
        mo,
        yr,
        h,
        mi,
        city.trim() || "भारत",
      );
      setKundali(result);
    } catch {
      setError("गणना में त्रुटि हुई। कृपया पुनः प्रयास करें।");
    }
  }

  const inputStyle = {
    background: "rgba(4,6,20,0.8)",
    border: "1px solid rgba(245,215,110,0.3)",
    color: "#f5d76e",
    borderRadius: "8px",
    padding: "8px 12px",
    width: "100%",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    color: "rgba(245,215,110,0.7)",
    fontSize: "12px",
    marginBottom: "4px",
    display: "block",
    fontFamily: "inherit",
  };

  return (
    <div
      className="relative min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #04061a 0%, #080b20 40%, #0d1035 100%)",
      }}
    >
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #kundali-print-area, #kundali-print-area * { visibility: visible; }
          #kundali-print-area {
            position: absolute; left: 0; top: 0; width: 100%;
            background: white !important; color: black !important;
          }
          .no-print { display: none !important; }
          #kundali-print-area * {
            color: black !important;
            background: white !important;
            border-color: #888 !important;
            box-shadow: none !important;
            text-shadow: none !important;
          }
        }
      `}</style>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 no-print">
          <button
            type="button"
            onClick={onBack}
            data-ocid="janmkundali.back_button"
            className="flex items-center gap-2 px-4 py-2 rounded-xl devanagari font-bold transition-all hover:scale-105"
            style={{
              background: "rgba(245,215,110,0.1)",
              border: "1px solid rgba(245,215,110,0.3)",
              color: "#f5d76e",
            }}
          >
            ← वापस
          </button>
          <div>
            <h1
              className="devanagari text-3xl font-bold"
              style={{ color: "#f5d76e" }}
            >
              🪐 जन्म कुंडली
            </h1>
            <p className="text-white/50 text-xs">
              Jean Meeus Algorithm • Lahiri Ayanamsha
            </p>
          </div>
        </div>

        {/* Form */}
        {!kundali && (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-6 mb-6 no-print"
            style={{
              background: "rgba(5,8,30,0.9)",
              border: "1px solid rgba(245,215,110,0.25)",
              boxShadow: "0 0 40px rgba(245,215,110,0.08)",
            }}
          >
            <h2
              className="devanagari text-xl font-bold mb-6 text-center"
              style={{ color: "#f5d76e" }}
            >
              जन्म विवरण भरें
            </h2>

            <div className="mb-4">
              <label htmlFor="kundali-name" style={labelStyle}>
                👤 नाम
              </label>
              <input
                id="kundali-name"
                data-ocid="janmkundali.name_input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="आपका पूरा नाम"
                style={inputStyle}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="kundali-day" style={labelStyle}>
                📅 जन्म तिथि (दिन / माह / वर्ष)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  id="kundali-day"
                  data-ocid="janmkundali.dob_input"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="दिन"
                  type="number"
                  min="1"
                  max="31"
                  style={inputStyle}
                />
                <input
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="माह"
                  type="number"
                  min="1"
                  max="12"
                  style={inputStyle}
                />
                <input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="वर्ष"
                  type="number"
                  min="1900"
                  max="2100"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="kundali-hour" style={labelStyle}>
                ⏰ जन्म समय IST (घंटे : मिनट)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="kundali-hour"
                  data-ocid="janmkundali.time_input"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  placeholder="घंटे (0-23)"
                  type="number"
                  min="0"
                  max="23"
                  style={inputStyle}
                />
                <input
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  placeholder="मिनट (0-59)"
                  type="number"
                  min="0"
                  max="59"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="kundali-city" style={labelStyle}>
                🏙️ जन्म स्थान
              </label>
              <input
                id="kundali-city"
                data-ocid="janmkundali.city_input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="शहर का नाम (IST मान लिया जाएगा)"
                style={inputStyle}
              />
            </div>

            {error && (
              <div
                className="mb-4 p-3 rounded-xl text-center devanagari text-sm"
                style={{
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#fca5a5",
                }}
                data-ocid="janmkundali.error_state"
              >
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              data-ocid="janmkundali.submit_button"
              className="w-full py-3 rounded-xl devanagari font-bold text-lg transition-all hover:scale-105 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, #e8b84b, #f5d76e, #c9962e)",
                color: "#04061a",
                boxShadow: "0 0 25px rgba(245,215,110,0.4)",
              }}
            >
              🪐 कुंडली बनाएं
            </button>
          </form>
        )}

        {/* Result */}
        {kundali && (
          <>
            {/* Back to form */}
            <div className="flex gap-3 mb-6 no-print">
              <button
                type="button"
                onClick={() => setKundali(null)}
                className="px-4 py-2 rounded-xl devanagari text-sm font-bold transition-all hover:scale-105"
                style={{
                  background: "rgba(245,215,110,0.1)",
                  border: "1px solid rgba(245,215,110,0.3)",
                  color: "#f5d76e",
                }}
              >
                ✏️ नई कुंडली
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                data-ocid="janmkundali.pdf_button"
                className="flex items-center gap-2 px-4 py-2 rounded-xl devanagari text-sm font-bold transition-all hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(232,184,75,0.2), rgba(245,215,110,0.1))",
                  border: "1px solid rgba(245,215,110,0.4)",
                  color: "#f5d76e",
                }}
              >
                📄 PDF में डाउनलोड
              </button>
            </div>

            <div id="kundali-print-area">
              {/* Section 1: विवरण */}
              <section
                className="rounded-2xl p-5 mb-5"
                style={{
                  background: "rgba(5,8,30,0.9)",
                  border: "1px solid rgba(245,215,110,0.25)",
                }}
              >
                <h2
                  className="devanagari text-xl font-bold mb-4"
                  style={{ color: "#f5d76e" }}
                >
                  📋 जन्म विवरण
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(
                    [
                      ["👤 नाम", kundali.name],
                      ["📅 तिथि", kundali.dateStr],
                      ["⏰ समय", `${kundali.timeStr} IST`],
                      ["🏙️ स्थान", kundali.city],
                      ["⬆️ लग्न", kundali.lagna],
                      ["🌙 चंद्र राशि", kundali.chandraRashi],
                      [
                        "⭐ नक्षत्र",
                        `${kundali.nakshatra} (पाद ${kundali.nakshatraPada})`,
                      ],
                      [
                        "🌟 नक्षत्र स्वामी",
                        nakshatraFromLon(
                          kundali.grahas.find((g) => g.name === "चंद्र")?.lon ||
                            0,
                        ).lord,
                      ],
                    ] as [string, string][]
                  ).map(([k, v]) => (
                    <div
                      key={k}
                      className="p-3 rounded-xl"
                      style={{
                        background: "rgba(245,215,110,0.05)",
                        border: "1px solid rgba(245,215,110,0.1)",
                      }}
                    >
                      <div className="text-white/80 text-xs mb-1">{k}</div>
                      <div className="devanagari font-bold text-white text-sm">
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 2: North Indian Chart */}
              <section
                className="rounded-2xl p-5 mb-5"
                style={{
                  background: "rgba(5,8,30,0.9)",
                  border: "1px solid rgba(245,215,110,0.25)",
                }}
              >
                <h2
                  className="devanagari text-xl font-bold mb-4"
                  style={{ color: "#f5d76e" }}
                >
                  🔵 उत्तर भारतीय कुंडली
                </h2>
                <div className="flex justify-center">
                  <NorthIndianChart
                    lagnaIdx={kundali.lagnaIdx}
                    grahas={kundali.grahas}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2 justify-center text-xs">
                  <span style={{ color: "#fbbf24" }}>ल = लग्न</span>
                  {Object.entries(GRAHA_ABBR).map(([full, abbr]) => (
                    <span key={full} style={{ color: "#86efac" }}>
                      {abbr} = {full}
                    </span>
                  ))}
                </div>
              </section>

              {/* Section 3: Graha Sthiti */}
              <section
                className="rounded-2xl p-5 mb-5"
                style={{
                  background: "rgba(5,8,30,0.9)",
                  border: "1px solid rgba(245,215,110,0.25)",
                }}
              >
                <h2
                  className="devanagari text-xl font-bold mb-4"
                  style={{ color: "#f5d76e" }}
                >
                  🪐 ग्रह स्थिति
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        style={{
                          borderBottom: "1px solid rgba(245,215,110,0.2)",
                        }}
                      >
                        {[
                          "ग्रह",
                          "राशि",
                          "अंश",
                          "नक्षत्र",
                          "स्वामी",
                          "भाव",
                          "स्थिति",
                        ].map((h) => (
                          <th
                            key={h}
                            className="devanagari text-left py-2 pr-3"
                            style={{
                              color: "rgba(245,215,110,0.7)",
                              fontWeight: 600,
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {kundali.grahas.map((g, i) => (
                        <tr
                          key={g.name}
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            background:
                              i % 2 === 0
                                ? "rgba(245,215,110,0.02)"
                                : "transparent",
                          }}
                        >
                          <td
                            className="devanagari py-2 pr-3 font-bold"
                            style={{ color: DASHA_COLORS[g.name] || "#f5d76e" }}
                          >
                            {g.name}
                          </td>
                          <td className="devanagari py-2 pr-3 text-white/80">
                            {g.rashi}
                          </td>
                          <td className="py-2 pr-3 text-white/60">
                            {(g.lon % 30).toFixed(1)}°
                          </td>
                          <td className="devanagari py-2 pr-3 text-white/70">
                            {g.nakshatra}
                          </td>
                          <td className="devanagari py-2 pr-3 text-white/60">
                            {g.nakshatraLord}
                          </td>
                          <td className="py-2 pr-3 text-white/60">{g.house}</td>
                          <td className="devanagari py-2 pr-3">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-bold"
                              style={{
                                background:
                                  g.status === "उच्च"
                                    ? "rgba(34,197,94,0.2)"
                                    : g.status === "नीच"
                                      ? "rgba(239,68,68,0.2)"
                                      : g.status === "स्वगृह"
                                        ? "rgba(245,215,110,0.2)"
                                        : "transparent",
                                color:
                                  g.status === "उच्च"
                                    ? "#86efac"
                                    : g.status === "नीच"
                                      ? "#fca5a5"
                                      : g.status === "स्वगृह"
                                        ? "#f5d76e"
                                        : "rgba(255,255,255,0.4)",
                                border:
                                  g.status !== "-"
                                    ? "1px solid currentColor"
                                    : "none",
                              }}
                            >
                              {g.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 4: Vimshottari Dasha */}
              <section
                className="rounded-2xl p-5 mb-5"
                style={{
                  background: "rgba(5,8,30,0.9)",
                  border: "1px solid rgba(245,215,110,0.25)",
                }}
              >
                <h2
                  className="devanagari text-xl font-bold mb-4"
                  style={{ color: "#f5d76e" }}
                >
                  ⏳ विंशोत्तरी दशा
                </h2>

                {/* Current dasha highlight */}
                <div
                  className="rounded-xl p-4 mb-5"
                  style={{
                    background: "rgba(245,215,110,0.08)",
                    border: "2px solid rgba(245,215,110,0.5)",
                    boxShadow: "0 0 30px rgba(245,215,110,0.2)",
                  }}
                >
                  <p className="devanagari text-sm text-white/60 mb-1">
                    वर्तमान दशा
                  </p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div>
                      <span className="text-white/50 text-xs">महादशा</span>
                      <p
                        className="devanagari text-2xl font-bold"
                        style={{
                          color:
                            DASHA_COLORS[
                              kundali.dashas[kundali.currentMaha].lord
                            ] || "#f5d76e",
                        }}
                      >
                        {kundali.dashas[kundali.currentMaha].lord}
                      </p>
                      <p className="text-white/50 text-xs">
                        {formatDate(kundali.dashas[kundali.currentMaha].start)}{" "}
                        — {formatDate(kundali.dashas[kundali.currentMaha].end)}
                      </p>
                    </div>
                    <div className="text-white/30 text-xl">›</div>
                    <div>
                      <span className="text-white/50 text-xs">अंतर्दशा</span>
                      <p
                        className="devanagari text-xl font-bold"
                        style={{
                          color:
                            DASHA_COLORS[
                              kundali.dashas[kundali.currentMaha].antardasha[
                                kundali.currentAntar
                              ].lord
                            ] || "#f5d76e",
                        }}
                      >
                        {
                          kundali.dashas[kundali.currentMaha].antardasha[
                            kundali.currentAntar
                          ].lord
                        }
                      </p>
                      <p className="text-white/50 text-xs">
                        {formatDate(
                          kundali.dashas[kundali.currentMaha].antardasha[
                            kundali.currentAntar
                          ].start,
                        )}{" "}
                        —{" "}
                        {formatDate(
                          kundali.dashas[kundali.currentMaha].antardasha[
                            kundali.currentAntar
                          ].end,
                        )}
                      </p>
                    </div>
                    <div className="text-white/30 text-xl">›</div>
                    <div>
                      <span className="text-white/50 text-xs">पर्यन्तर दशा</span>
                      <p
                        className="devanagari text-lg font-bold"
                        style={{
                          color:
                            DASHA_COLORS[
                              kundali.dashas[kundali.currentMaha].antardasha[
                                kundali.currentAntar
                              ].pratyantar[kundali.currentPratyantar].lord
                            ] || "#e2e8f0",
                        }}
                      >
                        {
                          kundali.dashas[kundali.currentMaha].antardasha[
                            kundali.currentAntar
                          ].pratyantar[kundali.currentPratyantar].lord
                        }
                      </p>
                      <p className="text-white/50 text-xs">
                        {formatDate(
                          kundali.dashas[kundali.currentMaha].antardasha[
                            kundali.currentAntar
                          ].pratyantar[kundali.currentPratyantar].start,
                        )}{" "}
                        —{" "}
                        {formatDate(
                          kundali.dashas[kundali.currentMaha].antardasha[
                            kundali.currentAntar
                          ].pratyantar[kundali.currentPratyantar].end,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phalaadesh Section */}
                {(() => {
                  const mahaLord = kundali.dashas[kundali.currentMaha].lord;
                  const antarLord =
                    kundali.dashas[kundali.currentMaha].antardasha[
                      kundali.currentAntar
                    ].lord;
                  const ptLord =
                    kundali.dashas[kundali.currentMaha].antardasha[
                      kundali.currentAntar
                    ].pratyantar[kundali.currentPratyantar].lord;
                  const mahaColor = DASHA_COLORS[mahaLord] || "#f5d76e";
                  const antarColor = DASHA_COLORS[antarLord] || "#f5d76e";
                  const ptColor = DASHA_COLORS[ptLord] || "#e2e8f0";
                  return (
                    <div
                      className="rounded-2xl p-5 mb-5"
                      style={{
                        background: "rgba(3,5,20,0.95)",
                        border: "1.5px solid rgba(245,215,110,0.4)",
                        boxShadow:
                          "0 0 40px rgba(245,215,110,0.12), inset 0 0 30px rgba(0,0,0,0.4)",
                      }}
                    >
                      <h3
                        className="devanagari text-lg font-bold mb-4 text-center"
                        style={{
                          color: "#f5d76e",
                          textShadow: "0 0 20px rgba(245,215,110,0.5)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        🔮 दशा फलादेश
                      </h3>

                      {/* Mahadasha Phala */}
                      <div
                        className="rounded-xl p-4 mb-3"
                        style={{
                          background: `${mahaColor}10`,
                          border: `1px solid ${mahaColor}40`,
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className="devanagari text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: `${mahaColor}25`,
                              color: mahaColor,
                              border: `1px solid ${mahaColor}60`,
                            }}
                          >
                            महादशा
                          </span>
                          <span
                            className="devanagari font-bold text-base"
                            style={{ color: mahaColor }}
                          >
                            {mahaLord}
                          </span>
                          <span className="text-white/30 text-xs ml-auto">
                            {formatDate(
                              kundali.dashas[kundali.currentMaha].start,
                            )}{" "}
                            —{" "}
                            {formatDate(
                              kundali.dashas[kundali.currentMaha].end,
                            )}
                          </span>
                        </div>
                        <p
                          className="devanagari text-sm leading-relaxed"
                          style={{ color: "rgba(255,255,255,0.8)" }}
                        >
                          {(() => {
                            const badge = getGrahaBadgeText(
                              mahaLord,
                              kundali.grahas,
                            );
                            return (
                              <>
                                {badge && (
                                  <span
                                    className="devanagari text-xs px-2 py-0.5 rounded-full mb-2 inline-block"
                                    style={{
                                      background: `${mahaColor}25`,
                                      color: mahaColor,
                                      border: `1px solid ${mahaColor}50`,
                                    }}
                                  >
                                    {badge}
                                  </span>
                                )}
                                <span className="block">
                                  {getDashaPhala(
                                    mahaLord,
                                    "maha",
                                    mahaLord,
                                    antarLord,
                                    kundali.grahas,
                                  )}
                                </span>
                              </>
                            );
                          })()}
                        </p>
                      </div>

                      {/* Antardasha Phala */}
                      <div
                        className="rounded-xl p-4 mb-3"
                        style={{
                          background: `${antarColor}10`,
                          border: `1px solid ${antarColor}40`,
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className="devanagari text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: `${antarColor}25`,
                              color: antarColor,
                              border: `1px solid ${antarColor}60`,
                            }}
                          >
                            अंतर्दशा
                          </span>
                          <span
                            className="devanagari font-bold text-base"
                            style={{ color: antarColor }}
                          >
                            {mahaLord}—{antarLord}
                          </span>
                          <span className="text-white/30 text-xs ml-auto">
                            {formatDate(
                              kundali.dashas[kundali.currentMaha].antardasha[
                                kundali.currentAntar
                              ].start,
                            )}{" "}
                            —{" "}
                            {formatDate(
                              kundali.dashas[kundali.currentMaha].antardasha[
                                kundali.currentAntar
                              ].end,
                            )}
                          </span>
                        </div>
                        <p
                          className="devanagari text-sm leading-relaxed"
                          style={{ color: "rgba(255,255,255,0.8)" }}
                        >
                          {(() => {
                            const badge = getGrahaBadgeText(
                              antarLord,
                              kundali.grahas,
                            );
                            return (
                              <>
                                {badge && (
                                  <span
                                    className="devanagari text-xs px-2 py-0.5 rounded-full mb-2 inline-block"
                                    style={{
                                      background: `${antarColor}25`,
                                      color: antarColor,
                                      border: `1px solid ${antarColor}50`,
                                    }}
                                  >
                                    {badge}
                                  </span>
                                )}
                                <span className="block">
                                  {getDashaPhala(
                                    antarLord,
                                    "antar",
                                    mahaLord,
                                    antarLord,
                                    kundali.grahas,
                                  )}
                                </span>
                              </>
                            );
                          })()}
                        </p>
                      </div>

                      {/* Pratyantar Phala */}
                      <div
                        className="rounded-xl p-4"
                        style={{
                          background: `${ptColor}08`,
                          border: `1px solid ${ptColor}35`,
                        }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className="devanagari text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: `${ptColor}20`,
                              color: ptColor,
                              border: `1px solid ${ptColor}50`,
                            }}
                          >
                            पर्यन्तर दशा
                          </span>
                          <span
                            className="devanagari font-bold text-base"
                            style={{ color: ptColor }}
                          >
                            {mahaLord}—{antarLord}—{ptLord}
                          </span>
                          <span className="text-white/30 text-xs ml-auto">
                            {formatDate(
                              kundali.dashas[kundali.currentMaha].antardasha[
                                kundali.currentAntar
                              ].pratyantar[kundali.currentPratyantar].start,
                            )}{" "}
                            —{" "}
                            {formatDate(
                              kundali.dashas[kundali.currentMaha].antardasha[
                                kundali.currentAntar
                              ].pratyantar[kundali.currentPratyantar].end,
                            )}
                          </span>
                        </div>
                        <p
                          className="devanagari text-sm leading-relaxed"
                          style={{ color: "rgba(255,255,255,0.75)" }}
                        >
                          {(() => {
                            const badge = getGrahaBadgeText(
                              ptLord,
                              kundali.grahas,
                            );
                            return (
                              <>
                                {badge && (
                                  <span
                                    className="devanagari text-xs px-2 py-0.5 rounded-full mb-2 inline-block"
                                    style={{
                                      background: `${ptColor}20`,
                                      color: ptColor,
                                      border: `1px solid ${ptColor}45`,
                                    }}
                                  >
                                    {badge}
                                  </span>
                                )}
                                <span className="block">
                                  {getDashaPhala(
                                    ptLord,
                                    "pratyantar",
                                    mahaLord,
                                    antarLord,
                                    kundali.grahas,
                                  )}
                                </span>
                              </>
                            );
                          })()}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Maha Dasha timeline */}
                <h3 className="devanagari font-bold text-white/70 text-sm mb-3">
                  महादशा क्रम
                </h3>
                <div className="space-y-2 mb-5">
                  {kundali.dashas.map((d, i) => (
                    <div
                      key={d.lord}
                      data-ocid={`janmkundali.dasha.item.${i + 1}`}
                      className="flex items-center justify-between rounded-xl px-4 py-2.5"
                      style={{
                        background:
                          i === kundali.currentMaha
                            ? `${DASHA_COLORS[d.lord]}20`
                            : "rgba(255,255,255,0.03)",
                        border:
                          i === kundali.currentMaha
                            ? `1px solid ${DASHA_COLORS[d.lord]}60`
                            : "1px solid rgba(255,255,255,0.06)",
                        boxShadow:
                          i === kundali.currentMaha
                            ? `0 0 12px ${DASHA_COLORS[d.lord]}30`
                            : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: DASHA_COLORS[d.lord] || "#888" }}
                        />
                        <span
                          className="devanagari font-bold"
                          style={{ color: DASHA_COLORS[d.lord] || "#f5d76e" }}
                        >
                          {d.lord}
                        </span>
                        {i === kundali.currentMaha && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: "rgba(245,215,110,0.2)",
                              color: "#f5d76e",
                            }}
                          >
                            ▶ चालू
                          </span>
                        )}
                      </div>
                      <span className="text-white/40 text-xs">
                        {formatDate(d.start)} — {formatDate(d.end)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Antardasha breakdown */}
                <h3 className="devanagari font-bold text-white/70 text-sm mb-3">
                  {kundali.dashas[kundali.currentMaha].lord} महादशा — अंतर्दशा
                  विवरण
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {kundali.dashas[kundali.currentMaha].antardasha.map(
                    (ad, j) => {
                      const adColor = DASHA_COLORS[ad.lord] || "#888";
                      const mahaL = kundali.dashas[kundali.currentMaha].lord;
                      const isExpanded = expandedAntar === j;
                      return (
                        <div
                          key={`ad-${ad.lord}-${j}`}
                          className="rounded-lg overflow-hidden"
                          style={{
                            background:
                              j === kundali.currentAntar
                                ? `${adColor}15`
                                : "rgba(255,255,255,0.02)",
                            border:
                              j === kundali.currentAntar
                                ? `1px solid ${adColor}50`
                                : "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <div className="flex items-center justify-between px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ background: adColor }}
                              />
                              <span
                                className="devanagari text-sm font-bold"
                                style={{ color: adColor }}
                              >
                                {ad.lord}
                              </span>
                              {j === kundali.currentAntar && (
                                <span
                                  className="text-xs"
                                  style={{ color: "#f5d76e" }}
                                >
                                  ▶
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 text-xs">
                                {formatDate(ad.start)}
                              </span>
                              <button
                                type="button"
                                data-ocid={"janmkundali.antar.toggle"}
                                onClick={() =>
                                  setExpandedAntar(isExpanded ? null : j)
                                }
                                className="devanagari text-xs px-2 py-0.5 rounded"
                                style={{
                                  background: `${adColor}20`,
                                  color: adColor,
                                  border: `1px solid ${adColor}40`,
                                }}
                              >
                                {isExpanded ? "▲" : "▼"} फलादेश
                              </button>
                            </div>
                          </div>
                          {isExpanded && (
                            <div
                              className="px-3 pb-3"
                              style={{ borderTop: `1px solid ${adColor}20` }}
                            >
                              {(() => {
                                const badge = getGrahaBadgeText(
                                  ad.lord,
                                  kundali.grahas,
                                );
                                const phala = getDashaPhala(
                                  ad.lord,
                                  "antar",
                                  mahaL,
                                  ad.lord,
                                  kundali.grahas,
                                );
                                return (
                                  <div className="pt-2">
                                    {badge && (
                                      <span
                                        className="devanagari text-xs px-2 py-0.5 rounded-full mb-2 inline-block"
                                        style={{
                                          background: `${adColor}25`,
                                          color: adColor,
                                          border: `1px solid ${adColor}50`,
                                        }}
                                      >
                                        {badge}
                                      </span>
                                    )}
                                    <p
                                      className="devanagari text-xs leading-relaxed mt-1"
                                      style={{
                                        color: "rgba(255,255,255,0.75)",
                                      }}
                                    >
                                      {phala}
                                    </p>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>

                {/* Pratyantar Dasha Detail */}
                <h3 className="devanagari font-bold text-white/70 text-sm mb-3 mt-5">
                  {kundali.dashas[kundali.currentMaha].lord}—
                  {
                    kundali.dashas[kundali.currentMaha].antardasha[
                      kundali.currentAntar
                    ].lord
                  }{" "}
                  — पर्यन्तर दशा विवरण
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {kundali.dashas[kundali.currentMaha].antardasha[
                    kundali.currentAntar
                  ].pratyantar.map((pt, k) => (
                    <div
                      key={`pt-${pt.lord}-${k}`}
                      className="rounded-lg overflow-hidden"
                      style={{
                        background:
                          k === kundali.currentPratyantar
                            ? `${DASHA_COLORS[pt.lord]}15`
                            : "rgba(255,255,255,0.02)",
                        border:
                          k === kundali.currentPratyantar
                            ? `1px solid ${DASHA_COLORS[pt.lord]}50`
                            : "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{
                              background: DASHA_COLORS[pt.lord] || "#888",
                            }}
                          />
                          <span
                            className="devanagari text-sm font-bold"
                            style={{ color: DASHA_COLORS[pt.lord] || "#ccc" }}
                          >
                            {pt.lord}
                          </span>
                          {k === kundali.currentPratyantar && (
                            <span
                              className="text-xs"
                              style={{ color: "#f5d76e" }}
                            >
                              ▶ चालू
                            </span>
                          )}
                        </div>
                        <span className="text-white/40 text-xs">
                          {formatDate(pt.start)}
                        </span>
                      </div>
                      {k === kundali.currentPratyantar &&
                        (() => {
                          const ptColor2 = DASHA_COLORS[pt.lord] || "#888";
                          const mahaL2 =
                            kundali.dashas[kundali.currentMaha].lord;
                          const antarL2 =
                            kundali.dashas[kundali.currentMaha].antardasha[
                              kundali.currentAntar
                            ].lord;
                          const badge = getGrahaBadgeText(
                            pt.lord,
                            kundali.grahas,
                          );
                          const phala = getDashaPhala(
                            pt.lord,
                            "pratyantar",
                            mahaL2,
                            antarL2,
                            kundali.grahas,
                          );
                          return (
                            <div
                              className="px-3 pb-3"
                              style={{ borderTop: `1px solid ${ptColor2}20` }}
                            >
                              <div className="pt-2">
                                {badge && (
                                  <span
                                    className="devanagari text-xs px-2 py-0.5 rounded-full mb-2 inline-block"
                                    style={{
                                      background: `${ptColor2}20`,
                                      color: ptColor2,
                                      border: `1px solid ${ptColor2}45`,
                                    }}
                                  >
                                    {badge}
                                  </span>
                                )}
                                <p
                                  className="devanagari text-xs leading-relaxed mt-1"
                                  style={{ color: "rgba(255,255,255,0.75)" }}
                                >
                                  {phala}
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 5: Remedies */}
              <section
                className="rounded-2xl p-5 mb-5"
                style={{
                  background: "rgba(5,8,30,0.9)",
                  border: "1px solid rgba(245,215,110,0.25)",
                }}
              >
                <h2
                  className="devanagari text-xl font-bold mb-4"
                  style={{ color: "#f5d76e" }}
                >
                  🛕 दशा उपाय
                </h2>
                <p className="devanagari text-white/50 text-sm mb-4">
                  वर्तमान महादशा ({kundali.dashas[kundali.currentMaha].lord}) और
                  अंतर्दशा (
                  {
                    kundali.dashas[kundali.currentMaha].antardasha[
                      kundali.currentAntar
                    ].lord
                  }
                  ) के उपाय:
                </p>
                <RemedyCard
                  lord={kundali.dashas[kundali.currentMaha].lord}
                  title="महादशा"
                />
                {kundali.dashas[kundali.currentMaha].lord !==
                  kundali.dashas[kundali.currentMaha].antardasha[
                    kundali.currentAntar
                  ].lord && (
                  <RemedyCard
                    lord={
                      kundali.dashas[kundali.currentMaha].antardasha[
                        kundali.currentAntar
                      ].lord
                    }
                    title="अंतर्दशा"
                  />
                )}
              </section>

              {/* Footer in print */}
              <div
                className="text-center py-4"
                style={{ borderTop: "1px solid rgba(245,215,110,0.15)" }}
              >
                <p
                  className="devanagari font-bold"
                  style={{ color: "#f5d76e" }}
                >
                  ✨ ज्योतिषी उमेश जी — 25+ वर्षों का अनुभव
                </p>
                <p className="text-white/50 text-sm">
                  📱 WhatsApp: +91 9654123331 | 📸 Instagram: @umesh.astrology
                </p>
              </div>
            </div>

            {/* PDF button at bottom */}
            <div className="flex justify-center my-6 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                data-ocid="janmkundali.pdf_button"
                className="flex items-center gap-3 px-8 py-4 rounded-2xl devanagari font-bold text-lg transition-all hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #e8b84b, #f5d76e, #c9962e)",
                  color: "#04061a",
                  boxShadow: "0 0 30px rgba(245,215,110,0.4)",
                }}
              >
                📄 PDF में कुंडली डाउनलोड करें
              </button>
            </div>
          </>
        )}

        {/* Astrologer CTA */}
        <div
          className="rounded-2xl p-4 text-center no-print"
          style={{
            background: "rgba(5,8,30,0.7)",
            border: "1px solid rgba(245,215,110,0.15)",
          }}
        >
          <p className="devanagari text-white/60 text-sm mb-2">
            विस्तृत कुंडली विश्लेषण के लिए संपर्क करें
          </p>
          <a
            href="https://wa.me/919654123331"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl devanagari font-bold transition-all hover:scale-105"
            style={{
              background: "rgba(37,211,102,0.15)",
              border: "1px solid rgba(37,211,102,0.4)",
              color: "#4ade80",
            }}
          >
            📱 ज्योतिषी उमेश जी से WhatsApp पर बात करें
          </a>
        </div>
      </div>
    </div>
  );
}
