import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaArrowRight, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// TODO: swap in the real social URLs once available (matches Footer's convention)
const socialLinks = [
  { icon: FaFacebookF, label: 'Facebook', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaTwitter, label: 'Twitter', href: '#' },
];

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

interface FAQItemProps {
  index: number;
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ index, question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-6">
      <button
        className="flex items-center gap-4 w-full text-left group"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="text-sm font-medium text-teal-600 tabular-nums w-6 shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1 font-['Manrope'] text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-5 h-5 shrink-0 text-teal-600"
        >
          <span className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-full bg-current rounded-full" />
          <span className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 w-full bg-current rounded-full" />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-3 pl-10 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await addDoc(collection(db, 'contactMessages'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: Timestamp.now(),
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <span className="inline-block text-teal-600 text-xs font-semibold uppercase tracking-wide mb-4">
          Contact
        </span>
        <h1 className="font-['Manrope'] text-3xl sm:text-4xl font-semibold mb-4 leading-tight">
          We'd like to hear from you.
        </h1>
        <p className="text-gray-600 text-lg">
          Questions, feedback, or issues with a consignment — send us a message and we'll get back to you.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 divide-y divide-gray-200 lg:divide-y-0 lg:divide-x">
          <div className="lg:col-span-3 lg:pr-8">
            <h2 className="font-['Manrope'] text-xl font-semibold mb-6 text-gray-900">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">Name *</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-gray-200 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-teal-600 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">Email *</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-gray-200 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-teal-600 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">Message *</label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-0 py-2.5 bg-transparent border-0 border-b-2 border-gray-200 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-teal-600 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group inline-flex items-center gap-2 py-3 px-6 rounded-full font-['Manrope'] font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>

              {submitStatus === 'success' && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-teal-700">
                  <FaCheckCircle className="shrink-0" />
                  Message sent — we'll get back to you soon.
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-red-600">
                  <FaExclamationCircle className="shrink-0" />
                  Something went wrong. Please try again.
                </motion.p>
              )}
            </form>
          </div>

          <div className="lg:col-span-2 pt-8 lg:pt-0 lg:pl-8">
            <h2 className="font-['Manrope'] text-xl font-semibold mb-4 text-gray-900">Follow us</h2>
            <p className="text-sm text-gray-600 mb-4">
              We typically respond within 1-2 business days.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        <h2 className="font-['Manrope'] text-2xl font-semibold mb-8 text-center text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <FAQItem key={faq.question} index={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>

      <div className="text-center pb-16">
        <Link to="/" className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ContactPage;
