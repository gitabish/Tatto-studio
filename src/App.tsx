/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, FormEvent } from 'react';
import { FAQ } from './components/FAQ';

// Declaring the SplitText utility component to render splitted characters declaratively 
interface SplitTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  text: string;
  className?: string;
}

const SplitText: React.FC<SplitTextProps> = ({ as: Component = 'span', text, className = '' }) => {
  return (
    <Component className={`${className} split-chars`}>
      {text.split('').map((char, index) => (
        <span key={index} className="char">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Component>
  );
};

export default function App() {
  const [showMobileBook, setShowMobileBook] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Form handling
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you for your submission! We will contact you within 24 hours.');
    e.currentTarget.reset();
  };

  useEffect(() => {
    // Scroll restoration and initial scroll orientation
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // IntersectionObserver scroll reveal and character animations
    const observerOptions = { threshold: 0.1 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if (e.target.classList.contains('reveal')) {
            e.target.classList.add('visible');
            const chars = e.target.querySelectorAll('.char');
            if (chars.length) {
              let frame = 0;
              const animate = () => {
                if (frame < chars.length) {
                  chars[frame].classList.add('visible');
                  frame++;
                  requestAnimationFrame(animate);
                }
              };
              animate();
            }
          }
          if (e.target.classList.contains('reveal-card')) {
            const parent = e.target.parentElement;
            if (parent) {
              const idx = Array.from(parent.children).indexOf(e.target);
              setTimeout(() => e.target.classList.add('visible'), idx * 100);
            } else {
              e.target.classList.add('visible');
            }
          }
          io.unobserve(e.target);
        }
      });
    }, observerOptions);

    const reveals = document.querySelectorAll('.reveal');
    const revealCards = document.querySelectorAll('.reveal-card');
    reveals.forEach(el => io.observe(el));
    revealCards.forEach(el => io.observe(el));

    // Animate hero title characters immediately on load
    const heroTitle = document.getElementById('hero-title-group');
    if (heroTitle) {
      const heroChars = heroTitle.querySelectorAll('.char');
      if (heroChars.length) {
        let frame = 0;
        const animateHero = () => {
          if (frame < heroChars.length) {
            heroChars[frame].classList.add('visible');
            frame++;
            requestAnimationFrame(animateHero);
          }
        };
        // Small delay to let initial mount painting finish
        setTimeout(animateHero, 150);
      }
    }

    // Defensive fallback timer to guarantee element visibility in sandbox or preview screen scales
    const fallbackTimeoutId = setTimeout(() => {
      reveals.forEach(el => el.classList.add('visible'));
      revealCards.forEach(el => el.classList.add('visible'));
      const chars = document.querySelectorAll('.char');
      chars.forEach(el => el.classList.add('visible'));
    }, 500);

    // Handle Mobile Book Nav Display
    const updateMobileNav = () => {
      setShowMobileBook(window.innerWidth <= 809);
    };
    updateMobileNav();
    window.addEventListener('resize', updateMobileNav);

    // Optimize animations - reduce repaints scroll hook
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 600);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('resize', updateMobileNav);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(fallbackTimeoutId);
    };
  }, []);

  return (
    <>
      {/* NAV */}
      <nav id="navbar-main">
        <div className="nav-logo" id="nav-brand-title" onClick={() => {
          document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
          setMobileMenuOpen(false);
        }} style={{ cursor: 'pointer' }}>Tattoo Studio</div>
        <div className="nav-links" id="nav-menu-links">
          <a href="#about" id="nav-link-about">About</a>
          <a href="#artists" id="nav-link-artists">Artists</a>
          <a href="#services" id="nav-link-services">Services</a>
          <a href="#gallery" id="nav-link-gallery">Gallery</a>
          <a href="#reviews" id="nav-link-reviews">Reviews</a>
          <a href="#faq" id="nav-link-faq">FAQ</a>
          <a href="#contact" id="nav-link-contact">Contact</a>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }} id="nav-cta-group">
          <div className="nav-phone" id="nav-phone-display">
            <span>📞 07700 900077</span>
          </div>
          <button 
            className="nav-book" 
            id="nav-book-button"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            BOOK NOW
          </button>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }} className="mobile-only-controls" id="mobile-nav-controls">
          <button 
            className="mobile-book" 
            id="mobile-nav-book-button"
            style={{ 
              display: showMobileBook ? 'block' : 'none', 
              background: 'var(--white)', 
              color: '#000', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '4px', 
              cursor: 'pointer', 
              fontWeight: 500 
            }} 
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            BOOK
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="nav-hamburger"
            id="nav-hamburger-button"
            aria-label="Toggle navigation menu"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--white)',
              padding: '6px',
              display: 'none', // Set with media queries in index.css
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 110,
            }}
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
        id="mobile-menu-drawer"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'rgba(23, 18, 14, 0.98)',
          backdropFilter: 'blur(15px)',
          zIndex: 95,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }} id="mobile-menu-links">
          <a 
            href="#about" 
            style={{ fontSize: '24px', fontFamily: 'Forum, serif', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--white)' }}
            onClick={(e) => {
              setMobileMenuOpen(false);
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            About
          </a>
          <a 
            href="#artists" 
            style={{ fontSize: '24px', fontFamily: 'Forum, serif', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--white)' }}
            onClick={(e) => {
              setMobileMenuOpen(false);
              e.preventDefault();
              document.getElementById('artists')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Artists
          </a>
          <a 
            href="#services" 
            style={{ fontSize: '24px', fontFamily: 'Forum, serif', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--white)' }}
            onClick={(e) => {
              setMobileMenuOpen(false);
              e.preventDefault();
              document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Services
          </a>
          <a 
            href="#gallery" 
            style={{ fontSize: '24px', fontFamily: 'Forum, serif', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--white)' }}
            onClick={(e) => {
              setMobileMenuOpen(false);
              e.preventDefault();
              document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Gallery
          </a>
          <a 
            href="#reviews" 
            style={{ fontSize: '24px', fontFamily: 'Forum, serif', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--white)' }}
            onClick={(e) => {
              setMobileMenuOpen(false);
              e.preventDefault();
              document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Reviews
          </a>
          <a 
            href="#faq" 
            style={{ fontSize: '24px', fontFamily: 'Forum, serif', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--white)' }}
            onClick={(e) => {
              setMobileMenuOpen(false);
              e.preventDefault();
              document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            FAQ
          </a>
          <a 
            href="#contact" 
            style={{ fontSize: '24px', fontFamily: 'Forum, serif', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--white)' }}
            onClick={(e) => {
              setMobileMenuOpen(false);
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Contact
          </a>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} id="mobile-menu-footer">
          <a href="tel:07700900077" style={{ color: 'var(--gray)', fontSize: '16px' }}>📞 07700 900077</a>
          <button 
            style={{ 
              background: 'var(--white)', 
              color: '#000', 
              border: 'none', 
              padding: '12px 32px', 
              borderRadius: '4px', 
              fontWeight: 500, 
              fontSize: '16px',
              cursor: 'pointer' 
            }}
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            BOOK AN APPOINTMENT
          </button>
        </div>
      </div>

      {/* HERO */}
      <header id="top">
        <div className="hero-ticker" id="ticker-grid">
          <div className="ticker-col col1" id="ticker-column-1">
            <div className="ticker-img" id="ticker-img-1">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/1338730/pexels-photo-1338730.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop" alt="Tattoo work" />
            </div>
            <div className="ticker-img" id="ticker-img-2">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/2177019/pexels-photo-2177019.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop" alt="Tattoo work" />
            </div>
            <div className="ticker-img" id="ticker-img-3">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/325152/pexels-photo-325152.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop" alt="Tattoo work" />
            </div>
          </div>
          <div className="ticker-col col2" id="ticker-column-2">
            <div className="ticker-img" id="ticker-img-4">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088473/pexels-photo-5088473.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop" alt="Tattoo work" />
            </div>
            <div className="ticker-img" id="ticker-img-5">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088486/pexels-photo-5088486.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop" alt="Tattoo work" />
            </div>
            <div className="ticker-img" id="ticker-img-6">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088495/pexels-photo-5088495.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop" alt="Tattoo work" />
            </div>
          </div>
          <div className="ticker-col col3" id="ticker-column-3">
            <div className="ticker-img" id="ticker-img-7">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088499/pexels-photo-5088499.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop" alt="Tattoo work" />
            </div>
            <div className="ticker-img" id="ticker-img-8">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088511/pexels-photo-5088511.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop" alt="Tattoo work" />
            </div>
            <div className="ticker-img" id="ticker-img-9">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088512/pexels-photo-5088512.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop" alt="Tattoo work" />
            </div>
          </div>
          <div className="ticker-col col4" id="ticker-column-4">
            <div className="ticker-img" id="ticker-img-10">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088513/pexels-photo-5088513.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop" alt="Tattoo work" />
            </div>
            <div className="ticker-img" id="ticker-img-11">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/9937060/pexels-photo-9937060.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop" alt="Tattoo work" />
            </div>
            <div className="ticker-img" id="ticker-img-12">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/399619/pexels-photo-399619.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop" alt="Tattoo work" />
            </div>
          </div>
        </div>
        <div className="hero-overlay" id="hero-interactive-overlay">
          <div className="hero-title" id="hero-title-group">
            <SplitText as="h1" className="hero-h1" text="Professional Tattoos by Experts" />
            <p className="hero-sub" id="hero-descriptor-sub">Expert artists. Unique designs. World-class studio experience.</p>
          </div>
          <div className="hero-btns" id="hero-actions">
            <button className="btn-primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} id="cta-book-consult">
              BOOK A CONSULTATION
            </button>
            <button className="btn-outline" onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })} id="cta-browse-gallery">
              BROWSE GALLERY
            </button>
          </div>
        </div>
        <div className="hero-info" id="hero-banner-info">
          <div className="hero-info-row" id="hero-info-row-loc">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <p><strong>Location:</strong> Studio 4B, 12 Garden Walk, Shoreditch, London</p>
          </div>
          <div className="hero-info-row" id="hero-info-row-hours">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <p><strong>Hours:</strong> Monday - Sunday, 8am - 10pm</p>
          </div>
        </div>
      </header>

      {/* ABOUT */}
      <section className="about" id="about">
        <div className="about-inner reveal" id="about-inner-container">
          <div className="about-left" id="about-information-content">
            <div className="about-meta" id="about-metrics-meta">
              <p className="label">ABOUT US</p>
              <SplitText as="h2" className="h2-heading" text="Premier Tattoo Studio" />
            </div>
            <p className="body-text" id="about-narrative-p">
              With over a decade of experience, our Tattoo Studio brings together the most talented tattoo artists in the industry. We specialize in custom designs, from intricate fine-line work to bold color realism, geometric patterns, and hand-poked styles. Every design tells a story, and our artists take the time to understand your vision, ensuring each piece is as unique as you are. From the first consultation to the final touch-up, we prioritize cleanliness, comfort, and creative collaboration. Whether it's your first tattoo or your fiftieth, you'll leave with something extraordinary.
            </p>
            <a href="#contact" className="link-text" id="about-cta-link-to-contact">Start Your Journey →</a>
          </div>
          <div className="about-img" id="about-featured-img">
            <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/7005729/pexels-photo-7005729.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop" alt="Tattoo artist working on client hand" />
          </div>
        </div>
      </section>

      {/* ARTISTS */}
      <section className="artists" id="artists">
        <div className="artists-inner reveal" id="artists-inner-container">
          <div className="section-header" id="artists-header-meta">
            <p className="label">OUR TEAM</p>
            <SplitText as="h2" className="h2-heading" text="Award-Winning Artists" />
          </div>
          <div className="artists-grid" id="artists-cards-grid">
            <a href="#" className="artist-card reveal-card" id="artist-card-kevin">
              <div className="artist-img">
                <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/17505625/pexels-photo-17505625.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Artist Kevin" />
              </div>
              <div className="artist-info">
                <div className="artist-name-row">
                  <div>
                    <h3 className="artist-name">Kevin</h3>
                    <p className="artist-style">Fine Line & Minimalist</p>
                  </div>
                  <span className="learn-more">→</span>
                </div>
              </div>
            </a>
            <a href="#" className="artist-card reveal-card" id="artist-card-jen">
              <div className="artist-img">
                <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/20519299/pexels-photo-20519299.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Artist Jen" />
              </div>
              <div className="artist-info">
                <div className="artist-name-row">
                  <div>
                    <h3 className="artist-name">Jen</h3>
                    <p className="artist-style">Color & Realism</p>
                  </div>
                  <span className="learn-more">→</span>
                </div>
              </div>
            </a>
            <a href="#" className="artist-card reveal-card" id="artist-card-andy">
              <div className="artist-img">
                <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/34920726/pexels-photo-34920726.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Artist Andy" />
              </div>
              <div className="artist-info">
                <div className="artist-name-row">
                  <div>
                    <h3 className="artist-name">Andy</h3>
                    <p className="artist-style">Geometric & Dotwork</p>
                  </div>
                  <span className="learn-more">→</span>
                </div>
              </div>
            </a>
          </div>
          <a href="#" className="view-all-link" style={{ marginTop: '20px', display: 'block' }} id="artists-view-all-link">
            View All Artists →
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <div className="services-inner reveal" id="services-inner-container">
          <div className="section-header" id="services-header-meta">
            <p className="label">WHAT WE OFFER</p>
            <SplitText as="h2" className="h2-heading" text="Our Services" />
          </div>
          <div className="services-grid" id="services-grid-list">
            <div className="service-card reveal-card" id="service-card-custom">
              <div className="service-img">
                <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/1338730/pexels-photo-1338730.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Custom Tattoos" />
              </div>
              <div className="service-row">
                <h3 className="service-name">Custom Tattoos</h3>
              </div>
            </div>
            <div className="service-card reveal-card" id="service-card-coverup">
              <div className="service-img">
                <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/2126124/pexels-photo-2126124.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Cover-Ups" />
              </div>
              <div className="service-row">
                <h3 className="service-name">Cover-Ups</h3>
              </div>
            </div>
            <div className="service-card reveal-card" id="service-card-touchup">
              <div className="service-img">
                <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/3295586/pexels-photo-3295586.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Touch-Ups" />
              </div>
              <div className="service-row">
                <h3 className="service-name">Touch-Ups</h3>
              </div>
            </div>
            <div className="service-card reveal-card" id="service-card-consulting">
              <div className="service-img">
                <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/2177019/pexels-photo-2177019.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Consulting" />
              </div>
              <div className="service-row">
                <h3 className="service-name">Consulting</h3>
              </div>
            </div>
          </div>
          <a href="#" className="view-all-link" style={{ marginTop: '20px', display: 'block' }} id="services-view-all-link">
            View All Services →
          </a>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery" id="gallery">
        <div className="gallery-inner reveal" id="gallery-inner-container">
          <div className="gallery-header" id="gallery-header-meta">
            <p className="label">OUR WORK</p>
            <SplitText as="h2" className="h2-heading" text="Gallery" />
          </div>
          <div className="gallery-grid" id="gallery-image-board">
            <div className="gallery-item span2 reveal-card" id="gallery-item-1">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088486/pexels-photo-5088486.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop" alt="Gallery item" />
            </div>
            <div className="gallery-item reveal-card" id="gallery-item-2">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088495/pexels-photo-5088495.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Gallery item" />
            </div>
            <div className="gallery-item reveal-card" id="gallery-item-3">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088499/pexels-photo-5088499.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Gallery item" />
            </div>
            <div className="gallery-item rowspan reveal-card" id="gallery-item-4">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088511/pexels-photo-5088511.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Gallery item" />
            </div>
            <div className="gallery-item reveal-card" id="gallery-item-5">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088512/pexels-photo-5088512.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Gallery item" />
            </div>
            <div className="gallery-item reveal-card" id="gallery-item-6">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/325152/pexels-photo-325152.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Gallery item" />
            </div>
            <div className="gallery-item reveal-card" id="gallery-item-7">
              <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/9937060/pexels-photo-9937060.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" alt="Gallery item" />
            </div>
          </div>
          <a href="#" className="view-all-link" style={{ marginTop: '20px', display: 'block' }} id="gallery-view-all-link">
            View Full Gallery →
          </a>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews" id="reviews">
        <div className="reviews-inner reveal" id="reviews-inner-container">
          <div className="reviews-header" id="reviews-header-meta">
            <p className="label">CLIENT FEEDBACK</p>
            <SplitText as="h2" className="h2-heading" text="What Our Clients Say" />
          </div>
          
          <div className="reviews-container" id="reviews-slider-viewport">
            <div className="reviews-grid" id="reviews-columns">
              <div className="reviews-col scroll-up" id="reviews-column-1">
                {/* SET 1 */}
                <div className="review-card reveal-card" id="review-card-Alex">
                  <p className="review-quote">"Incredible experience from start to finish. The artist understood my vision perfectly."</p>
                  <div className="review-author">
                    <div className="review-author-left">
                      <div className="review-avatar">
                        <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/1767437/pexels-photo-1767437.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Alex" />
                      </div>
                      <span className="review-name">Alex Martinez</span>
                    </div>
                    <span className="review-date">2 weeks ago</span>
                  </div>
                </div>
                <div className="review-card reveal-card" id="review-card-Maya">
                  <p className="review-quote">"The entire team was welcoming and the studio has an incredible vibe. My new favorite spot."</p>
                  <div className="review-author">
                    <div className="review-author-left">
                      <div className="review-avatar">
                        <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088513/pexels-photo-5088513.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Maya" />
                      </div>
                      <span className="review-name">Maya Patel</span>
                    </div>
                    <span className="review-date">3 weeks ago</span>
                  </div>
                </div>
                {/* SEAMLESS DUPLICATE */}
                <div className="review-card reveal-card" id="review-card-Alex-dup">
                  <p className="review-quote">"Incredible experience from start to finish. The artist understood my vision perfectly."</p>
                  <div className="review-author">
                    <div className="review-author-left">
                      <div className="review-avatar">
                        <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/1767437/pexels-photo-1767437.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Alex" />
                      </div>
                      <span className="review-name">Alex Martinez</span>
                    </div>
                    <span className="review-date">2 weeks ago</span>
                  </div>
                </div>
                <div className="review-card reveal-card" id="review-card-Maya-dup">
                  <p className="review-quote">"The entire team was welcoming and the studio has an incredible vibe. My new favorite spot."</p>
                  <div className="review-author">
                    <div className="review-author-left">
                      <div className="review-avatar">
                        <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088513/pexels-photo-5088513.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Maya" />
                      </div>
                      <span className="review-name">Maya Patel</span>
                    </div>
                    <span className="review-date">3 weeks ago</span>
                  </div>
                </div>
              </div>
              
              <div className="reviews-col scroll-down" id="reviews-column-2">
                {/* SET 2 */}
                <div className="review-card reveal-card" id="review-card-Jordan">
                  <p className="review-quote">"Best tattoo studio in town. Professional, clean, and the team is amazing."</p>
                  <div className="review-author">
                    <div className="review-author-left">
                      <div className="review-avatar">
                        <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/1961537/pexels-photo-1961537.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Jordan" />
                      </div>
                      <span className="review-name">Jordan Lee</span>
                    </div>
                    <span className="review-date">1 month ago</span>
                  </div>
                </div>
                <div className="review-card reveal-card" id="review-card-Chris">
                  <p className="review-quote">"I was nervous about my first tattoo but the artist made me feel completely at ease. Absolutely love the result."</p>
                  <div className="review-author">
                    <div className="review-author-left">
                      <div className="review-avatar">
                        <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088473/pexels-photo-5088473.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Chris" />
                      </div>
                      <span className="review-name">Chris Rivera</span>
                    </div>
                    <span className="review-date">3 weeks ago</span>
                  </div>
                </div>
                {/* SEAMLESS DUPLICATE */}
                <div className="review-card reveal-card" id="review-card-Jordan-dup">
                  <p className="review-quote">"Best tattoo studio in town. Professional, clean, and the team is amazing."</p>
                  <div className="review-author">
                    <div className="review-author-left">
                      <div className="review-avatar">
                        <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/1961537/pexels-photo-1961537.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Jordan" />
                      </div>
                      <span className="review-name">Jordan Lee</span>
                    </div>
                    <span className="review-date">1 month ago</span>
                  </div>
                </div>
                <div className="review-card reveal-card" id="review-card-Chris-dup">
                  <p className="review-quote">"I was nervous about my first tattoo but the artist made me feel completely at ease. Absolutely love the result."</p>
                  <div className="review-author">
                    <div className="review-author-left">
                      <div className="review-avatar">
                        <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088473/pexels-photo-5088473.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Chris" />
                      </div>
                      <span className="review-name">Chris Rivera</span>
                    </div>
                    <span className="review-date">3 weeks ago</span>
                  </div>
                </div>
              </div>
              
              <div className="reviews-col scroll-up" id="reviews-column-3">
                {/* SET 3 */}
                <div className="review-card reveal-card" id="review-card-Sam">
                  <p className="review-quote">"Exactly what I wanted. The attention to detail is unmatched."</p>
                  <div className="review-author">
                    <div className="review-author-left">
                      <div className="review-avatar">
                        <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/1755905/pexels-photo-1755905.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Sam" />
                      </div>
                      <span className="review-name">Sam Anderson</span>
                    </div>
                    <span className="review-date">1 month ago</span>
                  </div>
                </div>
                <div className="review-card reveal-card" id="review-card-Taylor">
                  <p className="review-quote">"I've been to studios all over and this Tattoo Studio is hands down the best. Clean, creative, and professional."</p>
                  <div className="review-author">
                    <div className="review-author-left">
                      <div className="review-avatar">
                        <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088499/pexels-photo-5088499.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Taylor" />
                      </div>
                      <span className="review-name">Taylor Kim</span>
                    </div>
                    <span className="review-date">2 months ago</span>
                  </div>
                </div>
                {/* SEAMLESS DUPLICATE */}
                <div className="review-card reveal-card" id="review-card-Sam-dup">
                  <p className="review-quote">"Exactly what I wanted. The attention to detail is unmatched."</p>
                  <div className="review-author">
                    <div className="review-author-left">
                      <div className="review-avatar">
                        <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/1755905/pexels-photo-1755905.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Sam" />
                      </div>
                      <span className="review-name">Sam Anderson</span>
                    </div>
                    <span className="review-date">1 month ago</span>
                  </div>
                </div>
                <div className="review-card reveal-card" id="review-card-Taylor-dup">
                  <p className="review-quote">"I've been to studios all over and this Tattoo Studio is hands down the best. Clean, creative, and professional."</p>
                  <div className="review-author">
                    <div className="review-author-left">
                      <div className="review-avatar">
                        <img referrerPolicy="no-referrer" loading="lazy" src="https://images.pexels.com/photos/5088499/pexels-photo-5088499.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" alt="Taylor" />
                      </div>
                      <span className="review-name">Taylor Kim</span>
                    </div>
                    <span className="review-date">2 months ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <a href="#" className="view-all-link" style={{ marginTop: '20px', display: 'block' }} id="reviews-view-all-link">
            View All Reviews →
          </a>
        </div>
      </section>

      {/* CONTACT/BOOK */}
      <section className="contact" id="contact">
        <div className="contact-inner reveal" id="contact-inner-container">
          <div className="contact-info" id="contact-details-box">
            <div>
              <p className="label">GET IN TOUCH</p>
              <h2 className="h2-heading" id="contact-heading-title">Let's Create Together</h2>
              <p className="body-text" style={{ marginTop: '20px' }} id="contact-descriptor-text">
                We bring together the most talented tattoo artists in the industry. Whether you have a clear vision or need help bringing an idea to life, we're here to make it happen.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} id="contact-info-list">
              <div className="contact-detail" id="contact-detail-address">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p>Studio 4B, 12 Garden Walk, Shoreditch, London EC2A 3EQ, United Kingdom</p>
              </div>
              <div className="contact-detail" id="contact-detail-phone">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <p>07700 900077</p>
              </div>
              <div className="contact-detail" id="contact-detail-email">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <p>info@tattoostudio.com</p>
              </div>
              <div className="contact-detail" id="contact-detail-hours">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <p>Mon - Sun: 8:00 AM - 10:00 PM</p>
              </div>
            </div>
            <div id="contact-socials-group">
              <p className="label" style={{ marginBottom: '14px' }}>FOLLOW US</p>
              <div className="footer-socials" style={{ marginTop: 0 }} id="contact-social-icons">
                <a href="#" className="social-icon" aria-label="Instagram">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Twitter">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Facebook">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#" className="social-icon" aria-label="Pinterest">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8-.12-.88-.22-2.23.05-3.18.24-.85 1.55-6.57 1.55-6.57s-.4-.8-.4-1.98c0-1.85 1.07-3.24 2.41-3.24 1.14 0 1.69.85 1.69 1.88 0 1.14-.73 2.85-1.1 4.44-.32 1.33.66 2.41 1.98 2.41 2.38 0 4.21-2.51 4.21-6.13 0-3.2-2.3-5.44-5.58-5.44-3.8 0-6.03 2.85-6.03 5.8 0 1.15.44 2.38 1 3.05.11.13.13.25.09.39-.1.42-.33 1.34-.37 1.53-.06.24-.2.3-.46.18-1.72-.8-2.79-3.31-2.79-5.33 0-4.34 3.15-8.32 9.09-8.32 4.77 0 8.48 3.4 8.48 7.94 0 4.74-2.99 8.55-7.14 8.55-1.39 0-2.7-.72-3.15-1.58l-.86 3.27c-.3 1.18-1.14 2.65-1.7 3.55 1.28.39 2.64.61 4.05.61 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="form-section" id="booking-form-box">
            <SplitText as="h2" className="form-title" text="Book Your Tattoo" />
            <p className="form-subtitle" id="booking-form-caption">Fill out the form below and we'll get back to you within 24 hours.</p>
            <form onSubmit={handleSubmit} id="booking-form">
              <div className="form-row" id="form-row-personal">
                <div className="form-group" id="form-group-name">
                  <label>Full Name *</label>
                  <input type="text" name="Name" required id="form-input-name" />
                </div>
                <div className="form-group" id="form-group-email">
                  <label>Email *</label>
                  <input type="email" name="Email" required id="form-input-email" />
                </div>
              </div>
              <div className="form-row" id="form-row-contact">
                <div className="form-group" id="form-group-phone">
                  <label>Phone *</label>
                  <input type="tel" name="Phone" required id="form-input-phone" />
                </div>
                <div className="form-group" id="form-group-artist">
                  <label>Artist *</label>
                  <select name="Artist" required defaultValue="" id="form-select-artist">
                    <option value="" disabled>Select…</option>
                    <option>Kevin</option>
                    <option>Jen</option>
                    <option>Andy</option>
                    <option>James</option>
                    <option>Steven</option>
                  </select>
                </div>
              </div>
              <div className="form-row" id="form-row-details">
                <div className="form-group" id="form-group-placement">
                  <label>Body Placement *</label>
                  <select name="Placement" required defaultValue="" id="form-select-placement">
                    <option value="" disabled>Select…</option>
                    <option>Arm</option>
                    <option>Leg</option>
                    <option>Chest</option>
                    <option>Back</option>
                  </select>
                </div>
                <div className="form-group" id="form-group-inspiration">
                  <label>Inspiration *</label>
                  <input type="url" name="Inspiration" placeholder="Paste in url" required id="form-input-inspiration" />
                </div>
              </div>
              <div className="form-group" id="form-group-description">
                <label>Description</label>
                <textarea name="Description" placeholder="Any more info we should know before we get started?" id="form-textarea-description"></textarea>
              </div>
              <div className="checkbox-row" id="form-group-verification">
                <input type="checkbox" required id="form-checkbox-age" />
                <span>I verify that I am 18 years or older*</span>
              </div>
              <button type="submit" className="submit-btn" id="form-submit-button">SUBMIT</button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* FOOTER */}
      <footer id="footer-main">
        <div className="footer-inner reveal" id="footer-inner-container">
          <div className="footer-top" id="footer-top-details">
            <div className="footer-info" id="footer-info-details">
              <div className="footer-studio-grid" id="footer-studio-grid-box">
                <div className="footer-item" id="footer-item-address">
                  <span className="footer-label">Address:</span>
                  <span className="footer-value">Studio 4B, 12 Garden Walk, Shoreditch, London EC2A 3EQ, United Kingdom</span>
                </div>
                <div className="footer-item" id="footer-item-phone">
                  <span className="footer-label">Phone number:</span>
                  <a href="tel:07700900077" className="footer-value">07700 900077</a>
                </div>
                <div className="footer-item" id="footer-item-hours">
                  <span className="footer-label">Studio Hours:</span>
                  <span className="footer-value">Monday to Sunday<br />8:00 am – 10:00 pm</span>
                </div>
                <div className="footer-item" id="footer-item-email">
                  <span className="footer-label">Email:</span>
                  <a href="mailto:info@tattoostudio.com" className="footer-value">info@tattoostudio.com</a>
                </div>
              </div>
              <div className="footer-socials" id="footer-social-icons">
                <a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener">
                  <svg width="24" height="24" fill="none" stroke="var(--white)" strokeWidth={1.5} viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="var(--white)" stroke="none" />
                  </svg>
                </a>
                <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener">
                  <svg width="24" height="24" fill="none" stroke="var(--white)" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="https://tiktok.com" className="social-icon" target="_blank" rel="noopener">
                  <svg width="24" height="24" fill="var(--white)" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.61a8.2 8.2 0 0 0 4.79 1.52V6.69a4.85 4.85 0 0 1-1.02-.0z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-links" id="footer-links-list">
              <a href="#about" className="footer-link">About</a>
              <a href="#artists" className="footer-link">Artists</a>
              <a href="#services" className="footer-link">Services</a>
              <a href="#gallery" className="footer-link">Gallery</a>
              <a href="#reviews" className="footer-link">Reviews</a>
              <a href="#faq" className="footer-link">FAQ</a>
              <a href="#contact" className="footer-link">Contact</a>
              <a href="#faq" className="footer-link">Prep & Care</a>
              <a href="#" className="footer-link">Refund</a>
            </div>
          </div>
          <div className="footer-bottom" id="footer-bottom-bar">
            <a href="#top" className="footer-logo">Tattoo Studio</a>
            <div className="footer-misc" id="footer-misc-meta">
              <span>©2024 Tattoo Studio</span>
              <span>Designed by <a href="https://ivanqiu.lemonsqueezy.com/" target="_blank" rel="noopener">Ivan Qiu</a></span>
              <span>Proudly built in <a href="https://www.framer.com" target="_blank" rel="noopener">Framer</a></span>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp float widget */}
      <a href="https://wa.me/919342735182" className="wa-float" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" id="wa-floating-trigger">
        <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Scroll to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`scroll-to-top ${showScrollTop ? 'visible' : ''}`}
        aria-label="Scroll to top"
        id="scroll-to-top-btn"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
    </>
  );
}
