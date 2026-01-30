import { BlogPost } from "@/lib/blog/posts";

interface BlogPostSchemaProps {
  post: BlogPost;
}

export function BlogPostSchema({ post }: BlogPostSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Calcula MEI",
      logo: {
        "@type": "ImageObject",
        url: "https://calculamei.com.br/logo.svg",
      },
    },
    wordCount: Math.ceil(post.content.split(/\s+/).length),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
