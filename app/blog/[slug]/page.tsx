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
      <div className="min-h-screen bg-background">
        {/* Back Link */}
        <div className="bg-secondary/50 border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <Link
              href="/blog"
              className="text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-2"
            >
              ← Voltar para Blog
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-3xl">
              {/* Category Badge */}
              <div className="mb-2">
                <span className="inline-block px-2 py-0.5 bg-primary-foreground/20 text-primary-foreground text-xs font-semibold rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold mb-2">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-primary-foreground/90">
                <div>
                  <span className="font-semibold">Por</span> {post.author}
                </div>
                <div className="hidden sm:block text-primary-foreground/50">•</div>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
                <div className="hidden sm:block text-primary-foreground/50">•</div>
                <div>{post.readTime} min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Article Content */}
            <article
              className="blog-content mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA Section */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center mb-12">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Pronto para colocar em prática?
              </h3>
              <p className="text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
                Use as calculadoras do Calcula MEI para automatizar seus cálculos e
                tomar melhores decisões para seu MEI.
              </p>
              <Link
                href="/calculadoras"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Acessar Calculadoras
              </Link>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-foreground mb-6">
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
