import { useState, useRef } from "react";

type Mood = "romantic" | "flirty" | "mysterious" | "cheeky" | "playful";
type Caption = {
  text: string;
  emoji: string;
};

const moodData = {
  romantic: {
    palette: "bg-rose-200",
    filterClasses: "filter sepia opacity-90",
    captions: [
      { text: "You're captivating, truly.", emoji: "💖" },
      { text: "My heart skips a beat for you.", emoji: "💞" },
      { text: "Enchanting as a midnight dream.", emoji: "✨" },
      { text: "Pure elegance, inside and out.", emoji: "🌹" },
    ],
  },
  flirty: {
    palette: "bg-pink-500",
    filterClasses: "filter brightness-125 saturate-150",
    captions: [
      { text: "Is it hot in here, or is it just you?", emoji: "🔥" },
      { text: "I'm not usually this bold, but you...", emoji: "😉" },
      { text: "You must be a magician, because whenever I look at you, everyone else disappears.", emoji: "🎩" },
      { text: "Your smile is my new favorite view.", emoji: "😊" },
    ],
  },
  mysterious: {
    palette: "bg-purple-900",
    filterClasses: "filter grayscale opacity-75",
    captions: [
      { text: "Intriguing, as always.", emoji: "🧐" },
      { text: "Some secrets are best left unsaid... for now.", emoji: "🤫" },
      { text: "A captivating enigma.", emoji: "🌌" },
      { text: "Lost in the allure of your gaze.", emoji: "👁️" },
    ],
  },
  cheeky: {
    palette: "bg-orange-300",
    filterClasses: "filter contrast-125 saturate-125",
    captions: [
      { text: "Did it hurt when you fell from heaven? Just kidding, you're obviously a mischievous imp.", emoji: "😈" },
      { text: "I've got my eyes on you, you little troublemaker.", emoji: "😜" },
      { text: "You're so cool, you make penguins jealous.", emoji: "🐧" },
      { text: "Are you a parking ticket? Because you've got FINE written all over you.", emoji: "😏" },
    ],
  },
  playful: {
    palette: "bg-cyan-200",
    filterClasses: "filter hue-rotate-15 brightness-110",
    captions: [
      { text: "Let's make some fun memories!", emoji: "🎉" },
      { text: "You're more fun than a barrel of monkeys!", emoji: "🐒" },
      { text: "Ready for an adventure?", emoji: "🚀" },
      { text: "Sparkling with personality!", emoji: "💫" },
    ],
  },
};

const getRandomCaption = (mood: Mood): Caption => {
  const captions = moodData[mood]?.captions || [];
  return captions[Math.floor(Math.random() * captions.length)] || { text: "Looking good!", emoji: "👍" };
};

const FlirtFrame: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood>("romantic");
  const [currentCaption, setCurrentCaption] = useState<Caption | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setCurrentCaption(getRandomCaption(selectedMood));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    if (selectedImage) {
      setCurrentCaption(getRandomCaption(mood));
    }
  };

  // --- EXPORT TO CANVAS and DOWNLOAD ---
  const handleExport = async () => {
    if (!selectedImage || !currentCaption) {
      alert("Please upload an image and choose a mood first!");
      return;
    }

    // load image
    const img = new Image();
    img.src = selectedImage;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // draw the base image
        ctx.drawImage(img, 0, 0);

        // overlay color
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--tw-bg-opacity') || "rgba(255,0,0,0.2)";
        // we can approximate overlay blending
        ctx.fillStyle = "rgba(255, 192, 203, 0.25)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw caption
        ctx.font = "bold 40px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(
          currentCaption.text + " " + currentCaption.emoji,
          canvas.width / 2,
          canvas.height - 50
        );

        // download
        const link = document.createElement("a");
        link.download = "flirtframe.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    };
  };

  const currentFilterClasses = moodData[selectedMood]?.filterClasses || "";
  const currentPaletteColorClass = moodData[selectedMood]?.palette || "bg-white";

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-xl w-full flex flex-col items-center space-y-8">
        <h1 className="text-4xl font-extrabold text-pink-700 mb-4 text-center">FlirtFrame 💬💖</h1>

        <div className="w-full flex flex-col items-center space-y-4">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-pink-500 text-white rounded-full text-lg font-bold shadow-md hover:bg-pink-600 transition-colors duration-300"
          >
            {selectedImage ? "Change Photo" : "Upload Photo"}
          </button>

          <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-dashed border-gray-300">
            {selectedImage ? (
              <>
                <img
                  src={selectedImage}
                  alt="Uploaded selfie"
                  className={`w-full h-full object-cover ${currentFilterClasses}`}
                />
                <div
                  className={`absolute inset-0 ${currentPaletteColorClass} opacity-20 mix-blend-multiply`}
                ></div>
              </>
            ) : (
              <div className="text-gray-500 text-lg text-center p-4">
                <span role="img" aria-label="camera" className="text-5xl mb-2 block">
                  📸
                </span>
                Upload your selfie to get started!
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Choose Your Vibe</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <MoodButton mood="romantic" />
            <MoodButton mood="flirty" />
            <MoodButton mood="mysterious" />
            <MoodButton mood="cheeky" />
            <MoodButton mood="playful" />
          </div>
        </div>

        <div className="w-full bg-pink-50 border border-pink-200 rounded-xl p-5 text-center shadow-inner min-h-24 flex items-center justify-center">
          {currentCaption ? (
            <p className="text-2xl font-semibold text-pink-700 leading-relaxed">
              "{currentCaption.text}" <span className="text-3xl">{currentCaption.emoji}</span>
            </p>
          ) : (
            <p className="text-gray-500 text-lg">
              {selectedImage ? "Select a mood to get a compliment!" : "Upload a photo to see a flirty caption!"}
            </p>
          )}
        </div>

        <button
          onClick={handleExport}
          className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full text-xl font-bold shadow-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105"
        >
          Export & Share
        </button>
      </div>
    </div>
  );
};

// Nested MoodButton component
const MoodButton: React.FC<{ mood: Mood; }> = ({ mood }) => {
  const { palette } = moodData[mood];
  return (
    <button
      onClick={() => {}}
      className={`
        px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out
        bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800
      `}
    >
      {mood.charAt(0).toUpperCase() + mood.slice(1)}
    </button>
  );
};

export default FlirtFrame;
