import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Calendar, User, ArrowRight, Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  slug: string;
  readTime: string;
  tags: string[];
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "10 Essential Tips for First-Time Pet Owners",
      excerpt: "Starting your journey as a pet parent? Here are the most important things you need to know to ensure your furry friend is happy and healthy.",
      content: "Full article content here...",
      category: "Pet Care",
      author: "Dr. Sarah Johnson",
      date: "2024-01-15",
      image: "/placeholder.svg",
      slug: "tips-for-first-time-pet-owners",
      readTime: "5 min read",
      tags: ["beginner", "pet care", "tips"]
    },
    {
      id: 2,
      title: "How to Keep Your Dog Happy During Indoor Days",
      excerpt: "Rainy days don't have to be boring! Discover creative ways to keep your dog entertained and mentally stimulated when you can't go outside.",
      content: "Full article content here...",
      category: "Dog Care",
      author: "Mike Chen",
      date: "2024-01-12",
      image: "/placeholder.svg",
      slug: "keeping-dogs-happy-indoors",
      readTime: "4 min read",
      tags: ["dogs", "indoor activities", "mental stimulation"]
    },
    {
      id: 3,
      title: "The Complete Guide to Cat Nutrition",
      excerpt: "Understanding your cat's nutritional needs is crucial for their health. Learn about the best feeding practices and what to avoid.",
      content: "Full article content here...",
      category: "Cat Care",
      author: "Dr. Emily Rodriguez",
      date: "2024-01-10",
      image: "/placeholder.svg",
      slug: "cat-nutrition-guide",
      readTime: "7 min read",
      tags: ["cats", "nutrition", "health"]
    },
    {
      id: 4,
      title: "Finding the Right Pet Sitter: A Complete Guide",
      excerpt: "Choosing the right person to care for your pet while you're away is crucial. Here's everything you need to know about finding trustworthy pet sitters.",
      content: "Full article content here...",
      category: "Pet Sitting",
      author: "Jessica Thompson",
      date: "2024-01-08",
      image: "/placeholder.svg",
      slug: "finding-right-pet-sitter",
      readTime: "6 min read",
      tags: ["pet sitting", "safety", "tips"]
    },
    {
      id: 5,
      title: "Emergency Pet Care: What Every Owner Should Know",
      excerpt: "Accidents happen, and being prepared can make all the difference. Learn the basics of emergency pet care and when to seek professional help.",
      content: "Full article content here...",
      category: "Health",
      author: "Dr. Robert Kim",
      date: "2024-01-05",
      image: "/placeholder.svg",
      slug: "emergency-pet-care-basics",
      readTime: "8 min read",
      tags: ["emergency", "health", "safety"]
    },
    {
      id: 6,
      title: "Creating a Pet-Friendly Home Environment",
      excerpt: "Transform your home into a safe and comfortable space for your pets with these practical tips and design ideas.",
      content: "Full article content here...",
      category: "Home & Safety",
      author: "Lisa Park",
      date: "2024-01-03",
      image: "/placeholder.svg",
      slug: "pet-friendly-home-environment",
      readTime: "5 min read",
      tags: ["home", "safety", "environment"]
    }
  ];

  const categories = ['all', 'Pet Care', 'Dog Care', 'Cat Care', 'Pet Sitting', 'Health', 'Home & Safety'];

  useEffect(() => {
    document.title = "Pet Care Blog | Tips, Stories & Expert Advice";
    
    // Simulate API fetch
    setTimeout(() => {
      setPosts(blogPosts);
      setLoading(false);
    }, 800);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredPost = posts[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <PawPrint className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Pet Care</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                Home
              </Link>
              <Link to="/blog" className="text-sm font-medium text-primary">
                Blog
              </Link>
              <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
                About
              </Link>
              <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Pet Care Blog</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Expert Tips & <span className="text-primary">Pet Stories</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover expert advice, heartwarming stories, and practical tips 
            to keep your furry friends happy and healthy.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-muted/20">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'All Posts' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {!loading && featuredPost && (
        <section className="py-16">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Featured Article</h2>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <PawPrint className="h-16 w-16 text-primary/40" />
                  </div>
                </div>
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-3">
                    {featuredPost.category}
                  </Badge>
                  <h3 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">
                    <Link to={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredPost.date).toLocaleDateString()}
                    </div>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <Button asChild>
                    <Link to={`/blog/${featuredPost.slug}`}>
                      Read More <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Latest Articles</h2>
            <p className="text-muted-foreground">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse"></div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <PawPrint className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <PawPrint className="h-12 w-12 text-primary/40" />
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {post.category}
                    </Badge>
                    <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/blog/${post.slug}`}>
                          Read More <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary/5">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Stay Updated</Badge>
          <h2 className="text-3xl font-bold mb-4">Never Miss a Tip</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest pet care tips, stories, 
            and advice delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input placeholder="Enter your email..." className="flex-1" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;