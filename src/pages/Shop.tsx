import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, User, Star } from "lucide-react";
import GoogleLogo from "@/components/GoogleLogo";
import { useNavigate } from "react-router-dom";

const categories = ["All", "Electronics", "Fashion", "Home", "Sports", "Books"];

const products = [
  { id: 1, name: "Wireless Earbuds Pro", price: 79.99, rating: 4.5, reviews: 2341, category: "Electronics", image: "🎧" },
  { id: 2, name: "Slim Fit Denim Jacket", price: 59.99, rating: 4.3, reviews: 892, category: "Fashion", image: "🧥" },
  { id: 3, name: "Smart Home Speaker", price: 129.99, rating: 4.7, reviews: 5102, category: "Electronics", image: "🔊" },
  { id: 4, name: "Running Shoes Ultra", price: 119.99, rating: 4.6, reviews: 1567, category: "Sports", image: "👟" },
  { id: 5, name: "Ceramic Plant Pot Set", price: 34.99, rating: 4.4, reviews: 423, category: "Home", image: "🪴" },
  { id: 6, name: "Bestseller Novel Pack", price: 24.99, rating: 4.8, reviews: 3201, category: "Books", image: "📚" },
  { id: 7, name: "Yoga Mat Premium", price: 44.99, rating: 4.5, reviews: 789, category: "Sports", image: "🧘" },
  { id: 8, name: "LED Desk Lamp", price: 39.99, rating: 4.2, reviews: 654, category: "Home", image: "💡" },
];

const Shop = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);

  const filtered = products.filter(
    (p) =>
      (activeCategory === "All" || p.category === activeCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto flex items-center gap-4 py-3 px-4">
          <GoogleLogo />
          <div className="flex-1 max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ShopHub"
              className="pl-10 rounded-full border-input bg-secondary/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" onClick={() => {}}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 flex gap-2 py-3 overflow-x-auto">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "secondary"}
              size="sm"
              className="rounded-full shrink-0"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Products */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="h-40 bg-secondary/50 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                {product.image}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-medium text-foreground text-sm leading-tight line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-google-yellow text-google-yellow" />
                  <span className="text-xs text-muted-foreground">
                    {product.rating} ({product.reviews.toLocaleString()})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">${product.price}</span>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCartCount((c) => c + 1);
                    }}
                  >
                    Add to cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No products found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
