import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, User, Plus, Minus, Truck, ChevronUp, ChevronDown } from "lucide-react";
import GoogleLogo from "@/components/GoogleLogo";
import { useNavigate } from "react-router-dom";
import { products, categories } from "@/data/products";

const trackingSteps = [
  { label: "Ordered", step: 1 },
  { label: "Packed", step: 2 },
  { label: "Picked Up", step: 3 },
  { label: "In Transit", step: 4 },
  { label: "Delivered", step: 5 },
];

const FREE_SHIPPING_THRESHOLD = 50000;
const GST_RATE = 0.18;

const Shop = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartExpanded, setCartExpanded] = useState(false);
  const currentStep = 2;

  const filtered = products.filter(
    (p) =>
      (activeCategory === "All" || p.category === activeCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const val = (next[id] || 0) + delta;
      if (val <= 0) delete next[id];
      else next[id] = val;
      return next;
    });
  };

  const { subtotal, gst, total, freeShipping } = useMemo(() => {
    let sub = 0;
    Object.entries(cart).forEach(([id, qty]) => {
      const p = products.find((pr) => pr.id === Number(id));
      if (p) sub += p.price * qty;
    });
    const g = Math.round(sub * GST_RATE * 100) / 100;
    const tot = sub + g;
    const free = tot >= FREE_SHIPPING_THRESHOLD;
    return { subtotal: sub, gst: g, total: tot, freeShipping: free };
  }, [cart]);

  return (
    <div className="min-h-screen bg-secondary/30 pb-40">
      {/* Header – compact for mobile */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-2 py-2 px-3">
          <GoogleLogo />
          <div className="flex items-center gap-1 ml-auto">
            <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => setCartExpanded(!cartExpanded)}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate("/account")}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search – full width below logo */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10 h-9 rounded-full border-input bg-secondary/50 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Live Tracking – compact horizontal */}
      <div className="bg-card border-b border-border px-3 py-3">
        <p className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Order Tracking</p>
        <div className="flex items-center">
          {trackingSteps.map((step, i) => (
            <div key={step.step} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    step.step <= currentStep
                      ? "bg-primary border-primary shadow-sm shadow-primary/30"
                      : "bg-background border-muted-foreground/30"
                  }`}
                />
                <span
                  className={`text-[9px] font-medium whitespace-nowrap ${
                    step.step <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < trackingSteps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-0.5 mt-[-14px] ${
                    step.step < currentStep ? "bg-primary" : "bg-muted-foreground/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Categories – horizontally scrollable pills */}
      <div className="border-b border-border bg-card">
        <div className="flex gap-1.5 py-2 px-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "secondary"}
              size="sm"
              className="rounded-full shrink-0 text-xs h-8 px-3"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Cards – mobile-optimized */}
      <main className="px-3 py-3 space-y-2">
        {filtered.map((product) => {
          const qty = cart[product.id] || 0;
          return (
            <div
              key={product.id}
              className="bg-card border border-border rounded-lg p-3 flex items-center gap-3"
            >
              {/* Product info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground leading-tight line-clamp-2">{product.name}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-muted-foreground">{product.category}</span>
                  <span className="text-[10px] text-muted-foreground/60">HSN: {product.hsn}</span>
                </div>
                <p className="text-sm font-semibold text-foreground mt-1">
                  ₹{product.price.toLocaleString("en-IN")} <span className="text-[10px] font-normal text-muted-foreground">/ {product.unit}</span>
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                {qty > 0 ? (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateQty(product.id, -1)}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-7 text-center text-sm font-semibold">{qty}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => updateQty(product.id, 1)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    className="h-8 px-4 rounded-full text-xs font-semibold"
                    onClick={() => updateQty(product.id, 1)}
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No products found
          </div>
        )}
      </main>

      {/* Sticky Bottom Cart Summary */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          {/* Free shipping progress – always visible */}
          <div className="px-4 pt-2.5 pb-1">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Truck className="h-3 w-3" /> Free Shipping Progress
              </span>
              {freeShipping ? (
                <span className="text-primary font-semibold">FREE ✓</span>
              ) : (
                <span className="text-muted-foreground">₹{(FREE_SHIPPING_THRESHOLD - total).toLocaleString("en-IN")} more</span>
              )}
            </div>
            <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Expandable detail */}
          {cartExpanded && (
            <div className="px-4 pt-2 pb-1 space-y-1.5 border-b border-border max-h-48 overflow-y-auto">
              {Object.entries(cart).map(([id, qty]) => {
                const p = products.find((pr) => pr.id === Number(id));
                if (!p) return null;
                return (
                  <div key={id} className="flex justify-between text-xs">
                    <span className="text-foreground truncate flex-1 mr-2">{p.name} × {qty}</span>
                    <span className="font-medium shrink-0">₹{(p.price * qty).toLocaleString("en-IN")}</span>
                  </div>
                );
              })}
              <div className="border-t border-border pt-1.5 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Main bar */}
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setCartExpanded(!cartExpanded)}
              className="flex items-center gap-1 text-left flex-1 min-w-0"
            >
              <div>
                <p className="text-xs text-muted-foreground">{cartCount} item{cartCount > 1 ? "s" : ""}</p>
                <p className="text-lg font-bold text-foreground leading-tight">₹{total.toLocaleString("en-IN")}</p>
              </div>
              {cartExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
              ) : (
                <ChevronUp className="h-4 w-4 text-muted-foreground ml-1" />
              )}
            </button>
            <Button className="h-11 px-6 rounded-full text-sm font-semibold shadow-md">
              Place Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
