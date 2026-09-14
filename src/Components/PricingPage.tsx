import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

const plans = [
  {
    name: 'Starter',
    description: 'For individual traders clearing occasional shipments.',
    features: [
      'Unlimited document uploads',
      'QR code per consignment',
      'Shipment status tracking',
      'Email support',
    ],
    cta: 'Try for free',
    action: '/trader-signup',
    highlighted: false,
  },
  {
    name: 'Business',
    description: 'For traders and freight teams clearing regularly.',
    features: [
      'Everything in Starter',
      'Multiple team members',
      'Priority document review',
      'Dashboard analytics',
      'Priority support',
    ],
    cta: 'Talk to sales',
    action: '/contact',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'For customs authorities and large logistics networks.',
    features: [
      'Everything in Business',
      'Customs officer workspace',
      'Bulk consignment tools',
      'Dedicated account manager',
      'Custom integrations',
    ],
    cta: 'Contact us',
    action: '/contact',
    highlighted: false,
  },
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-100 text-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <span className="inline-block text-teal-600 text-xs font-semibold uppercase tracking-wide mb-4">
          Pricing
        </span>
        <h1 className="font-['Manrope'] text-3xl sm:text-4xl font-semibold mb-4 leading-tight">
          Pricing that fits how you trade.
        </h1>
        <p className="text-gray-600 text-lg">
          From a single trader to a national customs authority — talk to us and we'll match a plan to your volume.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col h-full ${
                plan.highlighted
                  ? 'bg-teal-600 text-white shadow-lg md:-translate-y-2'
                  : 'bg-white border border-gray-100 shadow-sm text-gray-800'
              }`}
            >
              <h2 className="font-['Manrope'] text-xl font-semibold mb-2">{plan.name}</h2>
              <p className={`text-sm mb-6 ${plan.highlighted ? 'text-teal-50' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <FaCheck className={`mt-1 shrink-0 ${plan.highlighted ? 'text-teal-200' : 'text-teal-600'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => navigate(plan.action)}
                className={`w-full py-3 rounded-lg font-['Manrope'] font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-white text-teal-700 hover:bg-teal-50'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          Every plan includes secure document handling and QR-based clearance.
        </p>
      </div>
    </div>
  );
}
