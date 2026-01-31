import Link from "next/link";
import { FileText } from "lucide-react";
import { BlogPost } from "@/lib/blog/posts";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group h-full bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300">
        {/* Image placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center overflow-hidden group-hover:from-primary group-hover:to-primary/90 transition-colors duration-300">
          <FileText className="w-16 h-16 text-primary-foreground/40" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col h-full">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full group-hover:bg-primary/20 transition-colors duration-300">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-2">
            {post.description}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span>{post.readTime} min de leitura</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
