"use client";
import React from 'react';
import Link from 'next/link';
import AnimatedLetter from './AnimatedLetter';
import Navbar from '../components/navbar';
import Image from 'next/image';

export default function About() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main className="min-h-screen p-4 md:p-8 pt-24 md:pt-12 flex flex-col items-center">
        <Image 
          src="/about.png" 
          alt="ABOUT ME" 
          width={600} 
          height={200} 
          className="mx-auto mt-8 md:mt-4 mb-12" 
        />
        <div className="w-full max-w-4xl">
          <AnimatedLetter />
        </div>
      </main>
    </div>
  );
}