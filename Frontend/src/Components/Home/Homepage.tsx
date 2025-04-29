import React, { Fragment } from 'react';
import logo from '../../assets/logo1.png';
import kids from '../../assets/kids1.png';
import circle from '../../assets/background-circle.png';    
import double from '../../assets/small-circle1.png';
import { Link } from 'react-router-dom';
const Homepage = () => {
    return (
        <Fragment>
            <div className="h-[100vh] w-full sm:h-screen flex flex-col md:flex-row overflow-hidden sm:bg-white md:bg-[#999adb] lg:bg-white">

                {/* Left Section */}
                <div className="w-full md:w-1/2 md:ml-[250px] p-6 md:p-12 flex flex-col justify-center items-center md:items-start text-center md:text-left mt-[0px]">
                    <img src={logo} alt="Logo" className="w-[125px] mb-[55px]" />

                    <h1 className="text-4xl md:text-5xl font-bold font-[Fredoka]   text-[#01acef]">
                        TALENS <span className="text-[#2d2f93] ">COMPASS</span>
                    </h1>

                    <p className="font-[Fredoka] text-lg mt-4 max-w-md">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>

                    <Link to="/form">
                        <button className="font-[Fredoka] text-lg bg-[#2d2f93] text-white mt-6 rounded-lg px-6 py-3 shadow-md hover:bg-[#01acef] cursor-pointer  ">
                            Start Now
                        </button>
                    </Link>

                </div>

                {/* Right Section */}

                <div className="w-full md:w-1/2 relative sm:flex items-center sm:justify-center md:justify-end overflow-hidden">
                    <img src={double} alt="" className=" hidden sm:block sm:h-[80px] sm:mt-[-420px] sm:mr-[-225px] " />
                    {/* Background Circle */}
                    <img
                        src={circle}
                        alt="Circle"
                        className=" w-[00px] mb-[38px] h-auto sm:block sm:absolute sm:w-[600px] sm:mb-[-400px] sm:mr-[-132px] z-0  "
                    />

                    {/* Kids Image */}
                    <img
                        src={kids}
                        alt="Kids"
                        className="sm:w-[450px] sm:mb-[-350px] mr-[-50px] relative z-10 mt-[140px] "
                    />

                </div>


            </div>
        </Fragment>
    );
};

export default Homepage;
