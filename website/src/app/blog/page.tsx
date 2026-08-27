import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublishedArticles } from "@/lib/blog";
import Link from "next/link";
import { BookOpen, Clock, ArrowUpLeft } from "lucide-react";

export const metadata = {
  title: "المدونة — مقالات عملية لأصحاب المتاجر والشركات | ECOMATE",
  description: "مواضيع تشغيلية عملية لأصحاب المتاجر الإلكترونية والشركات في السعودية. من إدارة العمليات وخدمة العملاء إلى الأتمتة وتحسين المبيعات.",
};

export default function BlogPage() {
  const articles = getPublishedArticles();

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-[#3B4FE8]/20 text-[#3B4FE8] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpen size={14} />
              <span>مدونة ECOMATE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-tight mb-4">
              المعرفة التي تساعدك تنمو
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              مواضيع عملية مبنية على التحديات الحقيقية التي يواجهها أصحاب المتاجر والشركات. بدون حشو، بدون كلام تسويقي — فقط معلومات تقدر تطبقها.
            </p>
          </div>

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.meta.slug}
                  href={`/blog/${article.meta.slug}`}
                  className="bg-slate-50/70 hover:bg-white rounded-3xl p-7 border border-slate-200 hover:border-[#3B4FE8]/40 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-4">
                      <span className="text-[#3B4FE8] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-bold">
                        {article.meta.category}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <Clock size={12} /> {article.meta.readTime}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-slate-950 mb-3 leading-snug group-hover:text-[#3B4FE8] transition-colors">
                      {article.meta.title}
                    </h2>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium line-clamp-3">
                      {article.meta.metaDescription}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-[#3B4FE8] transition-colors">
                    <span>قراءة المقال</span>
                    <ArrowUpLeft size={16} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">
              <BookOpen size={40} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold text-sm">المقالات قيد الإعداد — قريباً نشارك أول مواضيعنا.</p>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
