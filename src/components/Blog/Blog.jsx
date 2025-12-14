import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import './Blog.css';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "PetConnect Blog | Pet Care Tips & Stories";
    
    // Simulate API fetch
    setTimeout(() => {
      setPosts(blogPosts);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="blog-page">
      {/* Header */}
      <header className="blog-header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <PawPrint className="logo-icon" />
              <span>PetConnect</span>
            </Link>
            <nav className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/blog" className="active">Blog</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="blog-hero animate-fadeIn">
        <div className="container">
          <h1>PetConnect Blog</h1>
          <p>Tips, stories, and advice for pet owners and lovers</p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="blog-posts animate-slideUp">
        <div className="container">
          {loading ? (
            <div className="skeleton-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-post"></div>
              ))}
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <article key={post.id} className="post-card">
                  <img src={post.image} alt={post.title} />
                  <div className="post-content">
                    <span className="post-category">{post.category}</span>
                    <h3>{post.title}</h3>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="read-more">Read More</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="blog-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <PawPrint className="footer-logo-icon" />
              <span>PetConnect</span>
            </div>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
            <div className="footer-copyright">
              &copy; {new Date().getFullYear()} PetConnect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for First-Time Pet Owners",
    excerpt: "Essential advice for those new to pet ownership...",
    category: "Pet Care",
    image: "/images/blog1.jpg",
    slug: "tips-for-first-time-pet-owners"
  },
  {
    id: 2,
    title: "How to Keep Your Dog Happy Indoors",
    excerpt: "Fun activities for your dog when you can't go outside...",
    category: "Dog Care",
    image: "/images/blog2.jpg",
    slug: "keeping-dogs-happy-indoors"
  },
  {
    id: 3,
    title: "The Ultimate Cat Nutrition Guide",
    excerpt: "Understanding what your feline friend really needs...",
    category: "Cat Care",
    image: "/images/blog3.jpg",
    slug: "cat-nutrition-guide"
  },
  // Add more blog posts as needed
];

export default Blog;