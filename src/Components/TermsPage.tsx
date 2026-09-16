const SECTIONS = [
  {
    title: '1. Agreement to Terms',
    body: [
      "These Terms and Conditions (\"Terms\") govern your access to and use of Sentra, a platform connecting traders and customs officers for document submission, tracking, and clearance across African trade corridors. By creating an account or otherwise using Sentra, you agree to these Terms.",
      "If you're using Sentra on behalf of a business, you're confirming you have the authority to bind that business to these Terms.",
    ],
  },
  {
    title: '2. Description of Service',
    body: [
      "Sentra lets traders submit consignment details and supporting documents, and lets customs officers review, approve, or reject those consignments. Approved consignments receive a QR code that customs officers can scan to look up the current record.",
      "Sentra is a document and workflow platform. It does not process payments, act as a customs broker, or make customs clearance decisions on anyone's behalf — clearance decisions remain the responsibility of the customs officers and authorities using the platform.",
    ],
  },
  {
    title: '3. Accounts and Registration',
    body: [
      "You need an account to use Sentra, created directly or via Google or Apple sign-in. You're responsible for keeping your login credentials secure and for all activity under your account.",
      "You agree to provide accurate information when registering and when submitting consignments, and to keep your account information up to date.",
    ],
  },
  {
    title: '4. Acceptable Use',
    body: [
      'You agree not to: submit false or misleading consignment information; upload documents you don\'t have the right to submit; attempt to access another user\'s account or data; interfere with or disrupt the platform; or use Sentra for any unlawful purpose.',
    ],
  },
  {
    title: '5. Consignment Information and Accuracy',
    body: [
      'Traders are solely responsible for the accuracy and completeness of the consignment information and documents they submit. Sentra does not verify the accuracy of submitted information beyond what customs officers review through the platform.',
    ],
  },
  {
    title: '6. Intellectual Property',
    body: [
      'Sentra and its original content, features, and functionality are owned by [Company Legal Name] and are protected by applicable intellectual property laws. These Terms don\'t grant you any rights to Sentra\'s branding, trademarks, or underlying software beyond what\'s needed to use the platform as intended.',
    ],
  },
  {
    title: '7. Third-Party Services',
    body: [
      'Sentra is built on Google Firebase for authentication and data storage. Your account and consignment data are processed through Firebase\'s infrastructure, subject to Google\'s own terms and security practices.',
    ],
  },
  {
    title: '8. Disclaimers',
    body: [
      'Sentra is provided "as is" and "as available," without warranties of any kind, express or implied. We don\'t guarantee that the platform will be uninterrupted, error-free, or that it will result in any particular customs clearance outcome or timeline.',
    ],
  },
  {
    title: '9. Limitation of Liability',
    body: [
      'To the fullest extent permitted by law, [Company Legal Name] will not be liable for any indirect, incidental, or consequential damages arising from your use of Sentra, including delays or losses related to customs clearance decisions made by third parties.',
    ],
  },
  {
    title: '10. Termination',
    body: [
      'You may stop using Sentra at any time. We may suspend or terminate accounts that violate these Terms or that we reasonably believe pose a risk to the platform or other users.',
    ],
  },
  {
    title: '11. Changes to These Terms',
    body: [
      'We may update these Terms from time to time. If we make material changes, we\'ll update the date below. Continuing to use Sentra after changes take effect means you accept the updated Terms.',
    ],
  },
  {
    title: '12. Governing Law',
    body: [
      'These Terms are governed by the laws of [Jurisdiction], without regard to conflict-of-law principles.',
    ],
  },
  {
    title: '13. Contact',
    body: [
      'Questions about these Terms can be sent through our Contact page.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-100 text-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <span className="inline-block text-teal-600 text-xs font-semibold uppercase tracking-wide mb-4">
          Legal
        </span>
        <h1 className="font-['Manrope'] text-3xl sm:text-4xl font-semibold mb-4 leading-tight">
          Terms and Conditions
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
