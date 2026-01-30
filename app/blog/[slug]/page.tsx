import { Metadata } from "next";
import Link from "next/link";
import { getPostBySlug, getPosts } from "@/lib/blog/posts";
import { BlogPostSchema } from "@/components/blog-post-schema";
import { BlogCard } from "@/components/blog-card";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post não encontrado",
    };
  }

  return {
    title: `${post.title} | Calcula MEI`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getPosts()
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <>
      <BlogPostSchema post={post} />
      <div className="min-h-screen bg-white">
        {/* Back Link */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/blog"
              className="text-mei-600 hover:text-mei-700 font-semibold inline-flex items-center gap-2"
            >
              ← Voltar para Blog
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-mei-500 to-mei-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/90">
                <div>
                  <span className="font-semibold">Por</span> {post.author}
                </div>
                <div className="hidden sm:block text-white/50">•</div>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <div className="hidden sm:block text-white/50">•</div>
                <div>{post.readTime} min de leitura</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            {/* Article Content */}
            <article
              className="prose prose-sm sm:prose max-w-none mb-16"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-mei-50 to-mei-100 rounded-2xl p-8 sm:p-12 text-center mb-16">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Pronto para colocar em prática?
              </h3>
              <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Use as calculadoras do Calcula MEI para automatizar seus cálculos e
                tomar melhores decisões para seu MEI.
              </p>
              <Link
                href="/calculadoras"
                className="inline-block bg-mei-600 text-white px-8 py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-mei-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Acessar Calculadoras
              </Link>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                  Artigos Relacionados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <BlogCard key={relatedPost.slug} post={relatedPost} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
