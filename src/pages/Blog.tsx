/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BlogPost, BlogComment, BlogBlock, VideoItem } from "../types";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  ThumbsUp, 
  Sparkles, 
  Send, 
  X, 
  ArrowLeft, 
  Star, 
  Play, 
  Film, 
  Calendar 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { togglePostLike, commentOnPost, replyToComment } from "../api";
import SEO from "../components/SEO";

interface BlogProps {
  posts: BlogPost[];
  selectedPost: BlogPost | null;
  onSelectPost: (post: BlogPost | null) => void;
  onRefreshState: () => void;
  videos: VideoItem[];
}

export default function Blog({
  posts,
  selectedPost,
  onSelectPost,
  onRefreshState,
  videos
}: BlogProps) {
  // Navigation inside the Media Hub
  const [mediaTab, setMediaTab] = useState<"articles" | "videos">("articles");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [newReplyName, setNewReplyName] = useState("");
  const [newReplyText, setNewReplyText] = useState("");
  const [isLiking, setIsLiking] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Video playback overlay state
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Categories helper
  const categories = ["all", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filteredPosts = posts.filter((p) => {
    return selectedCategory === "all" || p.category === selectedCategory;
  });

  const handleLike = async (postId: string) => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await togglePostLike(postId);
      onRefreshState(); // Reload state to update frontend
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    try {
      await commentOnPost(postId, newCommentName.trim(), newCommentText.trim());
      setNewCommentName("");
      setNewCommentText("");
      onRefreshState();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, postId: string, commentId: string) => {
    e.preventDefault();
    if (!newReplyName.trim() || !newReplyText.trim()) return;

    try {
      await replyToComment(postId, commentId, newReplyName.trim(), newReplyText.trim());
      setNewReplyName("");
      setNewReplyText("");
      setReplyingCommentId(null);
      onRefreshState();
    } catch (err) {
      console.error(err);
    }
  };

  const simulateShare = (platform: string, postTitle: string) => {
    const text = `Read this incredible dance breakthrough: "${postTitle}" by Dance With Sizzy Afro`;
    const url = window.location.href;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text} - ${url}`);
    }
    
    setShareFeedback(`Copied sharing card link for ${platform}!`);
    setTimeout(() => setShareFeedback(null), 3000);
  };

  const renderBlock = (block: BlogBlock, index: number) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index} className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4 font-sans text-left">
            {block.value}
          </p>
        );
      case "heading":
        const HeadingTag = block.level === 1 ? "h2" : "h3";
        return (
          <HeadingTag
            key={index}
            className={`font-display font-bold text-white tracking-tight mb-3 mt-6 text-left ${
              block.level === 1 ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
            }`}
          >
            {block.value}
          </HeadingTag>
        );
      case "image":
        return (
          <div key={index} className="my-6 rounded-2xl overflow-hidden border border-slate-800">
            <img
              src={block.value}
              alt={block.alt || "Blog visual item"}
              className="w-full object-cover max-h-96"
              referrerPolicy="no-referrer"
            />
            {block.alt && (
              <p className="bg-slate-950/60 p-2.5 text-center text-xs text-slate-500 border-t border-slate-800 font-mono">
                {block.alt}
              </p>
            )}
          </div>
        );
      case "button":
        return (
          <div key={index} className="my-4 text-left">
            <a
              href={block.url}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
            >
              <span>{block.value}</span>
            </a>
          </div>
        );
      case "link":
        return (
          <div key={index} className="my-2 text-left">
            <a
              href={block.url}
              className="inline-flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-semibold underline text-sm"
            >
              <span>{block.value}</span>
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 font-sans">
      <SEO
        title={selectedPost ? selectedPost.seo_title : "Stories & Media Gallery | Dance With Sizzy Afro"}
        description={selectedPost ? selectedPost.seo_description : "Explore articles about street dance, youth empowerment journals, and watch our live choreography video clips from Western Uganda."}
        keywords="dance column, blog mbarara, breaking video, sizzy afro youtube, street dance battle reels, training guides"
      />

      {selectedPost ? (
        <div className="space-y-8">
          <button
            onClick={() => onSelectPost(null)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-colors text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back To Media Grid</span>
          </button>

          <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
            <div className="lg:col-span-8 space-y-6 bg-slate-900/10 border border-slate-900 p-6 sm:p-8 rounded-3xl">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span className="text-orange-500 font-bold uppercase">{selectedPost.category}</span>
                  <span>•</span>
                  <span>By {selectedPost.author}</span>
                  <span>•</span>
                  <span>{selectedPost.date}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white tracking-tight leading-tight">
                  {selectedPost.title}
                </h1>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-850 bg-slate-950 max-h-[380px]">
                <img
                  src={selectedPost.image_url}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="pt-2">
                {selectedPost.blocks && selectedPost.blocks.map((block, idx) => renderBlock(block, idx))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-850">
                <button
                  onClick={() => handleLike(selectedPost.id)}
                  className={`flex items-center gap-2 text-xs font-bold py-2 px-4 rounded-xl border transition-all ${
                    selectedPost.likedBy?.includes("anonymous") || selectedPost.likes > 24
                      ? "bg-rose-500/15 border-rose-500/40 text-rose-500"
                      : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Recommend ({selectedPost.likes} Loves)</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono font-bold">Share:</span>
                  <button
                    onClick={() => simulateShare("WhatsApp", selectedPost.title)}
                    className="p-2 bg-slate-950/50 hover:bg-green-600/10 text-slate-400 hover:text-green-500 rounded-lg border border-slate-850"
                    title="Share on WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => simulateShare("Facebook", selectedPost.title)}
                    className="p-2 bg-slate-950/50 hover:bg-blue-600/10 text-slate-400 hover:text-blue-500 rounded-lg border border-slate-850"
                    title="Share on Facebook"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {shareFeedback && (
                <div className="bg-orange-500/15 border border-orange-500/40 text-orange-400 p-3 rounded-xl text-center text-xs font-bold">
                  {shareFeedback}
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900/20 border border-slate-850 p-6 rounded-3xl space-y-6">
                <h3 className="font-display font-extrabold text-white text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                  <span>Discussion Cypher</span>
                </h3>

                <form onSubmit={(e) => handleCommentSubmit(e, selectedPost.id)} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs py-2 px-3 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder="Your comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs py-2 px-3 rounded-lg text-white focus:outline-none focus:border-orange-500 placeholder-slate-600"
                  />
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Speak in cypher</span>
                  </button>
                </form>

                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                  {!selectedPost.comments || selectedPost.comments.length === 0 ? (
                    <p className="text-slate-500 text-xs text-center py-4 italic">No comments yet. Be the first to start the cypher!</p>
                  ) : (
                    selectedPost.comments.map((comm) => (
                      <div key={comm.id} className="space-y-3 border-b border-slate-850/40 pb-3 last:border-0 last:pb-0">
                        <div className="flex gap-2.5 items-start">
                          <img
                            src={comm.avatar}
                            alt="avatar"
                            className="w-8 h-8 rounded-full border border-slate-700/65 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-slate-300">{comm.author}</p>
                              <span className="text-[9px] text-slate-500 font-mono">{new Date(comm.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-normal">{comm.text}</p>
                            
                            <button
                              onClick={() => setReplyingCommentId(comm.id)}
                              className="text-[10px] text-orange-500 font-bold hover:underline"
                            >
                              Reply
                            </button>
                          </div>
                        </div>

                        {comm.replies && comm.replies.length > 0 && (
                          <div className="pl-6 space-y-3 boundary border-l border-slate-800">
                            {comm.replies.map((rep) => (
                              <div key={rep.id} className="flex gap-2 items-start">
                                <img
                                  src={rep.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                                  alt="avatar"
                                  className="w-6 h-6 rounded-full object-cover border border-slate-800"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="space-y-0.5 flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-bold text-slate-300">{rep.author}</p>
                                    <span className="text-[8px] text-slate-500 font-mono">{new Date(rep.date).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-normal">{rep.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {replyingCommentId === comm.id && (
                          <form
                            onSubmit={(e) => handleReplySubmit(e, selectedPost.id, comm.id)}
                            className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 space-y-2 mt-2"
                          >
                            <div className="flex gap-2 justify-between items-center text-xs text-slate-400 mb-1">
                              <span>Replying to {comm.author}:</span>
                              <button onClick={() => setReplyingCommentId(null)} className="text-red-500 hover:text-red-400">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <input
                              type="text"
                              required
                              placeholder="Your Name"
                              value={newReplyName}
                              onChange={(e) => setNewReplyName(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 text-[11px] py-1.5 px-2.5 rounded-lg text-white focus:outline-none focus:border-orange-500"
                            />
                            <textarea
                              required
                              rows={1}
                              placeholder="Your reply text..."
                              value={newReplyText}
                              onChange={(e) => setNewReplyText(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 text-[11px] py-1.5 px-2.5 rounded-lg text-white focus:outline-none focus:border-orange-500 placeholder-slate-600"
                            />
                            <button
                              type="submit"
                              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 rounded text-[10px]"
                            >
                              Submit Reply
                            </button>
                          </form>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">
          {/* Header Title section */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-orange-500 font-display text-xs tracking-widest uppercase font-bold">
              THE MEDIA VAULT
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight">
              Stories & Performance Reels
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Read community stories and tutorials on street formats, or experience the amazing physics of our live showcases caught on stage.
            </p>
          </div>

          {/* Unified Primary Page Switcher Tabs */}
          <div className="flex items-center justify-center gap-3 border-b border-slate-900/60 pb-3 max-w-sm mx-auto">
            <button
              onClick={() => { setMediaTab("articles"); setSelectedCategory("all"); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                mediaTab === "articles"
                  ? "bg-slate-900 text-white border-orange-500/20 shadow-sm"
                  : "bg-[#0b0f19] text-slate-500 border-transparent hover:text-white"
              }`}
            >
              Articles & stories
            </button>
            <button
              onClick={() => setMediaTab("videos")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
                mediaTab === "videos"
                  ? "bg-slate-900 text-white border-orange-500/20 shadow-sm"
                  : "bg-[#0b0f19] text-slate-500 border-transparent hover:text-white"
              }`}
            >
              Performance Reels
            </button>
          </div>

          {/* TAB 1: ARTICLES VIEW */}
          {mediaTab === "articles" && (
            <div className="space-y-6">
              {/* Category Filtering Toggles */}
              <div className="flex flex-wrap gap-2 justify-center pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-semibold transition-all uppercase tracking-wider ${
                      selectedCategory === cat
                        ? "bg-orange-500 text-white"
                        : "bg-slate-900/60 text-slate-400 border border-slate-850 hover:bg-slate-800"
                    }`}
                  >
                    {cat === "all" ? "All Columns" : cat}
                  </button>
                ))}
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl">
                  <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium font-sans">No journal entries found in this category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      whileHover={{ y: -5 }}
                      className="bg-slate-900/30 border border-slate-800 hover:border-slate-750 p-5 rounded-2xl flex flex-col justify-between group cursor-pointer transition-all duration-300"
                      onClick={() => onSelectPost(post)}
                    >
                      <div className="space-y-4">
                        <div className="h-44 w-full rounded-xl overflow-hidden border border-slate-850 bg-slate-950">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                            <span className="text-orange-500 font-bold uppercase">{post.category}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                          </div>
                          <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-orange-500 transition-colors leading-snug line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-850/40 text-xs">
                        <span className="text-orange-500 font-bold hover:underline">Read Story</span>
                        <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                            <span>{post.likes}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
                            <span>{post.comments ? post.comments.length : 0}</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PERFORMANCE VIDEOS VIEW */}
          {mediaTab === "videos" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {videos.map((vid) => (
                <motion.div
                  key={vid.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-slate-900/30 border border-slate-800 p-5 rounded-3xl space-y-4 group cursor-pointer"
                  onClick={() => setActiveVideo(vid)}
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-850 bg-slate-950">
                    <img
                      src={`https://img.youtube.com/vi/${vid.youtube_id}/0.jpg`}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-orange-600 group-hover:bg-orange-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 active:scale-95 transition-all">
                      <Play className="w-6 h-6 fill-white translate-x-[2px]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Published: {vid.date}</span>
                    </div>
                    <h3 className="font-display font-bold text-white text-base sm:text-lg group-hover:text-orange-500 transition-colors leading-snug line-clamp-1">
                      {vid.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                      {vid.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EMBEDDED IFRAME VIDEO POPUP OVERLAYS */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative z-10 text-left"
            >
              <div className="p-4 bg-slate-950 border-b border-slate-850 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-orange-500" />
                  <span className="font-display font-bold text-sm tracking-wide truncate max-w-md">
                    {activeVideo.title}
                  </span>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full p-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black">
                <iframe
                  title={activeVideo.title}
                  src={`https://www.youtube.com/embed/${activeVideo.youtube_id}?autoplay=1`}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <div className="p-5 bg-slate-950/50 space-y-2 border-t border-slate-850">
                <p className="text-[10px] text-slate-500 font-mono">Date Published: {activeVideo.date}</p>
                <p className="text-slate-300 text-xs leading-relaxed">{activeVideo.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
