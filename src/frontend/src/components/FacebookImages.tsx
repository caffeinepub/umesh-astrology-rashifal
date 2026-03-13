import { ArrowLeft, Download } from "lucide-react";

interface FacebookImagesProps {
  onBack: () => void;
}

const images = [
  {
    title: "भगवान शिव — नंदी, गंगा, कैलाश",
    src: "/assets/generated/shiv_nandi_ganga_parvat.dim_1080x1080.jpg",
    filename: "bhagwan_shiv_nandi_ganga.jpg",
  },
  {
    title: "ग्रह दोष निवारण उपाय (नई)",
    src: "/assets/generated/grah_dosh_nivaran_new.dim_1080x1080.jpg",
    filename: "grah_dosh_nivaran_new.jpg",
  },
  {
    title: "ग्रह दोष निवारण उपाय",
    src: "/assets/generated/grah_dosh_post.dim_1080x1080.jpg",
    filename: "grah_dosh_nivaran.jpg",
  },
];

export function FacebookImages({ onBack }: FacebookImagesProps) {
  const handleDownload = (src: string, filename: string) => {
    const a = document.createElement("a");
    a.href = src;
    a.download = filename;
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black text-white p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            data-ocid="fb_images.back.button"
            onClick={onBack}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-yellow-400">📸 इमेज Gallery</h1>
        </div>

        <p className="text-white/70 text-sm mb-6">
          नीचे इमेज को देखें। इमेज पर <strong>लंबे समय तक press</strong> करें (Long Press)
          → <strong>"Save Image"</strong> चुनें → Gallery से share करें।
        </p>

        {images.map((img) => (
          <div
            key={img.filename}
            className="bg-white/10 rounded-2xl p-4 mb-4 border border-yellow-400/20"
          >
            <h2 className="text-yellow-300 font-semibold mb-3 text-center">
              {img.title}
            </h2>
            <img
              src={img.src}
              alt={img.title}
              className="w-full rounded-xl border border-yellow-400/30 mb-4"
            />
            <button
              type="button"
              data-ocid="fb_images.download.button"
              onClick={() => handleDownload(img.src, img.filename)}
              className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition"
            >
              <Download size={18} />
              इमेज Download करें
            </button>
          </div>
        ))}

        <div className="mt-4 bg-blue-900/40 border border-blue-400/30 rounded-xl p-4 text-sm text-white/80">
          <p className="font-semibold text-blue-300 mb-1">
            📱 Android पर कैसे Save करें?
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              इमेज पर <strong>2-3 सेकंड तक press</strong> करें
            </li>
            <li>
              <strong>"Save Image"</strong> या <strong>"Download Image"</strong>{" "}
              पर tap करें
            </li>
            <li>Gallery में जाकर share करें</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
