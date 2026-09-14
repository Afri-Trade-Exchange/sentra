import { FaBullseye, FaHandshake, FaGlobeAfrica } from 'react-icons/fa';

const values = [
  {
    icon: FaBullseye,
    title: 'Built for the border, not a boardroom',
    body: "Every feature starts with a real question from a trader or a customs officer, not a guess about what they might want.",
  },
  {
    icon: FaHandshake,
    title: 'Both sides of the desk',
    body: 'Traders and customs officers use the same platform, so nobody is left chasing an update over the phone.',
  },
  {
    icon: FaGlobeAfrica,
    title: 'Made for African trade corridors',
    body: "Designed around how goods actually move across African borders — not adapted from a system built somewhere else.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-100 text-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <span className="inline-block text-teal-600 text-xs font-semibold uppercase tracking-wide mb-4">
          Company
        </span>
        <h1 className="font-['Manrope'] text-3xl sm:text-4xl font-semibold mb-6 leading-tight">
          Clearing customs shouldn't feel like a second job.
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Sentra started with a simple observation: traders and customs officers across Africa were both stuck
          chasing the same paperwork from opposite ends of the border, with no shared view of where a consignment
          actually stood. We built one platform for both sides, so a document uploaded once, verified once, and
          scanned once is the only version of the truth anyone needs.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {values.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center mx-auto mb-5">
                <Icon className="text-teal-600 text-lg" />
              </div>
              <h3 className="font-['Manrope'] font-semibold mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-24 text-center">
        <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-semibold mb-4">
          Want to talk to the team?
        </h2>
        <p className="text-gray-600 mb-8">
          Whether you're a trader, a customs office, or a logistics partner — we'd like to hear from you.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-['Manrope'] font-semibold"
        >
          Get in touch
        </a>
      </div>
    </div>
  );
}
