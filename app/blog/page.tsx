"use client";

import { useState } from "react";
import { getPosts, getCategories } from "@/lib/blog/posts";
import { BlogCard } from "@/components/blog-card";

export default function BlogPage() {
  const posts = getPosts();
  const categories = getCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts =
    selectedCategory === null
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-lumei-500 to-lumei-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Blog Lumei
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Dicas, guias e novidades para MEI crescer
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                selectedCategory === null
                  ? "bg-lumei-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                  selectedCategory === category
                    ? "bg-lumei-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Nenhum artigo encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
