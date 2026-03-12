interface RashiCardProps {
  symbol: string;
  name: string;
  prediction: string;
  gradient: string;
  borderColor: string;
  index: number;
}

const DEFAULT_PREDICTIONS: Record<string, string> = {
  मेष: "आज का दिन आपके लिए शुभ है। नई योजनाएं बनाएं और उन पर अमल करें। प्रेम जीवन में मधुरता आएगी।",
  वृषभ: "आर्थिक मामलों में सावधानी बरतें। परिवार के साथ समय बिताएं। स्वास्थ्य का ध्यान रखें।",
  मिथुन: "व्यापार में लाभ के अवसर मिलेंगे। दोस्तों से मुलाकात होगी। यात्रा की संभावना है।",
  कर्क: "घर-परिवार में खुशियाँ आएंगी। माता से आशीर्वाद प्राप्त होगा। भावनात्मक रूप से मजबूत रहें।",
  सिंह: "आत्मविश्वास बनाए रखें। नेतृत्व क्षमता से काम करें। मान-सम्मान में वृद्धि होगी।",
  कन्या: "बुद्धि और विवेक से काम लें। स्वास्थ्य सुधरेगा। नौकरी में तरक्की के संकेत हैं।",
  तुला: "न्याय और संतुलन बनाए रखें। साझेदारी में लाभ होगा। प्रेम संबंध मजबूत होंगे।",
  वृश्चिक: "रहस्यमय मामलों में सफलता मिलेगी। आर्थिक स्थिति मजबूत होगी। शत्रु पराजित होंगे।",
  धनु: "धार्मिक कार्यों में मन लगेगा। विदेश यात्रा की संभावना। ज्ञान प्राप्ति के अवसर मिलेंगे।",
  मकर: "कठोर परिश्रम रंग लाएगा। व्यापार में उन्नति होगी। वरिष्ठ जनों का सहयोग मिलेगा।",
  कुंभ: "मित्रों का साथ मिलेगा। नई तकनीक से लाभ होगा। सामाजिक कार्यों में भागीदारी बढ़ेगी।",
  मीन: "आध्यात्मिक उन्नति होगी। कल्पनाशक्ति का उपयोग करें। भावनाओं को संभालकर चलें।",
};

export function RashiCard({
  symbol,
  name,
  prediction,
  gradient,
  borderColor,
  index,
}: RashiCardProps) {
  const displayPrediction =
    prediction || DEFAULT_PREDICTIONS[name] || "आज का राशिफल जल्द उपलब्ध होगा।";

  return (
    <div
      data-ocid={`rashi.item.${index}`}
      className="rashi-card relative rounded-2xl p-[1px] transition-all duration-300 cursor-default"
      style={{ background: borderColor }}
    >
      <div
        className="rounded-2xl p-4 h-full flex flex-col"
        style={{ background: gradient }}
      >
        {/* Decorative top shine */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px opacity-50"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          }}
        />

        {/* Symbol */}
        <div className="text-center mb-2">
          <span
            className="text-4xl drop-shadow-lg"
            style={{ filter: "drop-shadow(0 0 8px rgba(255,200,100,0.8))" }}
          >
            {symbol}
          </span>
        </div>

        {/* Name */}
        <h3
          className="text-center font-bold text-lg devanagari mb-2 text-white drop-shadow"
          style={{
            textShadow:
              "0 0 10px rgba(255,220,100,0.8), 0 1px 2px rgba(0,0,0,0.8)",
          }}
        >
          {name}
        </h3>

        {/* Divider */}
        <div
          className="w-full h-px mb-3 opacity-40"
          style={{
            background:
              "linear-gradient(90deg, transparent, #f5d76e, transparent)",
          }}
        />

        {/* Prediction */}
        <p
          className="devanagari text-sm leading-relaxed text-white/90 flex-1"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}
        >
          {displayPrediction}
        </p>
      </div>
    </div>
  );
}
