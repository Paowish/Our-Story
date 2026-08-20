import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  FaHeart, FaMapMarkerAlt, FaMusic, FaLock, FaDice, FaLockOpen,
  FaCamera, FaBars, FaTimes, FaExclamationCircle, FaPlay, FaPause,
  FaComment, FaSun, FaMoon, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

// Fix for Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ==========================
// 1. DATA
// ==========================
const memories = [
  {
    id: 1,
    title: "The Day We Met",
    desc: "Santolan, Pasig City. The moment our story began.",
    images: [
      "/The day we met 1.jpeg",
      "/The day we met 2.jpeg"
    ]
  },
  {
    id: 2,
    title: "Our First Date",
    desc: "Bonchon, Pasig Palengke, Pasig City.",
    images: [
      "/Our first date 1.jpeg",
      "/Our first date 2.jpeg",
      "/Our first date 3.jpeg"
    ]
  },
  {
    id: 3,
    title: "Our First Trip",
    desc: "Adventures with you are always the best.",
    images: [
      "/Our first trip 1.jpeg",
      "/Our first trip 2.jpeg",
      "/Our first trip 3.jpeg",
      "/Our first trip 4.jpeg"
    ]
  },
];

const locations = [
  {
    id: 1,
    name: "Where We Met",
    address: "Santolan, Pasig City, Philippines",
    desc: "The place our story began."
  },
  {
    id: 2,
    name: "Our First Date",
    address: "Bonchon, Pasig Palengke, Pasig City, Philippines",
    desc: "Bonchon, Pasig Palengke, Pasig City."
  },
];

const dateIdeas = [
  "Watch a movie together 🍿", "Cook a fancy dinner at home 🍝",
  "Go for a walk in the park 🌳", "Visit a new cafe ☕",
  "Play a board game 🎲", "Have a picnic by the lake 🧺",
  "Build a blanket fort 🏕️", "Stargaze at midnight 🌙"
];

// ==========================
// 2. COMPONENT: ALERT MODAL
// ==========================
function AlertModal({ isOpen, onClose, message }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 shadow-2xl rounded-2xl p-6 relative text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mx-auto">
                  <FaExclamationCircle className="text-red-500 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Incorrect Password</h3>
                  <p className="text-gray-600 mt-1 text-sm">{message}</p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition shadow-sm"
                >
                  Try Again
                </button>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ==========================
// 3. COMPONENT: MEMORY CAROUSEL (WITH AUTO-PLAY)
// ==========================
function MemoryCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (images.length <= 1) return;

    const startAutoPlay = () => {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
    };

    startAutoPlay();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length]);

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    if (Math.abs(offset) > 50) {
      if (offset < 0 && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (offset > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
    }
  };

  return (
    <div className="relative w-full h-56 overflow-hidden rounded-t-2xl bg-gray-100" ref={containerRef}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute w-full h-full"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          <img
            src={images[currentIndex]}
            alt="Memory"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${idx === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================
// 4. COMPONENT: NAVBAR
// ==========================
function Navbar({ activeSection, toggleMenu, isDarkMode, toggleDarkMode }) {
  const sections = [
    { id: 'home', label: 'Home', icon: <FaHeart /> },
    { id: 'memories', label: 'Memories', icon: <FaCamera /> },
    { id: 'map', label: 'Our Map', icon: <FaMapMarkerAlt /> },
    { id: 'chat', label: 'Chat', icon: <FaComment /> },
    { id: 'diary', label: 'Diary', icon: <FaLock /> },
    { id: 'fun', label: 'Fun', icon: <FaDice /> },
    { id: 'music', label: 'Music', icon: <FaMusic /> },
  ];

  const handleClick = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-6 shadow-sm">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <button
          onClick={() => handleClick('home')}
          className="text-xl font-serif font-bold text-pink-600 tracking-tight hover:opacity-80 transition-opacity"
        >
          Our Story
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => handleClick(s.id)}
                className={`flex items-center gap-2 hover:text-pink-600 transition-colors ${activeSection === s.id ? 'text-pink-600' : ''}`}
              >
                {s.icon} <span>{s.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-600 hover:text-pink-600 transition-colors"
            aria-label="Toggle menu"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}

// ==========================
// 5. COMPONENT: MOBILE SIDEBAR
// ==========================
function MobileSidebar({ isOpen, onClose, activeSection }) {
  const sections = [
    { id: 'home', label: 'Home', icon: <FaHeart /> },
    { id: 'memories', label: 'Memories', icon: <FaCamera /> },
    { id: 'map', label: 'Our Map', icon: <FaMapMarkerAlt /> },
    { id: 'chat', label: 'Chat', icon: <FaComment /> },
    { id: 'diary', label: 'Diary', icon: <FaLock /> },
    { id: 'fun', label: 'Fun', icon: <FaDice /> },
    { id: 'music', label: 'Music', icon: <FaMusic /> },
  ];

  const handleClick = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-72 z-[70] bg-white shadow-2xl p-6 md:hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-serif font-bold text-pink-600 tracking-tight">Our Story</span>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-black transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-4 text-base font-medium text-gray-600">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleClick(s.id)}
                  className={`flex items-center gap-3 py-2 hover:text-pink-600 transition-colors border-b border-gray-50 ${activeSection === s.id ? 'text-pink-600' : ''}`}
                >
                  {s.icon} <span>{s.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ==========================
// 6. COMPONENT: SCROLL SPY
// ==========================
function ScrollSpy({ setActiveSection }) {
  useEffect(() => {
    const sections = ['home', 'memories', 'map', 'chat', 'diary', 'fun', 'music'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4, rootMargin: '-80px 0px -80px 0px' }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [setActiveSection]);
  return null;
}

// ==========================
// 7. COMPONENT: ANNIVERSARY COUNTDOWN
// ==========================
function Countdown() {
  const [timeLeft, setTimeLeft] = useState({});
  const [monthsaryMessage, setMonthsaryMessage] = useState('');

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    let target = new Date(currentYear, 6, 24);
    if (now > target) {
      target = new Date(currentYear + 1, 6, 24);
    }

    const isMonthsary = now.getDate() === 24;
    setMonthsaryMessage(isMonthsary ? "🎉 Happy Monthsary, my love!" : '');

    const timer = setInterval(() => {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-8 rounded-2xl border border-pink-100 shadow-sm">
      <h3 className="text-center text-pink-800 font-medium mb-4">Counting down to our Anniversary</h3>
      {monthsaryMessage && (
        <p className="text-center text-pink-600 font-semibold text-lg mb-4">{monthsaryMessage}</p>
      )}
      <div className="grid grid-cols-4 gap-2 text-center">
        {Object.entries(timeLeft).map(([key, val]) => (
          <div key={key} className="bg-white p-3 rounded-xl shadow-sm border border-pink-100">
            <div className="text-2xl font-bold text-gray-800">{val}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">{key}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================
// 8. MAIN APP
// ==========================
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ✅ PURE CSS DARK MODE TOGGLE
  useEffect(() => {
    const saved = localStorage.getItem('ourStoryDarkMode');
    if (saved !== null) {
      setIsDarkMode(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark-mode');
      localStorage.setItem('ourStoryDarkMode', JSON.stringify(true));
    } else {
      root.classList.remove('dark-mode');
      localStorage.setItem('ourStoryDarkMode', JSON.stringify(false));
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [diaryPassword, setDiaryPassword] = useState('');
  const [isDiaryUnlocked, setIsDiaryUnlocked] = useState(false);
  const [dateIdea, setDateIdea] = useState("Press the button for inspiration!");
  const [dateHistory, setDateHistory] = useState([]);
  const [isRolling, setIsRolling] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(new Audio("/First And Last.mp3"));

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [fetchedLocations, setFetchedLocations] = useState([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const results = await Promise.all(
        locations.map(async (loc) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(loc.address)}&format=json&limit=1`
            );
            const data = await response.json();
            if (data && data.length > 0) {
              return {
                ...loc,
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
              };
            }
          } catch (error) {
            console.error("Geocoding failed for:", loc.address);
          }
          return { ...loc, lat: 14.5995, lng: 120.9842 };
        })
      );
      setFetchedLocations(results);
    };

    fetchCoordinates();
  }, []);

  const pickDateIdea = () => {
    if (isRolling) return;
    setIsRolling(true);
    const random = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
    setTimeout(() => {
      setDateIdea(random);
      setDateHistory(prev => {
        const newHistory = [random, ...prev.filter(item => item !== random)];
        return newHistory.slice(0, 3);
      });
      setIsRolling(false);
    }, 800);
  };

  const unlockDiary = () => {
    if (diaryPassword === '24/24/7') {
      setIsDiaryUnlocked(true);
    } else {
      setAlertMessage('Secret muna ito for the message hehe');
      setIsAlertOpen(true);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const todayStr = `${new Date().getMonth() + 1}-${new Date().getDate()}`;
  const capsuleDate = "8-24";
  const isCapsuleDay = todayStr === capsuleDate;

  const secretLetter = `Happy Monthsary, baby ko. 
    Wala akong magawa e kaya ganado akong gumawa ng ganto heheh. 
    Sana matupad lahat ng pangarap nating dalawa. I love you so much.
    Sana magbago ka na at ako syempre, lagi kong ipagdadasal na magkasama pa tayo hanggang sa pagtanda. Yown `;

  return (
    <div className="min-h-screen text-gray-800 font-sans scroll-smooth pt-20 transition-colors duration-300">
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        message={alertMessage}
      />
      <Navbar activeSection={activeSection} toggleMenu={toggleMenu} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <MobileSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activeSection={activeSection} />
      <ScrollSpy setActiveSection={setActiveSection} />

      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-14 h-14 bg-pink-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-pink-600 transition"
        >
          {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5 ml-1" />}
        </motion.button>
      </div>

      <main className="w-full flex flex-col items-center justify-center px-6 pt-20 md:pt-24 pb-12 md:pb-24 transition-colors duration-300">
        <div className="w-full max-w-4xl flex flex-col gap-24 md:gap-24">

          <section id="home" className="pt-8 scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
              <h1 className="text-5xl md:text-7xl font-serif text-gray-900 tracking-tight mb-4">Our Story</h1>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                A digital space dedicated to the best chapter of my life. You, me, and the memories we are building together.
              </p>

              {isCapsuleDay && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, type: 'spring' }}
                  className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl shadow-sm relative"
                >
                  <div className="text-4xl mb-3">💌</div>
                  <h3 className="text-lg font-serif text-yellow-800 mb-2">A Letter for You</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line max-w-md mx-auto">
                    {secretLetter}
                  </p>
                </motion.div>
              )}

              <div className="mt-12">
                <Countdown />
              </div>
            </motion.div>
          </section>

          <section id="memories" className="scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl font-serif text-gray-900 mb-8 flex items-center gap-3">
                <FaCamera className="text-pink-500" /> Our Memories
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {memories.map((mem) => (
                  <motion.div
                    key={mem.id}
                    whileHover={{ y: -8 }}
                    className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                  >
                    <MemoryCarousel images={mem.images} />

                    <div className="p-5">
                      <h3 className="font-semibold text-gray-800 text-lg">{mem.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{mem.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          <section id="map" className="scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl font-serif text-gray-900 mb-8 flex items-center gap-3">
                <FaMapMarkerAlt className="text-pink-500" /> Where We've Been
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm h-[400px]">
                <MapContainer
                  center={fetchedLocations.length > 0 ? [fetchedLocations[0].lat, fetchedLocations[0].lng] : [14.5995, 120.9842]}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {fetchedLocations.map((loc) => (
                    loc.lat && loc.lng ? (
                      <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                        <Popup>
                          <strong>{loc.name}</strong>
                          <br />
                          <span className="text-sm text-gray-500">{loc.desc}</span>
                        </Popup>
                      </Marker>
                    ) : null
                  ))}
                </MapContainer>
              </div>
            </motion.div>
          </section>

          <section id="chat" className="scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl font-serif text-gray-900 mb-8 flex items-center gap-3">
                <FaComment className="text-pink-500" /> Our First Messages
              </h2>
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 shadow-sm max-w-2xl mx-auto">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 max-w-[80%] shadow-sm">
                      <p className="text-gray-700 text-sm">-Jomar</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">5:49 PM</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-pink-100 border border-pink-200 rounded-2xl rounded-tr-none p-4 max-w-[80%] shadow-sm">
                      <p className="text-gray-700 text-sm">Bakit kuya? 😆</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">5:50 PM</span>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 max-w-[80%] shadow-sm">
                      <p className="text-gray-700 text-sm">Si jomar po jan ate</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">5:52 PM</span>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 max-w-[80%] shadow-sm">
                      <p className="text-gray-700 text-sm">HAHAHAHAHAHHA</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">5:52 PM</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-pink-100 border border-pink-200 rounded-2xl rounded-tr-none p-4 max-w-[80%] shadow-sm">
                      <p className="text-gray-700 text-sm">Anong 'ate' 😆</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">5:52 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          <section id="diary" className="scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl font-serif text-gray-900 mb-8 flex items-center gap-3">
                <FaLock className="text-pink-500" /> Secret Diary
              </h2>
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 shadow-sm">
                {!isDiaryUnlocked ? (
                  <div className="max-w-md mx-auto text-center">
                    <FaLock className="text-5xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">Enter the secret password to read our private letters.</p>
                    <input
                      type="password"
                      placeholder="Enter password"
                      className="w-full border border-gray-200 rounded-lg p-3 mb-4 bg-white"
                      onChange={(e) => setDiaryPassword(e.target.value)}
                    />
                    <button onClick={unlockDiary} className="bg-pink-500 text-white px-8 py-2 rounded-full hover:bg-pink-600 transition text-sm font-medium">
                      Unlock
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <button onClick={() => setIsDiaryUnlocked(false)} className="absolute top-0 right-0 text-gray-400 hover:text-black">
                      <FaLockOpen />
                    </button>
                    <h3 className="text-xl font-serif text-gray-800 mb-4">A Letter to You</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Today was perfect. We went to our favorite cafe, and you wore that blue dress.
                      I don't know how I got so lucky, but I'm glad I did. Forever yours.
                    </p>
                    <div className="mt-6 text-right text-sm text-gray-400">- Paolo</div>
                  </div>
                )}
              </div>
            </motion.div>
          </section>

          <section id="fun" className="scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl font-serif text-gray-900 mb-8 flex items-center gap-3">
                <FaDice className="text-pink-500" /> Date Night Decider
              </h2>

              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div className="text-center">
                  <div className="min-h-[5rem] flex items-center justify-center mb-6">
                    <motion.p
                      key={dateIdea}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, type: 'spring' }}
                      className={`text-xl text-gray-800 font-medium ${isRolling ? 'opacity-50' : ''}`}
                    >
                      {isRolling ? '🎲 Rolling...' : dateIdea}
                    </motion.p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={pickDateIdea}
                    disabled={isRolling}
                    className={`bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-medium shadow-sm transition-all duration-200 ${isRolling ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                  >
                    {isRolling ? 'Rolling...' : 'Roll the Dice'}
                  </motion.button>

                  {dateHistory.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Recent Ideas</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {dateHistory.map((idea, idx) => (
                          <span key={idx} className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-600">
                            {idea}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </section>

          <section id="music" className="scroll-mt-20 pb-12">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl font-serif text-gray-900 mb-8 flex items-center gap-3">
                <FaMusic className="text-pink-500" /> Our Playlist
              </h2>
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 shadow-sm flex justify-center">
                <iframe
                  data-testid="embed-iframe"
                  style={{ borderRadius: '12px' }}
                  src="https://open.spotify.com/embed/playlist/7L6mdgEKVTpXlr4UCuG6dt?utm_source=generator&si=4f8a9ac906ac44aa"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Our Playlist"
                />
              </div>
            </motion.div>
          </section>

        </div>
      </main>

      <footer className="py-12 text-center border-t border-gray-100 bg-gray-50/50">
        <p className="text-sm text-gray-400">
          Made with <FaHeart className="inline text-pink-500" /> by Paolo
        </p>
      </footer>

      <style>{`
        /* ===== DARK MODE - PREMIUM ROMANTIC PALETTE ===== */
                /* ✅ FIX: Forces the Countdown Card background to match the dark theme */
        .dark-mode .bg-gradient-to-r.from-pink-50.to-rose-50 {
          background: #2c1f3d !important;
          border-color: #3f2e52 !important;
        }

        .dark-mode .bg-gradient-to-r.from-pink-50.to-rose-50 h3 {
          color: #f472b6 !important;
        }
        .dark-mode {
          background-color: #1a1025 !important;
          color: #c4b5d4 !important;
        }

        /* Main Backgrounds */
        .dark-mode .bg-white,
        .dark-mode .bg-gray-50,
        .dark-mode .bg-gray-100,
        .dark-mode .bg-gradient-to-r {
          background-color: #1a1025 !important;
        }

        /* Card Backgrounds (Plum) */
        .dark-mode .bg-gray-50\/50,
        .dark-mode .rounded-2xl.border {
          background-color: #2c1f3d !important;
        }

        /* Navbar & Footer */
        .dark-mode nav {
          background-color: rgba(26, 16, 37, 0.85) !important;
          border-color: #3f2e52 !important;
        }
        .dark-mode footer {
          background-color: #1a1025 !important;
          border-color: #3f2e52 !important;
        }

        /* Borders */
        .dark-mode .border-gray-100,
        .dark-mode .border-gray-200,
        .dark-mode .border-gray-300,
        .dark-mode .border-yellow-200,
        .dark-mode .border-pink-200 {
          border-color: #3f2e52 !important;
        }

        /* Headings (Soft White) */
        .dark-mode .text-gray-900,
        .dark-mode .text-gray-800,
        .dark-mode h1,
        .dark-mode h2,
        .dark-mode h3,
        .dark-mode .font-serif {
          color: #f8f4fc !important;
        }

        /* Body Text (Muted Lavender) */
        .dark-mode .text-gray-500,
        .dark-mode .text-gray-600,
        .dark-mode .text-gray-700,
        .dark-mode p,
        .dark-mode span {
          color: #c4b5d4 !important;
        }

        /* Subtext (Dark Lavender) */
        .dark-mode .text-gray-400,
        .dark-mode .text-xs {
          color: #7c6990 !important;
        }

        /* Accent Pink (Keeps the romance) */
        .dark-mode .text-pink-600,
        .dark-mode .text-pink-500,
        .dark-mode .text-pink-800 {
          color: #f472b6 !important;
        }
        .dark-mode .bg-pink-500,
        .dark-mode .bg-pink-600 {
          background-color: #f472b6 !important;
        }

        /* Highlights (Yellow Letter / Pink Cards) */
        .dark-mode .bg-yellow-50 {
          background-color: #2c1f3d !important;
          border-color: #f472b6 !important;
        }
        .dark-mode .text-yellow-800 {
          color: #f8f4fc !important;
        }
        .dark-mode .bg-pink-100 {
          background-color: #3f2e52 !important;
        }

        /* Buttons (Inverted for style) */
        .dark-mode .bg-gray-900 {
          background-color: #f8f4fc !important;
          color: #1a1025 !important;
        }
        .dark-mode .bg-gray-900:hover {
          background-color: #e2d9ed !important;
        }
      `}</style>
    </div>
  );
}

export default App;