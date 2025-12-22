import { motion as Motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

// Fallback videos if API fails
import student1 from "../assets/media/videos/student1.mp4";
import student8 from "../assets/media/videos/student8.mp4";
import student2 from "../assets/media/videos/student12.mp4";
import student3 from "../assets/media/videos/student3.mp4";
import student5 from "../assets/media/videos/student5.mp4";
import student7 from "../assets/media/videos/student7.mp4";
import student9 from "../assets/media/videos/student9.mp4";
import student6 from "../assets/media/videos/student6.mp4";
import student10 from "../assets/media/videos/student10.mp4";
import student11 from "../assets/media/videos/student11.mp4";
import student4 from "../assets/media/videos/student4.mp4";

const fallbackVideos = [
  student1,
  student2,
  student3,
  student4,
  student5,
  student6,
  student7,
  student8,
  student9,
  student10,
  student11,
];

const sectionAnim = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Students() {
  const [videos, setVideos] = useState(fallbackVideos);
  const scrollRef = useRef(null);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API_BASE}/videos?type=student`);
        const data = await res.json();
        console.log('Fetched student videos:', data.videos);
        
        if (data.videos && data.videos.length > 0) {
          // Filter videos with valid URLs
          const validApiVideos = data.videos
            .filter(v => v.url && v.url.trim())
            .map(v => ({
              url: v.url,
              title: v.title || `Video`,
              description: v.description || '',
              _id: v._id,
              fromAPI: true
            }));
          
          console.log('Valid API videos:', validApiVideos);
          
          // Combine API videos with fallback videos
          if (validApiVideos.length > 0) {
            setVideos([...validApiVideos, ...fallbackVideos]);
          } else {
            setVideos(fallbackVideos);
          }
        } else {
          setVideos(fallbackVideos);
        }
      } catch (err) {
        console.error('Failed to fetch videos:', err);
        setVideos(fallbackVideos);
      }
    };

    fetchVideos();
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <div className="w-full overflow-x-hidden bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">

      {/* ===== HEADING ===== */}
      <Motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="py-20 text-center px-6"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Our Students Speak English
          <span className="text-orange-400"> Confidently</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Real students. Real confidence. Real transformation.
        </p>
      </Motion.section>

      {/* ===== VIDEO CAROUSEL ===== */}
    <Motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="pb-24"
      >
        <div className="relative px-6 md:px-20">

          {/* LEFT ARROW */}
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 
            bg-white/20 hover:bg-white/30 
            px-4 py-2 rounded-full z-10"
          >
            ◀
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 
            bg-white/20 hover:bg-white/30 
            px-4 py-2 rounded-full z-10"
          >
            ▶
          </button>

          {/* SCROLL CONTAINER */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
          >
            {videos && videos.length > 0 ? (
              videos.map((video, index) => {
                // Handle both URL strings and video objects from API
                const videoUrl = typeof video === 'string' ? video : video.url;
                const videoTitle = typeof video === 'string' ? `Video ${index + 1}` : (video.title || `Video ${index + 1}`);
                
                // Check if URL is valid
                const isValidUrl = videoUrl && videoUrl.trim().length > 0;
                const isYoutube = isValidUrl && videoUrl.includes('youtube');
                
                return (
                  <Motion.div
                    key={`${typeof video === 'string' ? 'local' : video._id || 'api'}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    className="min-w-55 sm:min-w-80 bg-black rounded-2xl shadow-xl overflow-hidden"
                  >
                    {isYoutube ? (
                      <iframe 
                        src={videoUrl.replace('watch?v=','embed/')} 
                        className="w-full h-56" 
                        title={videoTitle}
                        allowFullScreen
                        onError={(e) => {
                          console.error('YouTube embed failed:', videoUrl);
                          e.target.style.display = 'none';
                        }}
                      ></iframe>
                    ) : isValidUrl ? (
                      <video
                        src={videoUrl}
                        controls
                        className="w-full h-56 object-cover bg-gray-800"
                        title={videoTitle}
                        onError={(e) => {
                          console.error('Video failed to load:', videoUrl);
                          e.target.style.display = 'none';
                          // Show error message
                          const parent = e.target.parentElement;
                          if (parent && !parent.querySelector('.error-msg')) {
                            const err = document.createElement('div');
                            err.className = 'error-msg w-full h-56 bg-gray-800 flex items-center justify-center text-red-400 text-sm';
                            err.textContent = 'Video failed to load';
                            parent.appendChild(err);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-56 bg-gray-800 flex items-center justify-center">
                        <p className="text-gray-400 text-sm">Invalid or missing video URL</p>
                      </div>
                    )}
                  </Motion.div>
                );
              })
            ) : (
              <div className="w-full flex items-center justify-center py-10">
                <p className="text-gray-400">No videos available</p>
              </div>
            )}
          </div>
        </div>
      </Motion.section>
    </div>
  );
}