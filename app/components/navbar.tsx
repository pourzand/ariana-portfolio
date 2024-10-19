"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './navbar.module.css';
import RotatingIcon from './RotatingIcon';

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Prints', href: '/prints' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  if (isMobile) {
    return (
      <nav className="fixed top-0 left-0 w-full flex items-center h-16 bg-white z-10 shadow-md">
        <div className="flex justify-between items-center w-full px-4">
          {navItems.map((item, index) => (
            <React.Fragment key={item.name}>
              <Link href={item.href} className="hover:text-blue-800">
                <div style={{ height: '20px' }}>
                  <Image
                    src={`/${item.name.toLowerCase()}.png`}
                    alt={item.name}
                    width={80}
                    height={20}
                    className={styles.mobileImage}
                  />
                </div>
              </Link>
              {index === 1 && (
                <div className="-mt-4 -ml-4 flex items-center" style={{ marginTop: '-2px' }}>
                  <RotatingIcon src="/icons/bow_yarn-1.png" alt="Separator" size={30} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>
    );
  }

  // Desktop version remains unchanged
  return (
    <nav className="fixed left-2 w-1/6 flex flex-col justify-center h-screen pl-2 bg-transparent z-10">
      {navItems.map((item) => (
        <Link key={item.name} href={item.href} className="hover:text-blue-800">
          <div className={styles.imageContainer}>
            <Image
              src={`/${item.name.toLowerCase()}.png`}
              alt={item.name}
              width={160}
              height={40}
              className={styles.image}
            />
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;