import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoBase64, setVideoBase64] = useState(null);
  const [type, setType] = useState("student");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setError("");
      const res = await fetch(`${API_BASE}/videos`);
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setError('Failed to load videos');
    }
  };

  // Handle file upload - convert to base64
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to ~15MB for MongoDB)
      if (file.size > 15 * 1024 * 1024) {
        alert('File too large! Maximum 15MB allowed.');
        return;
      }
      
      setVideoFile(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoBase64(reader.result); // Store base64 data
        setUrl(""); // Clear URL field
      };
      reader.readAsDataURL(file);
    }
  };

  const addVideo = async () => {
    // Either URL or file upload is required
    if (!title) return alert('Title is required');
    if (!url && !videoBase64) return alert('Please either upload a video file or paste a YouTube URL');
    
    setLoading(true);
    setError("");
    const token = localStorage.getItem('adminToken');
    try {
      // Prepare the body - send file data if available, otherwise URL
      const body = {
        title, 
        description: desc, 
        type
      };
      
      if (videoBase64) {
        // File upload - send base64 data
        body.fileData = videoBase64;
      } else {
        // URL upload
        body.url = url;
      }
      
      const res = await fetch(`${API_BASE}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add');
      
      setTitle(''); 
      setUrl(''); 
      setDesc(''); 
      setVideoFile(null);
      setVideoBase64(null);
      fetchVideos(); // Refresh list
      alert('✅ Video added successfully!');
    } catch (err) {
      setError(err.message);
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeVideo = async (id) => {
    if (!confirm('Delete this video?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/videos/${id}`, {
        method: 'DELETE', 
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      if (res.ok) {
        fetchVideos();
        alert('Video deleted!');
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      setError('Failed to delete video');
      alert('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-10 text-white">
      <h1 className="text-3xl font-bold mb-8">🎥 Manage Videos</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
          {error}
        </div>
      )}

      <Motion.div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-10">
        <p className="text-sm text-yellow-300 mb-4">
          💡 <strong>Upload Student Videos:</strong> Choose a video file from your device or paste a YouTube URL
          {videoFile && <span className="text-green-400 ml-2">✓ {videoFile} selected</span>}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <input 
            value={title} 
            onChange={(e)=>setTitle(e.target.value)} 
            placeholder="Video Title (e.g., Student Demo 1)" 
            className="p-3 bg-white/10 rounded col-span-2" 
          />
          
          <div className="col-span-2 border-2 border-dashed border-pink-500/50 rounded p-4">
            <label className="cursor-pointer block text-center">
              <div className="text-lg font-semibold text-pink-400 mb-2">📁 Choose Video File</div>
              <input 
                type="file" 
                accept="video/*" 
                onChange={handleVideoUpload} 
                className="hidden" 
              />
              <p className="text-sm text-gray-400">Click to select a video from your device</p>
              <p className="text-xs text-gray-500 mt-1">(Max 15MB)</p>
            </label>
          </div>
          
          <select value={type} onChange={(e)=>setType(e.target.value)} className="p-3 bg-white/10 rounded">
            <option value="student">Student / Performance</option>
            <option value="teacher">Teacher</option>
            <option value="testimonial">Testimonial</option>
            <option value="performance">Performance</option>
            <option value="other">Other</option>
          </select>
          
          <input 
            value={desc} 
            onChange={(e)=>setDesc(e.target.value)} 
            placeholder="Short description" 
            className="p-3 bg-white/10 rounded" 
          />
          
          {!videoBase64 && (
            <>
              <p className="col-span-2 text-center text-gray-400 py-2">OR</p>
              <input 
                value={url} 
                onChange={(e)=>setUrl(e.target.value)} 
                placeholder="Paste YouTube URL (https://www.youtube.com/watch?v=VIDEO_ID)" 
                className="p-3 bg-white/10 rounded col-span-2"
              />
            </>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button 
            onClick={addVideo} 
            disabled={loading} 
            className="px-6 py-2 rounded bg-pink-500 hover:bg-pink-600 disabled:opacity-50"
          >
            {loading? 'Adding...':'Add Video'}
          </button>
          {videoBase64 && (
            <button 
              onClick={() => { setVideoBase64(null); setVideoFile(null); }} 
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-sm"
            >
              Clear File
            </button>
          )}
        </div>
      </Motion.div>

      {videos.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No videos added yet. Add your first video above!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <Motion.div key={video._id} whileHover={{ scale: 1.03 }} className="bg-white/10 backdrop-blur-xl rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{video.title}</h3>
                  <p className="text-sm text-gray-300">{video.type} — {video.description}</p>
                </div>

                <div className="text-right">
                  <button onClick={()=>removeVideo(video._id)} className="text-red-400 hover:text-red-600">Delete</button>
                </div>
              </div>

            <div className="mt-4">
              {video.url && video.url.includes('youtube') ? (
                <iframe 
                  src={video.url.replace('watch?v=','embed/')} 
                  className="w-full h-56 rounded" 
                  title={video.title}
                  allowFullScreen
                ></iframe>
              ) : video.url ? (
                // Handle base64 encoded video data
                <video 
                  src={video.url} 
                  controls 
                  className="w-full h-56 rounded bg-gray-800"
                  title={video.title}
                ></video>
              ) : (
                <div className="w-full h-56 bg-gray-800 rounded flex items-center justify-center text-gray-400">
                  <p>No valid video</p>
                </div>
              )}
            </div>
            </Motion.div>
          ))}
        </div>
      )}
    </div>
  );
}