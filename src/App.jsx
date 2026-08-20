import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaHeart, FaMapMarkerAlt, FaMusic, FaLock, FaDice, FaLockOpen, FaCamera, FaBars, FaTimes, FaExclamationCircle } from 'react-icons/fa';

// Fix for Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ==========================
// 1. DATA (Your real details)
// ==========================
// ==========================
// 1. DATA (Multiple Photos)
// ==========================
const memories = [
  {
    id: 1,
    title: "The Day We Met",
    desc: "Santolan, Pasig City. The moment our story began.",
    // Put 2-4 photos here. You can swap these URLs with your real photo paths later.
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
      "Our first date 1.jpeg",
      "Our first date 2.jpeg",
      "Our first date 3.jpeg"
    ]
  },
  {
    id: 3,
    title: "Our First Trip",
    desc: "Adventures with you are always the best.",
    images: [
      "Our first trip 1.jpeg",
      "Our first trip 2.jpeg",
      "Our first trip 3.jpeg",
      "Our first trip 4.jpeg"
    ]
  },
];

const locations = [
  { id: 1, name: "Where We Met", lat: 14.6103, lng: 121.0675, desc: "Santolan, Pasig City. The place our story began." },
  { id: 2, name: "Our First Date", lat: 14.5603, lng: 121.0761, desc: "Bonchon, Pasig Palengke, Pasig City." },
];

const dateIdeas = [
  "Watch a movie together 🍿", "Cook a fancy dinner at home 🍝",
  "Go for a walk in the park 🌳", "Visit a new cafe ☕",
  "Play a board game 🎲", "Have a picnic by the lake 🧺",
  "Build a blanket fort 🏕️", "Stargaze at midnight 🌙"
];

// ==========================
// ==========================
// 2. COMPONENT: ALERT MODAL (FULLY CENTERED)
// ==========================
function AlertModal({ isOpen, onClose, message }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
          />

          {/* Centered Modal Card */}
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
// 3. COMPONENT: NAVBAR
// ==========================
function Navbar({ activeSection, toggleMenu }) {
  const sections = [
    { id: 'home', label: 'Home', icon: <FaHeart /> },
    { id: 'memories', label: 'Memories', icon: <FaCamera /> },
    { id: 'map', label: 'Our Map', icon: <FaMapMarkerAlt /> },
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
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
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
          onClick={toggleMenu}
          className="md:hidden text-pink-600 hover:text-pink-700 transition-colors"
          aria-label="Toggle menu"
        >
          <FaBars className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}

// ==========================
// 4. COMPONENT: MOBILE SIDEBAR
// ==========================
function MobileSidebar({ isOpen, onClose, activeSection }) {
  const sections = [
    { id: 'home', label: 'Home', icon: <FaHeart /> },
    { id: 'memories', label: 'Memories', icon: <FaCamera /> },
    { id: 'map', label: 'Our Map', icon: <FaMapMarkerAlt /> },
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
// 5. COMPONENT: SCROLL SPY
// ==========================
function ScrollSpy({ setActiveSection }) {
  useEffect(() => {
    const sections = ['home', 'memories', 'map', 'diary', 'fun', 'music'];
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
// 6. COMPONENT: ANNIVERSARY COUNTDOWN
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
// 7. MAIN APP
// ==========================
function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [diaryPassword, setDiaryPassword] = useState('');
  const [isDiaryUnlocked, setIsDiaryUnlocked] = useState(false);
  const [dateIdea, setDateIdea] = useState("Press the button for inspiration!");

  // 🔹 NEW: Alert Modal State
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const pickDateIdea = () => {
    const random = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
    setDateIdea(random);
  };

  const unlockDiary = () => {
    if (diaryPassword === '24/24/7') {
      setIsDiaryUnlocked(true);
    } else {
      setAlertMessage('Mali! Try mo "24/24/7"');
      setIsAlertOpen(true);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans scroll-smooth pt-20">
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        message={alertMessage}
      />
      <Navbar activeSection={activeSection} toggleMenu={toggleMenu} />
      <MobileSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activeSection={activeSection} />
      <ScrollSpy setActiveSection={setActiveSection} />

      <main className="max-w-4xl mx-auto px-6 pb-24 space-y-32">

        {/* ===== SECTION 1: HOME ===== */}
        <section id="home" className="pt-8 scroll-mt-20">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="text-5xl md:text-7xl font-serif text-gray-900 tracking-tight mb-4">Our Story</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              A digital space dedicated to the best chapter of my life. You, me, and the memories we are building together.
            </p>
            <div className="mt-12">
              <Countdown />
            </div>
          </motion.div>
        </section>

        {/* ===== SECTION 2: MEMORIES ===== */}
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
                  {/* Photo Collage / Multiple Images */}
                  <div className={`grid ${mem.images.length === 2 ? 'grid-cols-2' : mem.images.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-1 h-56`}>
                    {mem.images.slice(0, 4).map((img, idx) => (
                      <div key={idx} className="relative w-full h-full overflow-hidden">
                        <img
                          src={img}
                          alt={`${mem.title} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 text-lg">{mem.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{mem.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===== SECTION 3: MAP ===== */}
        <section id="map" className="scroll-mt-20">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-serif text-gray-900 mb-8 flex items-center gap-3">
              <FaMapMarkerAlt className="text-pink-500" /> Where We've Been
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm h-[400px]">
              <MapContainer center={[14.6103, 121.0675]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {locations.map((loc) => (
                  <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                    <Popup>
                      <strong>{loc.name}</strong>
                      <br />
                      <span className="text-sm text-gray-500">{loc.desc}</span>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </motion.div>
        </section>

        {/* ===== SECTION 4: SECRET DIARY ===== */}
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

        {/* ===== SECTION 5: DATE NIGHT PICKER ===== */}
        <section id="fun" className="scroll-mt-20">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-serif text-gray-900 mb-8 flex items-center gap-3">
              <FaDice className="text-pink-500" /> Date Night Decider
            </h2>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 shadow-sm text-center">
              <p className="text-xl text-gray-700 mb-6 font-medium min-h-[3rem]">{dateIdea}</p>
              <button onClick={pickDateIdea} className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition text-sm font-medium shadow-sm">
                Roll the Dice
              </button>
            </div>
          </motion.div>
        </section>

        {/* ===== SECTION 6: MUSIC ===== */}
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

      </main>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 text-center border-t border-gray-100 bg-gray-50/50">
        <p className="text-sm text-gray-400">
          Made with <FaHeart className="inline text-pink-500" /> by Paolo
        </p>
      </footer>
    </div>
  );
}

export default App;