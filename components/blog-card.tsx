import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BlogPost } from "@/lib/blog/posts";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group py-6 border-b border-border hover:border-primary/50 transition-colors">
        {/* Meta info */}
        <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
          <span className="px-2 py-0.5 bg-primary/10 text-primary font-medium rounded">
            {post.category}
          </span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
          <span>{post.readTime} min</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
          {post.title}
          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h2>

        {/* Description preview */}
        <p className="text-muted-foreground line-clamp-2">
          {post.description}
        </p>
      </article>
    </Link>
  );
}
