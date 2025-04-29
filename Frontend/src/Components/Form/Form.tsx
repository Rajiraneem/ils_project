import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaUser, FaSchool, FaPhone, FaHome, FaBook, FaUserGraduate } from 'react-icons/fa';

// Define TypeScript interfaces
interface FormData {
  name: string;
  school: string;
  fatherName: string;
  motherName: string;
  address: string;
  favouriteSubject: string;
  classLevel: string;
  stream: string;
  fatherOccupation: string;
  motherOccupation: string;
  phone: string;
}

interface FormResponse {
  id: number;
  name: string;
  classLevel: string;
  stream: string;
  [key: string]: any; // For any other fields that might be returned
}

interface AnimationElement extends Element {
  classList: DOMTokenList;
}

const Form: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    school: '',
    fatherName: '',
    motherName: '',
    address: '',
    favouriteSubject: '',
    classLevel: '',
    stream: '',
    fatherOccupation: '',
    motherOccupation: '',
    phone: '',
  });

  // Animation effect on page load
  useEffect(() => {
    const animateOnLoad = (): void => {
      const elementsToAnimate = document.querySelectorAll<AnimationElement>('.animate-on-load');
      elementsToAnimate.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('animate-loaded');
        }, 100 * index);
      });
    };

    animateOnLoad();
  }, []);

  const inputClass = "mt-2 p-4 text-lg sm:text-xl text-white bg-transparent placeholder-white border-0 border-b-2 border-white/60 focus:outline-none focus:ring-0 focus:border-white transition-all duration-300 w-full";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (): Promise<void> => {
    // ✅ Validation
    if (!formData.classLevel || !formData.stream) {
      alert("Please select both Class and Stream before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/submit-form/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result: FormResponse = await response.json();
      
        // ✅ Save to localStorage
        localStorage.setItem('student_id', result.id.toString());
        localStorage.setItem('student_class', result.classLevel);
        localStorage.setItem('student_stream', result.stream);
        localStorage.setItem('student_name', result.name);
      
        // ✅ Navigate with query parameters using ID instead of name
        navigate(`/subjects?class_level=${result.classLevel}&stream=${result.stream}&student_id=${result.id}`);
      } else {
        const error = await response.json();
        alert("Submission failed: " + JSON.stringify(error));
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
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
            Student Registration
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Fill Out Your <span className="relative inline-block">
              Information
              <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 -z-10 rounded-sm transform -rotate-1 animate-highlight"></span>
            </span>
          </h1>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-xl mb-10 animate-on-load opacity-0 transition-all duration-700 delay-200 ease-out transform translate-y-4">
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-10">
            {/* Left Column */}
            <div className="flex flex-col space-y-6">
              <div className="transition-all duration-300 hover:translate-y-1 relative">
                <div className="absolute left-0 top-6 text-white/70"><FaUser /></div>
                <input 
                  name="name" 
                  onChange={handleChange} 
                  value={formData.name} 
                  type="text" 
                  placeholder="Name" 
                  className={`${inputClass} pl-7`} 
                />
              </div>
              <div className="transition-all duration-300 hover:translate-y-1 relative">
                <div className="absolute left-0 top-6 text-white/70"><FaSchool /></div>
                <input 
                  name="school" 
                  onChange={handleChange} 
                  value={formData.school} 
                  type="text" 
                  placeholder="School" 
                  className={`${inputClass} pl-7`} 
                />
              </div>
              <div className="transition-all duration-300 hover:translate-y-1 relative">
                <div className="absolute left-0 top-6 text-white/70"><FaUser /></div>
                <input 
                  name="fatherName" 
                  onChange={handleChange} 
                  value={formData.fatherName} 
                  type="text" 
                  placeholder="Father's Name" 
                  className={`${inputClass} pl-7`} 
                />
              </div>
              <div className="transition-all duration-300 hover:translate-y-1 relative">
                <div className="absolute left-0 top-6 text-white/70"><FaUser /></div>
                <input 
                  name="motherName" 
                  onChange={handleChange} 
                  value={formData.motherName} 
                  type="text" 
                  placeholder="Mother's Name" 
                  className={`${inputClass} pl-7`} 
                />
              </div>
              <div className="transition-all duration-300 hover:translate-y-1 relative">
                <div className="absolute left-0 top-6 text-white/70"><FaHome /></div>
                <input 
                  name="address" 
                  onChange={handleChange} 
                  value={formData.address} 
                  type="text" 
                  placeholder="Address" 
                  className={`${inputClass} pl-7`} 
                />
              </div>
              <div className="transition-all duration-300 hover:translate-y-1 relative">
                <div className="absolute left-0 top-6 text-white/70"><FaBook /></div>
                <input 
                  name="favouriteSubject" 
                  onChange={handleChange} 
                  value={formData.favouriteSubject} 
                  type="text" 
                  placeholder="Your Favourite Subject" 
                  className={`${inputClass} pl-7`} 
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col space-y-6">
              <div className="transition-all duration-300 hover:translate-y-1 relative">
                <div className="absolute left-0 top-6 text-white/70"><FaUserGraduate /></div>
                <select 
                  name="classLevel" 
                  onChange={handleChange} 
                  value={formData.classLevel} 
                  className={`${inputClass} pl-7`} 
                  required
                >
                  <option className='bg-blue-500 text-white' value=''>Select Class</option>
                  {[5, 6, 7, 8, 9, 10, 11, 12].map(cls => (
                    <option key={cls} className='bg-blue-500 text-white' value={cls.toString()}>{cls}</option>
                  ))}
                </select>
              </div>

              <div className="transition-all duration-300 hover:translate-y-1 relative">
                <div className="absolute left-0 top-6 text-white/70"><FaUserGraduate /></div>
                <select 
                  name="stream" 
                  onChange={handleChange} 
                  value={formData.stream} 
                  className={`${inputClass} pl-7`}
                >
                  <option className='bg-blue-500 text-white' value=''>Select Stream</option>
                  <option className='bg-blue-500 text-white' value='CBSE'>CBSE</option>
                  <option className='bg-blue-500 text-white' value='STATE'>STATE</option>
                </select>
              </div>

              <div className="transition-all duration-300 hover:translate-y-1 relative">
                <div className="absolute left-0 top-6 text-white/70"><FaUser /></div>
                <input 
                  name="fatherOccupation" 
                  onChange={handleChange} 
                  value={formData.fatherOccupation} 
                  type="text" 
                  placeholder="Father's Occupation" 
                  className={`${inputClass} pl-7`} 
                />
              </div>
              <div className="transition-all duration-300 hover:translate-y-1 relative">
                <div className="absolute left-0 top-6 text-white/70"><FaUser /></div>
                <input 
                  name="motherOccupation" 
                  onChange={handleChange} 
                  value={formData.motherOccupation} 
                  type="text" 
                  placeholder="Mother's Occupation" 
                  className={`${inputClass} pl-7`} 
                />
              </div>
              <div className="transition-all duration-300 hover:translate-y-1 relative">
                <div className="absolute left-0 top-6 text-white/70"><FaPhone /></div>
                <input 
                  name="phone" 
                  onChange={handleChange} 
                  value={formData.phone} 
                  type="text" 
                  placeholder="Phone Number" 
                  className={`${inputClass} pl-7`} 
                />
              </div>

              <button
                onClick={handleSubmit}
                className="mt-8 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                Submit The Details <FaArrowRight className="ml-2 animate-bounce-right" />
              </button>
            </div>
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
        
        @keyframes wave {
          0% { transform: translateY(10px); }
          50% { transform: translateY(0px); }
          100% { transform: translateY(10px); }
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
        
        .animate-wave {
          animation: wave 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Form;