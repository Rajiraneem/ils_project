import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import defaultImg from '../../assets/physics.png';
import { FaArrowRight, FaBook, FaGraduationCap } from 'react-icons/fa';

// Define TypeScript interfaces
interface Subject {
  id: number;
  name: string;
  image?: string;
  board?: string;
  class_level?: number;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Subjects: React.FC = () => {  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const query = useQuery();
  const class_level = query.get('class_level');
  const stream = query.get('stream');
  const student_id = query.get('student_id');
  const student_name = localStorage.getItem('student_name') || query.get('student_name');
  const navigate = useNavigate();

  // Animation effect on page load
  useEffect(() => {
    const animateOnLoad = (): void => {
      const elementsToAnimate = document.querySelectorAll('.animate-on-load');
      elementsToAnimate.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('animate-loaded');
        }, 100 * index);
      });
    };

    animateOnLoad();
  }, []);

  useEffect(() => {
    if (!student_id) {
      alert("Student ID missing or invalid. Please go back and fill the form.");
      navigate("/");
      return;
    }

    if (class_level && stream) {
      axios.get<Subject[]>(`http://127.0.0.1:8000/api/subjects/?class_level=${class_level}&board=${stream}&student_id=${student_id}`)
        .then((response) => setSubjects(response.data))
        .catch((error) => console.error('Error fetching subjects:', error));
    }
  }, [class_level, stream, student_id, navigate]);

  const toggleSubject = (id: number): void => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const startExam = (): void => {
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }

    const queryParams = new URLSearchParams({
      student_id: student_id || '',
      subject_ids: selectedSubjects.join(',')
    }).toString();

    navigate(`/omr?${queryParams}`);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 overflow-hidden font-sans">
      {/* Animated background elements */}
      <div className="absolute top-20 left-16 w-12 h-12 text-blue-200 opacity-60 animate-pulse">
        <svg viewBox="0 0 200 200" fill="currentColor">
          <path d="M100,0 C155.228,0 200,44.772 200,100 C200,155.228 155.228,200 100,200 C44.772,200 0,155.228 0,100 C0,44.772 44.772,0 100,0 Z M100,20 C55.8172,20 20,55.8172 20,100 C20,144.183 55.8172,180 100,180 C144.183,180 180,144.183 180,100 C180,55.8172 144.183,20 100,20 Z"></path>
        </svg>
      </div>

      <div className="absolute top-16 right-20 md:right-40 w-10 h-10 text-yellow-200 opacity-60 animate-bounce">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <rect x="10" y="10" width="10" height="10" />
          <rect x="30" y="10" width="10" height="10" />
          <rect x="50" y="10" width="10" height="10" />
          <rect x="10" y="30" width="10" height="10" />
          <rect x="30" y="30" width="10" height="10" />
          <rect x="50" y="30" width="10" height="10" />
        </svg>
      </div>

      <div className="absolute top-40 right-10 md:right-40 w-14 h-14 text-purple-200 opacity-60 animate-spin-slow">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M0,0 L100,0 L50,100 Z"></path>
        </svg>
      </div>

      <div className="absolute bottom-20 left-10 md:left-20 w-16 h-16 rounded-full bg-teal-100 opacity-60 animate-float"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-blue-200 opacity-30 animate-float"></div>
      <div className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full bg-pink-200 opacity-40 animate-ping"></div>
      <div className="absolute bottom-1/4 right-1/3 w-6 h-6 rounded-full bg-yellow-200 opacity-50 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6 animate-on-load opacity-0 transition-all duration-500 ease-out transform translate-y-4">
          <div className="text-2xl font-bold text-white hover:scale-105 transition-transform">EduMaster</div>
          <div className="hidden md:flex space-x-6 text-white/80">
            <a href="#" className="hover:text-white transition-colors hover:scale-110 transition-transform">Home</a>
            <a href="#" className="hover:text-white transition-colors hover:scale-110 transition-transform">Courses</a>
            <a href="#" className="hover:text-white transition-colors hover:scale-110 transition-transform">About</a>
            <a href="#" className="hover:text-white transition-colors hover:scale-110 transition-transform">Contact</a>
          </div>
          <button className="md:hidden text-white hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="mb-6 animate-on-load opacity-0 transition-all duration-500 ease-out transform translate-y-4">
          <div className="p-1 px-3 inline-block bg-white/20 text-white font-medium rounded-full mb-2">
            Subject Selection
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Choose Your <span className="relative inline-block">
              Subjects
              <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 -z-10 rounded-sm transform -rotate-1 animate-highlight"></span>
            </span>
          </h1>
          <p className="text-xl text-white/90 mt-2">
            Class: {class_level} | Stream: {stream}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-xl mb-10 animate-on-load opacity-0 transition-all duration-700 delay-200 ease-out transform translate-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => {
              const isSelected = selectedSubjects.includes(subject.id);
              return (
                <div
                  key={subject.id}
                  onClick={() => toggleSubject(subject.id)}
                  className={`cursor-pointer bg-blue-600/80 hover:bg-blue-700/90 flex flex-col justify-center items-center rounded-xl p-6 relative transition-all duration-300 hover:scale-105 transform ${
                    isSelected ? 'ring-4 ring-yellow-300 shadow-lg' : ''
                  }`}
                >
                  <div className="w-20 h-20 flex items-center justify-center mb-4 bg-white/20 rounded-full p-2">
                    <img
                      src={subject.image || defaultImg}
                      alt={subject.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h2 className="text-xl text-white font-semibold text-center">
                    {subject.name}
                  </h2>
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={startExam}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              Start The Exam <FaArrowRight className="ml-2 animate-bounce-right" />
            </button>
          </div>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        
        @keyframes highlight {
          0% { width: 0; opacity: 0; }
          100% { width: 100%; opacity: 1; }
        }
        
        .animate-loaded {
          opacity: 1 !important;
          transform: translate(0, 0) !important;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-right {
          animation: bounce-right 1s ease-in-out infinite;
        }
        
        .animate-highlight {
          animation: highlight 1.5s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Subjects;