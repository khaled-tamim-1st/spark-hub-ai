const stores = [
  { name: "متجر روز", icon: "🌹" },
  { name: "متجر الأناقة", icon: "👗" },
  { name: "متجر هدايا", icon: "🎁" },
  { name: "متجر بلانكو", icon: "✨" },
  { name: "متجر نخيل", icon: "🌴" },
  { name: "متجر زهرة", icon: "🌸" },
  { name: "متجر عود", icon: "🪵" },
  { name: "متجر لمسة", icon: "💫" },
];

// duplicate for seamless loop
const allStores = [...stores, ...stores];

export default function SocialProof() {
  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">
          يثق بسند أصحاب المتاجر الرائدة
        </p>
        <h2 className="text-2xl font-bold text-gray-900">
          على سلة وعبر جميع القنوات
        </h2>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <div className="flex gap-4 marquee-track">
            {allStores.map((store, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#6B00FF]/20 rounded-xl px-6 py-3 flex items-center gap-3 transition-all"
              >
                <span className="text-2xl">{store.icon}</span>
                <span className="text-gray-700 font-medium text-sm whitespace-nowrap">
                  {store.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
