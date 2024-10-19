"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/navbar';
import Image from 'next/image';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('Sending...');
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormStatus('Failed to send message. Please try again.');
      }
    } catch (error) {
      setFormStatus('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="relative min-h-screen" style={{
      '--primary-color': '#D2042D',
      '--secondary-color': '#f0f0f0',
      '--text-color': '#D2042D',
      '--button-hover-color': '#FF0000',
      '--border-color': '#D3D3D3',
    } as React.CSSProperties}>
      <style jsx global>{`
        :root {
          --primary-color: #D2042D;
          --secondary-color: #f0f0f0;
          --text-color: #D2042D;
          --button-hover-color: #FF0000;
          --border-color: #D3D3D3;
        }
        input:hover, textarea:hover {
          background-color: #FFEEEE !important;
        }
        button:hover {
          background-color: var(--button-hover-color) !important;
        }
      `}</style>
      <Navbar />
      <main className="min-h-screen p-4 md:p-8 pt-24 md:pt-12 flex flex-col items-center">
        <Image
          src="/contact.png"
          alt="CONTACT"
          width={600}
          height={200}
          className="mx-auto mt-8 md:mt-4 mb-12"
        />
        <div className="w-full max-w-md p-8 border-4 shadow-[8px_8px_0_0_rgba(0,0,0,0.3)]" 
             style={{ 
               backgroundColor: 'var(--secondary-color)', 
               borderColor: 'var(--primary-color)' 
             }}>
          <h2 className="text-2xl font-bold mb-4 text-center  font-['Arial',sans-serif]" style={{ color: 'var(--primary-color)' }}>get in touch</h2>
          <h3 className='text-xs font mb-4 text-center'> or email me at <a className="underline hover:text-[#D2042D]" href="mailto:ariana.dideban@gmail.com">ariana.dideban@gmail.com</a> !</h3>
          <form onSubmit={handleSubmit} className="font-['Courier_New',monospace]">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 text-sm font-bold" style={{ color: 'var(--text-color)' }}>name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2"
                style={{ borderColor: 'var(--primary-color)', color: 'var(--text-color)', backgroundColor: 'white' }}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-bold" style={{ color: 'var(--text-color)' }}>email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2"
                style={{ borderColor: 'var(--primary-color)', color: 'var(--text-color)', backgroundColor: 'white' }}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 text-sm font-bold" style={{ color: 'var(--text-color)' }}>msg:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2"
                style={{ borderColor: 'var(--primary-color)', color: 'var(--text-color)', backgroundColor: 'white' }}
                rows={4}
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full py-2 px-4  font-bold transition-all active:translate-x-1 active:translate-y-1 font-['Arial',sans-serif]"
              style={{ 
                backgroundColor: 'var(--primary-color)', 
                color: 'white', 
                // borderColor: 'var(--border-color)'
              }}
            >
              send 
            </button>
          </form>
          {formStatus && <p className="mt-4 text-center" style={{ color: 'var(--text-color)' }}>{formStatus}</p>}

        </div>
      </main>
    </div>
  );
}