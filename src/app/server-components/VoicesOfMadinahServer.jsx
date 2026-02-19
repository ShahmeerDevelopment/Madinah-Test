/**
 * Server Component - Voices of Madinah
 * Fully static - data is hardcoded and never changes
 * Uses pure CSS for scrolling/carousel effect (no JavaScript)
 * Uses next/image for optimized image loading
 */

import Image from "next/image";

// Static data - never changes, baked into HTML at build time
const voiceOfMadinahData = [
  {
    id: 1,
    name: "Dr Yusuf Abdul-Jobbar",
    image: "/assets/images/voice_of_madinah/Dr_yousaf_compressed.jpeg",
    description: "Imam, Author & Lecturer",
  },
  {
    id: 2,
    name: "Sh Musleh Khan",
    image: "/assets/images/voice_of_madinah/ShMuslehKhan_Compressed.jpeg",
    description: "Imam, Teacher & International Speaker",
  },
  {
    id: 3,
    name: "Sh Abdullah Hakim Quick",
    image: "/assets/images/voice_of_madinah/Sh_Abdullah_compressed.jpeg",
    description: "Imam, Scholar, Historian & Author",
  },
  {
    id: 4,
    name: "Sh Alaa Elsayed",
    image: "/assets/images/voice_of_madinah/ShAlaa_compressed.jpg",
    description: "Imam, Teacher & International Speaker",
  },
  {
    id: 6,
    name: "Dr Waleed Hakeem",
    image: "/assets/images/voice_of_madinah/DR_Waleed_compressed.jpg",
    description: "The Travelling Imam",
  },
  {
    id: 7,
    name: "Sh Abdullah Misra",
    image:
      "/assets/images/voice_of_madinah/Shaykh_Abdullah_2023_Compressed.jpg",
    description: "Imam, Scholar, Religious Counselor",
  },
];

const VoiceCard = ({ name, image, description }) => (
  <div className="voice-card">
    <div className="voice-image-container">
      <Image
        src={image}
        alt={name}
        width={89}
        height={90}
        style={{ borderRadius: "8px", objectFit: "cover" }}
      />
    </div>
    <p className="voice-name">{name}</p>
    <p className="voice-description">{description}</p>
  </div>
);

const VoicesOfMadinahServer = () => {
  return (
    <section
      style={{
        height: "max-content",
        zIndex: 1,
        boxShadow: "0px 0px 100px 0px #0000000F",
        borderRadius: "40px",
        backgroundColor: "#FFFFFF",
        overflow: "visible",
        padding: "32px 32px 48px 32px",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-league-spartan)",
          fontSize: "32px",
          fontWeight: 500,
          lineHeight: "38px",
          letterSpacing: "-0.41px",
          color: "#090909",
          marginBottom: "24px",
        }}
      >
        Voices of Madinah
      </h2>
      <div className="voices-container">
        <style>{`
        .voices-container {
          width: 100%;
          overflow: visible;
          position: relative;
          padding: 20px 0;
        }
        
        /* Desktop: Flexbox grid layout */
        .voices-grid {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 10px 20px;
          overflow: visible;
        }
        
        /* Mobile: Horizontal scroll */
        .voices-scroll {
          display: none;
        }
        
        .voice-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 90px;
          flex: 1;
          background-color: #ffffff;
          border-radius: 24px;
          padding: 0;
          margin: 10px;
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease-in-out;
          transform-origin: center center;
          cursor: pointer;
        }
        
        .voice-card:hover {
          transform: scale(1.1);
          z-index: 999;
        }
        
        .voice-image-container {
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 12px;
          width: 89px;
          height: 90px;
        }
        
        .voice-name {
          color: rgba(9, 9, 9, 1);
          font-size: 18px;
          line-height: 22px;
          font-weight: 500;
          text-align: center;
          margin: 0 0 4px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .voice-description {
          color: rgba(96, 96, 98, 1);
          font-size: 12px;
          line-height: 16px;
          font-weight: 400;
          letter-spacing: -0.41px;
          text-align: center;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Mobile styles */
        @media (max-width: 599px) {
          .voices-grid {
            display: none;
          }
          
          .voices-scroll {
            display: flex;
            gap: 16px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
            padding: 10px 16px;
          }
          
          .voices-scroll::-webkit-scrollbar {
            display: none; /* Chrome/Safari */
          }
          
          .voice-card {
            scroll-snap-align: start;
            flex: 0 0 auto;
            min-width: 140px;
            max-width: 140px;
            margin: 0;
          }
          
          .voice-card:hover {
            transform: none;
            z-index: 1;
          }
        }
        
        /* Small mobile */
        @media (max-width: 480px) {
          .voice-card {
            min-width: 120px;
            max-width: 120px;
          }
          
          .voice-name {
            font-size: 14px;
            line-height: 18px;
          }
          
          .voice-description {
            font-size: 11px;
            line-height: 14px;
          }
        }
      `}</style>

        {/* Desktop: Grid layout with hover effects */}
        <div className="voices-grid">
          {voiceOfMadinahData.map((person) => (
            <VoiceCard key={person.id} {...person} />
          ))}
        </div>

        {/* Mobile: Horizontal scroll (CSS-only, no JS) */}
        <div className="voices-scroll">
          {voiceOfMadinahData.map((person) => (
            <VoiceCard key={person.id} {...person} />
          ))}
        </div>
      </div>

      {/* Mobile responsive styles for section */}
      <style>{`
      @media (max-width: 600px) {
        section {
          padding: 24px 16px 32px 16px !important;
        }
      }
    `}</style>
    </section>
  );
};

export default VoicesOfMadinahServer;
