import React, { useEffect } from 'react';
import { FaArrowRight, FaPhone, FaGraduationCap, FaUsers } from 'react-icons/fa';
import kids1 from "../../assets/person.jpg";
import { Link } from 'react-router-dom';
import logo from "../../assets/TaLens_logo-1-removebg-preview.png";

// Define TypeScript interfaces
interface AnimationElement extends Element {
  classList: DOMTokenList;
}

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
  textColor: string;
}

const Landingpage: React.FC = () => {
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

  // Stats data
  const studentStats: StatItem[] = [
    {
      icon: <FaUsers className="w-5 h-5" />,
      label: "Active Students",
      value: "15,000+",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      icon: <FaGraduationCap className="w-5 h-5" />,
      label: "Graduates",
      value: "34,000+",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden font-sans">
      {/* Animated background elements */}
      <div className="absolute top-20 left-16 w-12 h-12 text-blue-400 opacity-60 animate-pulse">
        <svg viewBox="0 0 200 200" fill="currentColor">
          <path d="M100,0 C155.228,0 200,44.772 200,100 C200,155.228 155.228,200 100,200 C44.772,200 0,155.228 0,100 C0,44.772 44.772,0 100,0 Z M100,20 C55.8172,20 20,55.8172 20,100 C20,144.183 55.8172,180 100,180 C144.183,180 180,144.183 180,100 C180,55.8172 144.183,20 100,20 Z"></path>
        </svg>
      </div>

      <div className="absolute top-16 right-20 md:right-40 w-10 h-10 text-red-400 opacity-60 animate-bounce">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <rect x="10" y="10" width="10" height="10" />
          <rect x="30" y="10" width="10" height="10" />
          <rect x="50" y="10" width="10" height="10" />
          <rect x="10" y="30" width="10" height="10" />
          <rect x="30" y="30" width="10" height="10" />
          <rect x="50" y="30" width="10" height="10" />
        </svg>
      </div>

      <div className="absolute top-40 right-10 md:right-40 w-14 h-14 text-purple-400 opacity-60 animate-spin-slow">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M0,0 L100,0 L50,100 Z"></path>
        </svg>
      </div>

      <div className="absolute bottom-20 left-10 md:left-20 w-16 h-16 rounded-full bg-teal-100 opacity-60 animate-float"></div>

      {/* Additional decorative elements */}
      <div className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full bg-pink-200 opacity-40 animate-ping"></div>
      <div className="absolute bottom-1/4 right-1/3 w-6 h-6 rounded-full bg-yellow-200 opacity-50 animate-pulse"></div>

      <div className="hidden md:block absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-blue-200 opacity-30 animate-float"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">

        <div className="flex flex-col md:flex-row items-center justify-between pt-4 md:pt-12">
          {/* Left content */}
          <div className="w-full md:w-1/2 lg:pr-12 mb-12 md:mb-0 order-2 md:order-1">
            <div className="">
             <img src={logo} alt="TaLens Logo" className='w-[250px]'/>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mt-2 leading-tight animate-on-load opacity-0 transition-all duration-700 ease-out transform translate-y-4">
              Learn Skills From <br /> Our <span className="relative inline-block">
                Top Instructors
                <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-300 -z-10 rounded-sm transform -rotate-1 animate-highlight"></span>
              </span>
            </h1>

            <p className="text-gray-600 mt-6 text-lg leading-relaxed max-w-lg animate-on-load opacity-0 transition-all duration-700 delay-300 ease-out transform translate-y-4">
              Unlock your potential with expert-led courses designed to elevate your skills and advance your career. Join thousands of successful students who've transformed their future with us.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mt-8 mb-8 animate-on-load opacity-0 transition-all duration-700 delay-500 ease-out transform translate-y-4">
              {studentStats.map((stat, index) => (
                <div key={index} className="flex items-center hover:scale-105 transition-transform">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center ${stat.textColor} mr-3 animate-pulse-slow`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <p className="text-gray-800 font-bold text-xl animate-count" data-value={stat.value.replace(/\D/g, '')}>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-8 animate-on-load opacity-0 transition-all duration-700 delay-700 ease-out transform translate-y-4">
             <Link to="/form">
                <div className=" sm:w-auto w-[250px] cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105 transform">
                    LET'S START <FaArrowRight className="ml-2 animate-bounce-right" />
                  </div>
             </Link>
             
              <div className="flex items-center w-full sm:w-auto mt-4 sm:mt-0 hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 shadow-md animate-wiggle">
                  <FaPhone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Have any questions?</p>
                  <p className="text-gray-800 font-semibold">993-00-67777</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="w-full md:w-1/2 relative order-1 md:order-2 mb-8 md:mb-0 animate-on-load opacity-0 transition-all duration-1000 ease-out transform translate-x-4">
            {/* Yellow splash background */}
            <div className="absolute -bottom-10 -right-20 w-64 h-64 bg-yellow-400 rounded-tl-[60%] rounded-tr-[40%] rounded-bl-[30%] rounded-br-[50%] -z-10 opacity-90 animate-morph"></div>

            {/* Purple blob */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-300 rounded-tl-[40%] rounded-tr-[60%] rounded-bl-[50%] rounded-br-[30%] -z-10 opacity-50 animate-morph-reverse"></div>

            {/* Instructor image with frame */}
            <div className="relative z-10 hover:scale-105 transition-transform duration-500 transform">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 opacity-10 rounded-2xl transform rotate-3 animate-pulse-slow"></div>
              <div className="relative p-2 md:p-4 bg-white rounded-2xl shadow-2xl transform -rotate-2 transition-all hover:rotate-0 hover:shadow-blue-900/20">
                <img
                  src={kids1}
                  alt="Professional instructor"
                  className="w-full h-auto object-cover rounded-xl animate-image-fade-in transition-opacity"
                />

                {/* Achievement badge */}
                <div className="absolute -top-6 -right-6 bg-white rounded-full p-2 shadow-lg animate-float-badge">
                  <div className="bg-yellow-400 rounded-full p-2 w-12 h-12 flex items-center justify-center animate-spin-slow-reverse">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats badges */}
            <div className="absolute top-1/4 -left-6 bg-white rounded-lg shadow-xl p-4 flex items-center z-20 transform -translate-y-1/2 hover:scale-110 transition-transform animate-slide-in-left">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-500 mr-3 animate-pulse-slow">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Total Students</p>
                <p className="text-gray-800 font-bold text-xl">15K+</p>
              </div>
            </div>

            <div className="absolute bottom-1/4 -right-6 bg-white rounded-lg shadow-xl p-4 flex items-center z-20 hover:scale-110 transition-transform animate-slide-in-right">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mr-3 animate-pulse-slow">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Graduates</p>
                <p className="text-gray-800 font-bold text-xl">34K+</p>
              </div>
            </div>

            {/* Course card preview */}
            <div className="absolute -bottom-4 left-4 bg-white rounded-lg shadow-xl p-3 z-20 hidden md:block hover:scale-110 transition-transform animate-slide-in-bottom">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2 animate-pulse-slow">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-800 text-xs font-medium">New Course</p>
                  <p className="text-gray-500 text-xs">Just launched</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes float-badge {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        
        @keyframes bounce-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes morph {
          0% { border-radius: 60% 40% 30% 50% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 50% / 60% 30% 70% 40%; }
        }
        
        @keyframes morph-reverse {
          0% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 60% 40% 30% 50% / 60% 30% 70% 40%; }
          100% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        
        @keyframes highlight {
          0% { width: 0; opacity: 0; }
          100% { width: 100%; opacity: 1; }
        }
        
        @keyframes image-fade-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes slide-in-left {
          0% { transform: translateX(-50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-in-right {
          0% { transform: translateX(50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-in-bottom {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
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
        
        .animate-float-badge {
          animation: float-badge 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 10s linear infinite;
        }
        
        .animate-bounce-right {
          animation: bounce-right 1s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        
        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }
        
        .animate-morph-reverse {
          animation: morph-reverse 8s ease-in-out infinite;
        }
        
        .animate-highlight {
          animation: highlight 1.5s ease-out forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }
        
        .animate-image-fade-in {
          animation: image-fade-in 1.5s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out forwards;
          animation-delay: 0.8s;
          opacity: 0;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out forwards;
          animation-delay: 1s;
          opacity: 0;
        }
        
        .animate-slide-in-bottom {
          animation: slide-in-bottom 1s ease-out forwards;
          animation-delay: 1.2s;
          opacity: 0;
        }
        
        .animate-wave {
          animation: wave 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Landingpage;