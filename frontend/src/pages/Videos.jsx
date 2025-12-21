import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export default function Videos() {
  const [studentVideos, setStudentVideos] = useState([]);
  const [teacherVideos, setTeacherVideos] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/videos?type=student`).then(r=>r.json()).then(d=>setStudentVideos(d.videos||[])).catch(()=>{});
    fetch(`${API_BASE}/videos?type=teacher`).then(r=>r.json()).then(d=>setTeacherVideos(d.videos||[])).catch(()=>{});
  }, []);

  return (
    <div className="w-full bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-20 px-6 md:px-20">
      <h1 className="text-4xl font-extrabold mb-8">Students Performance Videos</h1>
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {studentVideos.length === 0 ? (<p className="text-gray-300">No student videos yet</p>) : (
          studentVideos.map(v => (
            <div key={v._id} className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-gray-300 mb-3">{v.description}</p>
              {v.url.includes('youtube') ? (
                <iframe src={v.url.replace('watch?v=','embed/')} className="w-full h-56" title={v.title}></iframe>
              ) : (
                <video src={v.url} controls className="w-full h-56 object-cover" />
              )}
            </div>
          ))
        )}
      </div>

      <h1 className="text-4xl font-extrabold mb-8">Teacher / Testimonial Videos</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {teacherVideos.length === 0 ? (<p className="text-gray-300">No teacher videos yet</p>) : (
          teacherVideos.map(v => (
            <div key={v._id} className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-gray-300 mb-3">{v.description}</p>
              {v.url.includes('youtube') ? (
                <iframe src={v.url.replace('watch?v=','embed/')} className="w-full h-56" title={v.title}></iframe>
              ) : (
                <video src={v.url} controls className="w-full h-56 object-cover" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
