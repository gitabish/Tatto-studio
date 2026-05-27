import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'booking' | 'pricing' | 'aftercare';
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'aftercare',
    question: "How do I care for my new tattoo?",
    answer: "Keep your protective bandage on for the time recommended by your artist (usually 2–4 hours). Wash it gently with lukewarm water and mild, unscented soap. Pat dry with a clean paper towel and apply a thin layer of recommended aftercare ointment. Repeat a few times daily, keeping it clean, hydrated, and avoiding direct sunlight, scratching, or soaking."
  },
  {
    category: 'aftercare',
    question: "Can I swim, take a bath, or work out after getting a tattoo?",
    answer: "Avoid pools, oceans, baths, and hot tubs for at least 2–3 weeks to prevent infection and color fading. Normal showers are recommended. For working out, avoid heavy sweating, stretching, and direct friction on the tattooed area during the first week of healing."
  },
  {
    category: 'booking',
    question: "Do you accept walk-ins or are appointments required?",
    answer: "While we specialize in custom-crafted work and highly recommend booking in advance, we do accommodate walk-ins on a first-come, first-served basis if an artist has sudden availability. Booking in advance ensures dedicated preparation and custom design time with your chosen artist."
  },
  {
    category: 'booking',
    question: "How do I book a session and are deposits required?",
    answer: "You can book through our online book form above, via WhatsApp, or email. We require a deposit to secure your design and booking date. The deposit is deducted from the final price of your tattoo session."
  },
  {
    category: 'pricing',
    question: "How much will my tattoo cost?",
    answer: "We have a shop minimum of £80. Final pricing depends heavily on the overall size, placement, intricate complexity, and the artist's rate. Larger or custom multi-session pieces are charged at an hourly rate ranging from £100 to £150. A customized quote is always provided during your initial consultation."
  },
  {
    category: 'pricing',
    question: "Is the deposit refundable if I need to reschedule?",
    answer: "Deposits are strictly non-refundable. However, we allow a one-time roll-over to reschedule your appointment to a different date, provided you notify us at least 48 hours prior to your scheduled session."
  }
];

export const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'booking' | 'pricing' | 'aftercare'>('all');

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredData = filter === 'all' 
    ? FAQ_DATA 
    : FAQ_DATA.filter(item => item.category === filter);

  return (
    <section className="faq" id="faq">
      <div className="reveal" id="faq-inner-container">
        
        {/* Header */}
        <div className="section-header" id="faq-header-meta">
          <p className="label">COMMON INQUIRIES</p>
          <h2 className="h2-heading" id="faq-heading-title">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="faq-tabs" id="faq-filter-tabs">
          {(['all', 'booking', 'pricing', 'aftercare'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setFilter(tab);
                setActiveIndex(null);
              }}
              className={`faq-tab-btn ${filter === tab ? 'active' : ''}`}
            >
              {tab === 'all' ? 'Show All' : tab}
            </button>
          ))}
        </div>

        {/* Accordion list */}
        <div className="faq-list" id="faq-accordion-list">
          {filteredData.map((item, idx) => {
            const isExpanded = activeIndex === idx;
            return (
              <div 
                key={idx} 
                className={`faq-item reveal-card ${isExpanded ? 'expanded' : ''}`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="faq-trigger"
                  aria-expanded={isExpanded}
                >
                  <span className="faq-question">
                    {item.question}
                  </span>
                  <span className={`faq-icon ${isExpanded ? 'rotated' : ''}`}>
                    ＋
                  </span>
                </button>

                {/* Accordion Content Panel */}
                <div
                  className="faq-content-wrapper"
                  style={{
                    maxHeight: isExpanded ? '300px' : '0px',
                    opacity: isExpanded ? 1 : 0,
                  }}
                >
                  <div className="faq-content">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
};
