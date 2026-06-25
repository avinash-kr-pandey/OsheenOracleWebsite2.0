"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import CommonPageHeader from "@/components/CommonPages/CommonPageHeader";
import { blogAPI, Blog as BlogType, Comment } from "@/utils/api/blog.api";
import { getFullImageUrl } from "@/utils/api/api";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  comments: number;
  views: number;
  author: string;
  authorInitials: string;
  content: string;
  tags: string[];
}

// Helper function to get author initials
const getAuthorInitials = (author: string): string => {
  if (!author) return "AN";
  return author
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Format date
const formatBlogDate = (dateString?: string): string => {
  if (!dateString) {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format comment date
const formatCommentDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Transform API blog to UI format
const transformBlogForUI = (blog: BlogType): BlogPost => {
  const fullContent = blog.description || "";
  return {
    id: blog._id,
    title: blog.title,
    description: blog.excerpt || fullContent.substring(0, 150) + "...",
    image: blog.image
      ? getFullImageUrl(blog.image)
      : "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format",
    category: blog.category,
    date: formatBlogDate(blog.date || blog.createdAt),
    comments: blog.comments || 0,
    views: blog.views || 0,
    author: blog.author,
    authorInitials: blog.authorInitials || getAuthorInitials(blog.author),
    content: fullContent,
    tags: blog.tags || [],
  };
};

const SingleBlogPage = () => {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  // Comment states
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetchBlog();
      fetchComments();
    }
  }, [params?.id]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const blogId = params?.id as string;
      if (!blogId) return;

      const response = await blogAPI.getBlogById(blogId);
      if (response.success && response.data) {
        const transformedBlog = transformBlogForUI(response.data);
        setBlog(transformedBlog);

        // Fetch related posts
        const allBlogs = await blogAPI.getAllBlogs();
        if (allBlogs.success && Array.isArray(allBlogs.data)) {
          const related = allBlogs.data
            .filter(
              (b: BlogType) =>
                b.category === response.data?.category &&
                b._id !== response.data?._id,
            )
            .slice(0, 3)
            .map((b: BlogType) => transformBlogForUI(b));
          setRelatedPosts(related);
        }
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const blogId = params?.id as string;
      const response = await blogAPI.getBlogComments(blogId);
      if (response.success && response.data) {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!commentForm.name.trim()) {
      setFormMessage({ type: "error", text: "Please enter your name" });
      return;
    }
    if (
      !commentForm.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(commentForm.email)
    ) {
      setFormMessage({
        type: "error",
        text: "Please enter a valid email address",
      });
      return;
    }
    if (!commentForm.comment.trim()) {
      setFormMessage({ type: "error", text: "Please enter your comment" });
      return;
    }

    setSubmitting(true);
    setFormMessage(null);

    try {
      const blogId = params?.id as string;
      const response = await blogAPI.addBlogComment(blogId, commentForm);

      if (response.success) {
        setFormMessage({
          type: "success",
          text: "Comment submitted successfully! It will appear after admin approval.",
        });
        setCommentForm({ name: "", email: "", comment: "" });
        await fetchComments();
        // Refresh blog to update comment count
        await fetchBlog();
      } else {
        setFormMessage({
          type: "error",
          text: response.error || "Failed to submit comment",
        });
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      setFormMessage({
        type: "error",
        text: "Failed to submit comment. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="flex flex-col justify-center text-center border-b border-black/30">
          <CommonPageHeader title="Loading..." subtitle="Home - Blog" />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen">
        <div className="flex flex-col justify-center text-center border-b border-black/30">
          <CommonPageHeader title="Blog Not Found" subtitle="Home - Blog" />
        </div>
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="mt-6 bg-gradient-to-r from-orange-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col justify-center text-center border-b border-black/30">
        <CommonPageHeader title={blog.title} subtitle="Home - Blog" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT - Main Blog Content */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#6a5f57] to-[#8a7967] text-white shadow-2xl">
            {/* Blog Image */}
            <div className="relative h-96 w-full overflow-hidden">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                unoptimized={process.env.NODE_ENV === "production"}
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                {blog.category}
              </div>
            </div>

            {/* Blog Content */}
            <div className="bg-gradient-to-br from-[#1e1a17] to-[#2a231e] p-8">
              <div className="flex items-center gap-4 text-sm opacity-80 mb-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span>{blog.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>💬</span>
                  <span>{blog.comments} Comments</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>👁️</span>
                  <span>{blog.views} Views</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>✍️</span>
                  <span>By Osheen MAA</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                {blog.title}
              </h1>

              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed space-y-4">
                  {blog.content &&
                    blog.content
                      .split("\n")
                      .map((paragraph, idx) => <p key={idx}>{paragraph}</p>)}
                </div>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/20">
                  <h3 className="text-lg font-semibold mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-orange-500/30 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT - Sidebar */}
        <div className="space-y-10">
          {/* Author Info */}
          <div className="bg-gradient-to-br from-[#362f2b] to-[#4a4038] p-6 rounded-2xl text-white shadow-xl border border-white/10 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              OM
            </div>
            <h3 className="text-xl font-bold mb-2">Osheen MAA</h3>
            <p className="text-gray-300 text-sm">
              Follow for guidance
            </p>
            <a
              href="https://www.instagram.com/osheen_oracle?igsh=MTVienBkNjI0ZzhteQ%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-full bg-gradient-to-r from-orange-500 to-purple-600 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all text-center"
            >
              Follow Author
            </a>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="bg-gradient-to-br from-[#362f2b] to-[#4a4038] p-6 rounded-2xl text-white shadow-xl border border-white/10">
              <h3 className="font-bold text-lg mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                🌟 Related Articles
              </h3>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/blog/${post.id}`)}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized={process.env.NODE_ENV === "production"}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-orange-300 mb-1">
                        {post.date}
                      </p>
                      <p className="text-sm font-medium truncate group-hover:text-orange-200 transition-colors">
                        {post.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog Button */}
          <div className="bg-gradient-to-br from-[#362f2b] to-[#4a4038] p-6 rounded-2xl text-white shadow-xl border border-white/10">
            <button
              onClick={() => router.push("/blog")}
              className="w-full bg-gradient-to-r from-orange-500 to-purple-600 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              ← All Blogs
            </button>
          </div>

          {/* ✅ COMMENTS SECTION - Moved to Sidebar as requested */}
          <div className="bg-gradient-to-br from-[#362f2b] to-[#4a4038] p-6 rounded-2xl text-white shadow-xl border border-white/10">
            <h3 className="font-bold text-xl mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent flex items-center gap-2">
              💬 Comments ({blog.comments})
            </h3>

            {/* Form Message */}
            {formMessage && (
              <div
                className={`mb-4 p-3 rounded-xl text-sm ${
                  formMessage.type === "success"
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                {formMessage.text}
              </div>
            )}

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-4 mb-6">
              <input
                type="text"
                name="name"
                value={commentForm.name}
                onChange={(e) =>
                  setCommentForm({ ...commentForm, name: e.target.value })
                }
                placeholder="Your Name *"
                className="w-full bg-[#2a231e] border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="email"
                name="email"
                value={commentForm.email}
                onChange={(e) =>
                  setCommentForm({ ...commentForm, email: e.target.value })
                }
                placeholder="Your Email *"
                className="w-full bg-[#2a231e] border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <textarea
                name="comment"
                value={commentForm.comment}
                onChange={(e) =>
                  setCommentForm({ ...commentForm, comment: e.target.value })
                }
                placeholder="Write your comment... *"
                rows={3}
                className="w-full bg-[#2a231e] border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-orange-500 to-purple-600 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </div>
                ) : (
                  "Post Comment"
                )}
              </button>
            </form>

            {/* Comments List */}
            <div className="border-t border-white/20 pt-4">
              <h4 className="font-semibold text-sm mb-4 text-orange-300">
                Recent Comments
              </h4>

              {commentsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-white/5 rounded-xl p-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                            <p className="font-semibold text-sm">
                              {comment.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatCommentDate(comment.createdAt)}
                            </p>
                          </div>
                          <p className="text-gray-300 text-sm">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-400 text-sm">
                  <p>No comments yet.</p>
                  <p className="text-xs mt-1">
                    Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlogPage;
