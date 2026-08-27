import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getArticleBySlug, getAllArticles } from "@/lib/blog";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen, ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react";

// Generate static params for all articles (published + draft for preview)
export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ slug: a.meta.slug }));
}

// Dynamic metadata per article
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "مقال غير موجود" };
  
  return {
    title: article.meta.metaTitle,
    description: article.meta.metaDescription,
    openGraph: {
      title: article.meta.metaTitle,
      description: article.meta.metaDescription,
      type: "article",
      locale: "ar_SA",
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const isDraft = article.meta.status === "draft";

  return (
    <div className="bg-white text-slate-900 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Draft Banner */}
          {isDraft && (
            <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl p-4 mb-8 text-xs font-bold flex items-center gap-2">
              <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-black">DRAFT</span>
              <span>هذا المقال في وضع المسودة ولم يُنشر بعد. المعاينة متاحة فقط عبر الرابط المباشر.</span>
            </div>
          )}

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
            <Link href="/" className="hover:text-[#3B4FE8] transition-colors">الرئيسية</Link>
            <span>←</span>
            <Link href="/blog" className="hover:text-[#3B4FE8] transition-colors">المدونة</Link>
            <span>←</span>
            <span className="text-slate-400 truncate max-w-[200px]">{article.meta.title}</span>
          </div>

          {/* Article Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 text-xs mb-5">
              <span className="text-[#3B4FE8] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full font-bold">
                {article.meta.category}
              </span>
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                <Clock size={12} /> {article.meta.readTime}
              </span>
              {article.meta.updatedAt && (
                <span className="text-slate-400 font-medium">
                  آخر تحديث: {article.meta.updatedAt}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 leading-tight mb-4">
              {article.meta.title}
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium border-r-4 border-[#3B4FE8] pr-4">
              {article.meta.metaDescription}
            </p>
          </header>

          {/* Article Body — Rendered from Markdown-like content */}
          <div className="prose-ecomate">
            {article.content.split('\n').map((line, idx) => {
              const trimmed = line.trim();
              
              if (trimmed === '---') {
                return <hr key={idx} className="my-10 border-slate-200" />;
              }
              
              if (trimmed.startsWith('### ')) {
                return <h3 key={idx} className="text-lg sm:text-xl font-black text-slate-950 mt-8 mb-3">{trimmed.replace('### ', '')}</h3>;
              }
              
              if (trimmed.startsWith('## ')) {
                return <h2 key={idx} className="text-xl sm:text-2xl font-black text-slate-950 mt-12 mb-4 pb-3 border-b border-slate-200">{trimmed.replace('## ', '')}</h2>;
              }
              
              if (trimmed.startsWith('- [ ] ')) {
                return (
                  <label key={idx} className="flex items-start gap-2.5 py-1.5 text-sm text-slate-700 font-medium">
                    <span className="w-4 h-4 mt-0.5 rounded border-2 border-slate-300 shrink-0"></span>
                    <span>{trimmed.replace('- [ ] ', '')}</span>
                  </label>
                );
              }
              
              if (trimmed.startsWith('- **') || trimmed.startsWith('- ')) {
                return (
                  <div key={idx} className="flex items-start gap-2 py-1 text-sm text-slate-700 font-medium leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B4FE8] mt-2 shrink-0"></span>
                    <span dangerouslySetInnerHTML={{ __html: trimmed.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>') }} />
                  </div>
                );
              }
              
              if (trimmed.startsWith('> ')) {
                const isGood = trimmed.includes('✅');
                const isBad = trimmed.includes('❌');
                return (
                  <blockquote key={idx} className={`my-3 py-3 px-4 rounded-xl text-sm font-medium leading-relaxed border-r-4 ${
                    isGood ? 'bg-emerald-50 border-emerald-400 text-emerald-900' :
                    isBad ? 'bg-red-50 border-red-400 text-red-900' :
                    'bg-slate-50 border-slate-300 text-slate-700'
                  }`}>
                    {trimmed.replace(/^> /, '')}
                  </blockquote>
                );
              }

              if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                return <p key={idx} className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed my-3">{trimmed.replace(/\*\*/g, '')}</p>;
              }
              
              if (trimmed === '') {
                return <div key={idx} className="h-3" />;
              }
              
              return (
                <p key={idx} className="text-sm sm:text-base text-slate-700 font-medium leading-[1.8] my-2" dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>') }} />
              );
            })}
          </div>

          {/* FAQ Section */}
          {article.faq.length > 0 && (
            <section className="mt-16 pt-10 border-t border-slate-200">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 mb-6">أسئلة شائعة</h2>
              <div className="space-y-4">
                {article.faq.map((item, idx) => (
                  <details key={idx} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden group">
                    <summary className="cursor-pointer px-5 py-4 text-sm font-bold text-slate-900 hover:text-[#3B4FE8] transition-colors list-none flex items-center justify-between">
                      <span>{item.question}</span>
                      <ArrowLeft size={16} className="text-slate-400 group-open:rotate-90 transition-transform shrink-0 mr-2" />
                    </summary>
                    <div className="px-5 pb-4 text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-3">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* ECOMATE Solution — Small, non-promotional */}
          {article.ecomateSolution && (
            <section className="mt-14 bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8">
              <h2 className="text-lg font-black text-slate-950 mb-4">كيف يمكن لـ ECOMATE مساعدتك في هذا الموضوع؟</h2>
              <div className="text-sm text-slate-700 font-medium leading-[1.8] space-y-3">
                {article.ecomateSolution.split('\n').filter(l => l.trim()).map((line, idx) => {
                  const trimmed = line.trim();
                  if (trimmed.startsWith('- **')) {
                    return (
                      <div key={idx} className="flex items-start gap-2 py-0.5">
                        <CheckCircle2 size={15} className="text-[#3B4FE8] mt-0.5 shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: trimmed.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>') }} />
                      </div>
                    );
                  }
                  return <p key={idx} dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>') }} />;
                })}
              </div>
            </section>
          )}

          {/* CTA — Subtle and non-aggressive */}
          <section className="mt-10 bg-white rounded-2xl border border-slate-200 p-6 text-center">
            <p className="text-sm font-bold text-slate-900 mb-2">{article.cta.headline}</p>
            <p className="text-xs text-slate-600 font-medium mb-4">{article.cta.description}</p>
            <Link
              href={article.cta.buttonUrl}
              className="inline-flex items-center gap-2 bg-[#3B4FE8] hover:bg-[#2D3ED0] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-105"
            >
              <span>{article.cta.buttonText}</span>
              <ArrowLeft size={14} />
            </Link>
            {article.cta.note && (
              <p className="text-[11px] text-slate-400 font-medium mt-3">{article.cta.note}</p>
            )}
          </section>

          {/* Sources */}
          {article.sources.length > 0 && (
            <section className="mt-12 pt-8 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-4">المصادر والمراجع</h3>
              <ol className="space-y-2 text-xs text-slate-500 font-medium">
                {article.sources.map((src, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-400 shrink-0">{idx + 1}.</span>
                    <span>
                      {src.url ? (
                        <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-[#3B4FE8] hover:underline">
                          {src.name}
                        </a>
                      ) : src.name}
                      {src.note && <span className="text-slate-400"> — {src.note}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Back to blog */}
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#3B4FE8] transition-colors"
            >
              <ArrowRight size={14} />
              <span>العودة لجميع المقالات</span>
            </Link>
          </div>

        </article>
      </main>
      <Footer />
    </div>
  );
}
