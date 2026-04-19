'use client'

import React from "react";
import { SplineScene } from "./splite";
import { Spotlight } from "./spotlight";
 
interface SplineSceneBasicProps {
  onEnter: () => void;
}

export function SplineSceneBasic({ onEnter }: SplineSceneBasicProps) {
  return (
    <div className="flex items-center h-screen w-full bg-[#131315] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      {/* Container */}
      <div className="flex items-center h-screen w-full relative z-10 max-w-[1400px] ml-[140px]">
        
        {/* Left section */}
        <div className="w-[40%] flex items-center justify-end">
          <div className="flex flex-col justify-center h-full max-w-[620px] ml-0">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 mb-8">
              Hi, I'm Nifail
            </h1>
            
            <div className="flex flex-col gap-4 text-neutral-300 text-base md:text-[1.1rem] leading-relaxed font-normal">
              <p>CEO & Co-Founder of QueueFree</p>
              <p>Building India's real-time healthcare queue infrastructure</p>
              <p>I design, build, and ship systems that solve real problems.</p>
            </div>
            
            <button 
              onClick={onEnter} 
              className="mt-8 px-12 py-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 w-[280px] text-center"
            >
              Chat with AI →
            </button>
          </div>
        </div>

        {/* Right section */}
        <div className="flex-1 relative h-full">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full scale-110"
          />
        </div>
      </div>
    </div>
  )
}