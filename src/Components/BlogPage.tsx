const posts = [
  {
    title: "Five documents every cross-border trader needs on hand",
    excerpt: "The paperwork customs officers ask for most often, and how to have it ready before you reach the border.",
    category: 'Guides',
    readTime: '4 min read',
  },
  {
    title: 'How QR-based clearance cuts wait times at the border',
    excerpt: "A look at what actually slows down customs clearance, and why a single scannable record changes it.",
    category: 'Product',
    readTime: '5 min read',
  },
  {
    title: "What customs digitization means for small traders",
    excerpt: 'As more African customs authorities move to digital verification, here is what changes for traders on the ground.',
    category: 'Industry',
    readTime: '6 min read',
  },
  {
    title: 'Inside a consignment: from upload to cleared',
    excerpt: 'A walk-through of everything that happens to a document between a trader uploading it and an officer clearing it.',
    category: 'Product',
    readTime: '3 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-stone-100 text-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <span className="inline-block text-teal-600 text-xs font-semibold uppercase tracking-wide mb-4">
          Blog
        </span>
        <h1 className="font-['Manrope'] text-3xl sm:text-4xl font-semibold mb-4 leading-tight">
          Notes on trade, customs, and building Sentra.
        </h1>
        <p className="text-gray-600 text-lg">
          Guides for traders and customs officers, and updates on what we're building.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <article
              key={post.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-teal-600 mb-3">
                {post.category}
              </span>
              <h2 className="font-['Manrope'] text-lg font-semibold mb-2 leading-snug">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm mb-6 flex-grow">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                <span>Sentra Team</span>
                <span>{post.readTime}</span>
              </div>
            </article>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-12">
          More posts coming soon.
        </p>
      </div>
    </div>
  );
}
