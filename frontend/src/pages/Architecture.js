import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  CpuChipIcon, 
  CloudIcon, 
  ComputerDesktopIcon, 
  ArrowLongRightIcon,
  ServerIcon,
  CircleStackIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

const Architecture = () => {
  const [activeTab, setActiveTab] = useState('beginner'); // 'beginner' or 'expert'

  return (
    <div className="min-h-screen bg-black text-[#D6CFCB] p-8 overflow-y-auto">
      {/* Header Bar */}
      <div className="max-w-6xl mx-auto flex items-center justify-between border-b border-[#706677]/35 pb-6 mb-10">
        <div>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center space-x-2 text-sm text-[#A6808C] hover:text-[#CCB7AE] transition-colors mb-4 group"
          >
            <ArrowLeftIcon className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Mission Dashboard</span>
          </Link>
          <h1 className="text-4xl font-bold text-white tracking-tight">How SkySentinal Works</h1>
          <p className="text-sm text-[#706677] mt-1">Understanding the flow from outer space sensors to your screen</p>
        </div>

        {/* Tab Switcher: Beginner vs Expert */}
        <div className="flex bg-[#565264]/20 border border-[#706677]/30 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('beginner')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'beginner' 
                ? 'bg-[#A6808C] text-black shadow-md' 
                : 'text-[#D6CFCB] hover:text-white'
            }`}
          >
            Simple Flow
          </button>
          <button
            onClick={() => setActiveTab('expert')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'expert' 
                ? 'bg-[#A6808C] text-black shadow-md' 
                : 'text-[#D6CFCB] hover:text-white'
            }`}
          >
            Developer Map
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-10">

        {/* BEGINNER VIEW */}
        <AnimatePresence mode="wait">
          {activeTab === 'beginner' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* High-Level Analogy Callout */}
              <div className="bg-[#565264]/10 border-l-4 border-[#A6808C] p-6 rounded-r-xl flex items-start space-x-4">
                <InformationCircleIcon className="w-6 h-6 text-[#A6808C] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-bold text-base">The Simple Analogy 💡</h3>
                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                    Think of <strong>SkySentinal</strong> like a combined <strong>Weather App + GPS Tracker</strong>, but built for outer space:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 text-xs">
                    <div className="bg-[#000]/40 p-3 rounded-lg border border-[#706677]/25">
                      <span className="text-[#A6808C] font-bold block mb-1">1. The Source</span>
                      NOAA & CelesTrak are the satellites broadcasting raw weather and location signals.
                    </div>
                    <div className="bg-[#000]/40 p-3 rounded-lg border border-[#706677]/25">
                      <span className="text-[#A6808C] font-bold block mb-1">2. The Computer</span>
                      Our backend server is the forecasting center calculating risks and coordinates.
                    </div>
                    <div className="bg-[#000]/40 p-3 rounded-lg border border-[#706677]/25">
                      <span className="text-[#A6808C] font-bold block mb-1">3. The Screen</span>
                      The dashboard is your phone screen showing you the animated map and alerts.
                    </div>
                    <div className="bg-[#000]/40 p-3 rounded-lg border border-[#706677]/25">
                      <span className="text-[#A6808C] font-bold block mb-1">4. The Warning</span>
                      If a solar storm hits a satellite's path, you get an alert showing the vulnerability level.
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Systematic Visual Flow */}
              <div className="bg-black border border-[#706677]/35 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
                <h3 className="text-white font-bold text-lg mb-8 flex items-center space-x-2">
                  <QuestionMarkCircleIcon className="w-5 h-5 text-[#A6808C]" />
                  <span>Step-by-Step Data Journey</span>
                </h3>

                <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-6 relative">
                  
                  {/* STEP 1 */}
                  <div className="flex-1 bg-[#565264]/10 border border-[#706677]/30 rounded-xl p-5 relative flex flex-col justify-between">
                    <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#A6808C] text-black font-bold flex items-center justify-center text-sm shadow">1</span>
                    <div>
                      <div className="flex items-center space-x-2 mb-3 mt-1">
                        <CloudIcon className="w-5 h-5 text-[#A6808C]" />
                        <h4 className="text-white font-bold text-sm">Space Sensors</h4>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Sensors in orbit monitor the sun for giant solar flares. Meanwhile, radars track active satellites orbiting the Earth.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#706677]/20 text-[10px] text-[#A6808C] font-mono">
                      RAW INPUTS: Solar Flux & Orbit Elements
                    </div>
                  </div>

                  {/* CONNECTING ARROW */}
                  <div className="flex items-center justify-center md:rotate-0 rotate-90 my-2 md:my-0">
                    <ArrowLongRightIcon className="w-8 h-8 text-[#706677]/70" />
                  </div>

                  {/* STEP 2 */}
                  <div className="flex-1 bg-[#565264]/10 border border-[#706677]/30 rounded-xl p-5 relative flex flex-col justify-between">
                    <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#A6808C] text-black font-bold flex items-center justify-center text-sm shadow">2</span>
                    <div>
                      <div className="flex items-center space-x-2 mb-3 mt-1">
                        <ServerIcon className="w-5 h-5 text-[#CCB7AE]" />
                        <h4 className="text-white font-bold text-sm">Mission Control Server</h4>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Our backend server processes the raw math. It translates orbital numbers into real-world coordinates and scores how vulnerable satellites are to radiation.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#706677]/20 text-[10px] text-[#CCB7AE] font-mono">
                      CALCULATOR: Coordinates & Risk Index
                    </div>
                  </div>

                  {/* CONNECTING ARROW */}
                  <div className="flex items-center justify-center md:rotate-0 rotate-90 my-2 md:my-0">
                    <ArrowLongRightIcon className="w-8 h-8 text-[#706677]/70" />
                  </div>

                  {/* STEP 3 */}
                  <div className="flex-1 bg-[#565264]/10 border border-[#706677]/30 rounded-xl p-5 relative flex flex-col justify-between">
                    <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#A6808C] text-black font-bold flex items-center justify-center text-sm shadow">3</span>
                    <div>
                      <div className="flex items-center space-x-2 mb-3 mt-1">
                        <ComputerDesktopIcon className="w-5 h-5 text-[#A6808C]" />
                        <h4 className="text-white font-bold text-sm">Interactive Dashboard</h4>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        The website creates a live 3D Earth, charts solar trends, and maps radiation zones, making complex space physics easy for anyone to understand.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#706677]/20 text-[10px] text-[#A6808C] font-mono">
                      OUTPUT: 3D Globe & Live Risk HUD
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EXPERT VIEW */}
        <AnimatePresence mode="wait">
          {activeTab === 'expert' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              {/* Detailed Architectural Grid */}
              <div className="bg-[#000000] border border-[#706677]/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#A6808C]/5 rounded-full filter blur-3xl pointer-events-none" />
                <h3 className="text-white font-bold text-lg mb-6 flex items-center space-x-2">
                  <CommandLineIcon className="w-5 h-5 text-[#A6808C]" />
                  <span>Developer-Level Map</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                  {/* Column 1: Sources */}
                  <div className="space-y-6">
                    <div className="text-xs font-semibold text-[#A6808C] uppercase tracking-wider mb-2">1. External API Layer</div>
                    
                    <div className="bg-[#565264]/10 border border-[#706677]/40 rounded-xl p-5">
                      <div className="flex items-center space-x-3 mb-3">
                        <CloudIcon className="w-5 h-5 text-[#A6808C]" />
                        <h4 className="text-sm font-bold text-white">NOAA SWPC Endpoint</h4>
                      </div>
                      <p className="text-xs text-gray-400">
                        Streams planetary K-index (magnetic storm indices), solar flux index (F10.7), and active GOES satellite X-ray sensors.
                      </p>
                    </div>

                    <div className="bg-[#565264]/10 border border-[#706677]/40 rounded-xl p-5">
                      <div className="flex items-center space-x-3 mb-3">
                        <CircleStackIcon className="w-5 h-5 text-[#CCB7AE]" />
                        <h4 className="text-sm font-bold text-white">CelesTrak NORAD Registry</h4>
                      </div>
                      <p className="text-xs text-gray-400">
                        Hosts satellite parameters as Two-Line Elements (TLEs) updated continuously by global tracking stations.
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Backend */}
                  <div className="space-y-6 flex flex-col justify-center">
                    <div className="text-xs font-semibold text-[#A6808C] uppercase tracking-wider mb-2">2. Processing (Python Flask Gateway)</div>

                    <div className="bg-[#565264]/15 border border-[#A6808C]/50 rounded-xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <ServerIcon className="w-5 h-5 text-[#A6808C]" />
                        <h4 className="text-sm font-bold text-white">Flask Server (:5001)</h4>
                      </div>
                      <ul className="space-y-3 text-xs text-gray-300">
                        <li className="flex items-start space-x-2">
                          <span className="text-[#CCB7AE] font-bold">✓</span>
                          <span><strong>SGP4 Orbit Propagator:</strong> Runs physics equations to calculate live geographic coordinates from orbital variables.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-[#CCB7AE] font-bold">✓</span>
                          <span><strong>Space Weather Parser:</strong> Live proxies SWPC JSON feeds, handling request latency and client payload size.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Column 3: Frontend */}
                  <div className="space-y-6">
                    <div className="text-xs font-semibold text-[#A6808C] uppercase tracking-wider mb-2">3. UI Rendering (React)</div>

                    <div className="bg-[#565264]/10 border border-[#706677]/40 rounded-xl p-5">
                      <div className="flex items-center space-x-3 mb-3">
                        <CpuChipIcon className="w-5 h-5 text-[#A6808C]" />
                        <h4 className="text-sm font-bold text-white">WebGL Earth Mesh</h4>
                      </div>
                      <p className="text-xs text-gray-400">
                        Three.js canvas maps the Earth, rendering atmosphere shaders and satellite orbit lines in a coordinates space.
                      </p>
                    </div>

                    <div className="bg-[#565264]/10 border border-[#706677]/40 rounded-xl p-5">
                      <div className="flex items-center space-x-3 mb-3">
                        <ComputerDesktopIcon className="w-5 h-5 text-[#CCB7AE]" />
                        <h4 className="text-sm font-bold text-white">Visual Telemetry Panels</h4>
                      </div>
                      <p className="text-xs text-gray-400">
                        Converts processed server values into Recharts area diagrams, Kp bar charts, and interactive vector radiation maps.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Protocols Summary */}
        <div className="bg-[#565264]/10 border border-[#706677]/35 rounded-xl p-6">
          <h3 className="text-white font-bold text-base mb-4">Pipeline Protocol Directory</h3>
          <table className="w-full text-xs text-[#D6CFCB] border-collapse">
            <thead>
              <tr className="border-b border-[#706677]/35 text-[#A6808C]">
                <th className="pb-2 text-left">Signal Feed</th>
                <th className="pb-2 text-left">Data Transport</th>
                <th className="pb-2 text-left">Update Interval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#706677]/20">
              <tr>
                <td className="py-2.5 font-medium">NOAA Space Weather Scales</td>
                <td className="py-2.5">SWPC JSON → Server Fetch</td>
                <td className="py-2.5">Every 1 minute</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">NORAD Satellite TLE Parameters</td>
                <td className="py-2.5">CelesTrak Raw Text → SGP4 Engine</td>
                <td className="py-2.5">Every 6 hours</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Dashboard Telemetry Data</td>
                <td className="py-2.5">Flask REST API → Client Web Interface</td>
                <td className="py-2.5">Real-time / On demand</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Architecture;
