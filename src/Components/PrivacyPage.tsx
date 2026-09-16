const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: [
      'Account information: your name, email address, and account role (trader or customs officer), collected when you sign up directly or through Google or Apple sign-in.',
      'Consignment information: trader and consignment details you submit, including document type, goods description, estimated value, and the documents you upload for customs review.',
      'Preferences: lightweight settings like your light/dark theme choice, stored in your browser and never sent to our servers.',
    ],
  },
  {
    title: '2. How We Use Information',
    body: [
      'We use the information above to operate Sentra: creating and securing your account, letting customs officers review and act on consignments, generating QR codes for approved consignments, and showing you the status of your own submissions.',
      "We don't use your information for advertising, and we don't sell it to third parties.",
    ],
  },
  {
    title: '3. How We Share Information',
    body: [
      'Consignment information you submit is visible to customs officers using the platform, since reviewing that information is the point of the service. Traders and customs officers otherwise cannot see each other\'s account details beyond what a consignment record includes.',
      'Sentra runs on Google Firebase, which stores and processes your account and consignment data on our behalf as our infrastructure provider.',
    ],
  },
  {
    title: '4. Data Retention',
    body: [
      'We keep your account and consignment data for as long as your account is active. If you\'d like your account or data deleted, contact us through our Contact page.',
    ],
  },
  {
    title: '5. Your Rights and Choices',
    body: [
      'You can review and update your name from your account Settings at any time. For anything Settings doesn\'t cover yet — including access, correction, or deletion requests — reach out through our Contact page.',
    ],
  },
  {
    title: '6. Security',
    body: [
      'Your account is protected by Firebase Authentication, and your data is stored in Firebase\'s infrastructure with its standard security protections. No system is perfectly secure, but we rely on established, well-maintained infrastructure rather than handling sensitive data ourselves.',
    ],
  },
  {
    title: '7. Children\'s Privacy',
    body: [
      'Sentra is intended for traders and customs officers conducting business, and isn\'t directed at children. We don\'t knowingly collect information from children.',
    ],
  },
  {
    title: '8. Cookies and Local Storage',
    body: [
      'Sentra uses your browser\'s local storage to remember your theme preference and to keep you signed in between visits. We don\'t use tracking or advertising cookies.',
    ],
  },
  {
    title: '9. Changes to This Policy',
    body: [
      'We may update this policy as Sentra changes. If we make material changes, we\'ll update the date below.',
    ],
  },
  {
    title: '10. Contact Us',
    body: [
      'Questions about this policy, or requests about your data, can be sent through our Contact page.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-100 text-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <span className="inline-block text-teal-600 text-xs font-semibold uppercase tracking-wide mb-4">
          Legal
        </span>
        <h1 className="font-['Manrope'] text-3xl sm:text-4xl font-semibold mb-4 leading-tight">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-lg">
          Last updated: [Month Year]
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-['Manrope'] text-lg font-semibold mb-3 text-gray-900">
                {section.title}
              </h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
