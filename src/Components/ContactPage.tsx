import React from 'react';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';

const faqs = [
  {
    question: "How do I track my shipment?",
    answer: "You can track your shipment by entering your tracking number in our tracking portal. Each consignment is assigned a unique tracking ID when created."
  },
  {
    question: "What are your service areas?",
    answer: "We currently operate across major African trade routes, with a focus on East and West African corridors. Our network includes key ports and inland terminals."
  },
  {
    question: "How long does customs clearance take?",
    answer: "Customs clearance typically takes 2-5 business days, depending on the destination country and documentation completeness. Our customs officers work to expedite this process."
  },
  {
    question: "What documents do I need for trading?",
    answer: "Required documents include commercial invoice, bill of lading, certificate of origin, and customs declaration forms. Specific requirements may vary by country."
  },
  {
    question: "How do I become a registered trader?",
    answer: "To become a registered trader, click on the 'Register' button and complete the verification process. You'll need to provide business documentation and contact details."
  }
];

// Add interface above FAQItem component
interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 mb-4 shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="flex justify-between items-center w-full text-left group"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="text-lg font-medium text-gray-900 group-hover:text-orange-500 transition-colors">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-orange-500"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-gray-600 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Add form state management
interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add your API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 text-gray-800 font-['Comfortaa']">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-12 text-orange-600">Contact Us</h1>
        
        {/* Existing contact form and info sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-white rounded-xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-orange-500">Get in Touch</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                <textarea id="message" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg text-lg font-semibold shadow-md 
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg'
                  } transition-all`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitStatus === 'success' && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-green-600 text-center"
                >
                  Message sent successfully!
                </motion.p>
              )}

              {submitStatus === 'error' && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-red-600 text-center"
                >
                  Failed to send message. Please try again.
                </motion.p>
              )}
            </form>
          </div>
          <div className="bg-white rounded-xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-orange-500">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-center">
                <MdLocationOn className="text-orange-500 text-3xl mr-4" />
                <p className="text-lg">123 Trade Street, Nairobi, Kenya</p>
              </div>
              <div className="flex items-center">
                <MdPhone className="text-orange-500 text-3xl mr-4" />
                <p className="text-lg">+254 123 456 789</p>
              </div>
              <div className="flex items-center">
                <MdEmail className="text-orange-500 text-3xl mr-4" />
                <p className="text-lg">info@afritrade.com</p>
              </div>
            </div>
            <div className="mt-12">
              <h3 className="text-2xl font-semibold mb-4 text-orange-500">Follow Us</h3>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  <FaFacebookF className="w-8 h-8" />
                </a>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  <FaInstagram className="w-8 h-8" />
                </a>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">
                  <FaTwitter className="w-8 h-8" />
                </a>
              </div>
            </div>
            {/* Add business hours */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4 text-orange-500">Business Hours</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modernized FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-orange-500 text-center">
            Frequently Asked Questions
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                question={faq.question} 
                answer={faq.answer} 
              />
            ))}
          </motion.div>
        </div>

        <div className="text-center mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors text-lg font-semibold"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
