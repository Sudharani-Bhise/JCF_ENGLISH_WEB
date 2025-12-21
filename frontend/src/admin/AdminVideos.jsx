import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("student");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const res = await fetch(`${API_BASE}/videos`);
    const data = await res.json();
    setVideos(data.videos || []);
  };

  const addVideo = async () => {
    if (!title || !url) return alert('Title and URL are required');
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ title, description: desc, url, type })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add');
      setTitle(''); setUrl(''); setDesc('');
      fetchVideos();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeVideo = async (id) => {
    if (!confirm('Delete this video?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/videos/${id}`, {
      method: 'DELETE', headers: { Authorization: token ? `Bearer ${token}` : '' }
    });
    if (res.ok) fetchVideos(); else alert('Delete failed');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-10 text-white">
      <h1 className="text-3xl font-bold mb-8">🎥 Manage Videos</h1>

      <Motion.div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-10">
        <div className="grid gap-3 md:grid-cols-2">
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="p-3 bg-white/10 rounded" />
          <input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="Video URL (YouTube / mp4)" className="p-3 bg-white/10 rounded" />
          <select value={type} onChange={(e)=>setType(e.target.value)} className="p-3 bg-white/10 rounded">
            <option value="student">Student / Performance</option>
            <option value="teacher">Teacher</option>
            <option value="testimonial">Testimonial</option>
            <option value="performance">Performance</option>
            <option value="other">Other</option>
          </select>
          <input value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="Short description" className="p-3 bg-white/10 rounded" />
        </div>

        <div className="mt-4">
          <button onClick={addVideo} disabled={loading} className="px-6 py-2 rounded bg-pink-500">{loading? 'Adding...':'Add Video'}</button>
        </div>
      </Motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <Motion.div key={video._id} whileHover={{ scale: 1.03 }} className="bg-white/10 backdrop-blur-xl rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{video.title}</h3>
                <p className="text-sm text-gray-300">{video.type} — {video.description}</p>
              </div>

              <div className="text-right">
                <button onClick={()=>removeVideo(video._id)} className="text-red-400">Delete</button>
              </div>
            </div>

            <div className="mt-4">
              {video.url.includes('youtube') ? (
                <iframe src={video.url.replace('watch?v=','embed/')} className="w-full h-56" title={video.title}></iframe>
              ) : (
                <video src={video.url} controls className="w-full h-56 object-cover" />
              )}
            </div>
          </Motion.div>
        ))}
      </div>
    </div>
  );
}