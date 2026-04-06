import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, User, Plus, Minus, Truck } from "lucide-react";
import GoogleLogo from "@/components/GoogleLogo";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const categories = ["All", "Detergents", "Machine Parts", "Consumables", "Packaging Material", "Others"];

const trackingSteps = [
  { label: "Ordered", step: 1 },
  { label: "Packed", step: 2 },
  { label: "Picked Up", step: 3 },
  { label: "In Transit", step: 4 },
  { label: "Delivered", step: 5 },
];

const products = [
  { id: 1, name: "Premium Liquid Detergent 5L", hsn: "3402", price: 850, category: "Detergents" },
  { id: 2, name: "Stain Remover Spray 500ml", hsn: "3402", price: 320, category: "Detergents" },
  { id: 3, name: "Fabric Softener 2L", hsn: "3809", price: 450, category: "Detergents" },
  { id: 4, name: "Washing Machine Belt", hsn: "4010", price: 280, category: "Machine Parts" },
  { id: 5, name: "Drum Bearing Kit", hsn: "8482", price: 1200, category: "Machine Parts" },
  { id: 6, name: "Water Inlet Valve", hsn: "8481", price: 650, category: "Machine Parts" },
  { id: 7, name: "Lint Filter Mesh", hsn: "5911", price: 150, category: "Consumables" },
  { id: 8, name: "Descaling Powder 1kg", hsn: "3824", price: 380, category: "Consumables" },
  { id: 9, name: "Garment Cover Bags (50pcs)", hsn: "3923", price: 520, category: "Packaging Material" },
  { id: 10, name: "Laundry Tags Roll (1000pcs)", hsn: "4821", price: 290, category: "Packaging Material" },
  { id: 11, name: "Hanger Set (25pcs)", hsn: "3924", price: 375, category: "Others" },
  { id: 12, name: "Steam Iron Teflon Sole", hsn: "8516", price: 980, category: "Others" },
];

const FREE_SHIPPING_THRESHOLD = 20000;
const GST_RATE = 0.18;

const Shop = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<Record<number, number>>({});
  const currentStep = 2; // demo: Packed

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
    const free = sub >= FREE_SHIPPING_THRESHOLD;
    return { subtotal: sub, gst: g, total: sub + g, freeShipping: free };
  }, [cart]);

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto flex items-center gap-4 py-3 px-4">
          <GoogleLogo />
          <div className="flex-1 max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Clean Craft Store"
              className="pl-10 rounded-full border-input bg-secondary/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/account")}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Live Tracking */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Live Order Tracking</h2>
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {trackingSteps.map((step, i) => (
              <div key={step.step} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      step.step <= currentStep
                        ? "bg-primary border-primary shadow-md shadow-primary/30"
                        : "bg-background border-muted-foreground/30"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-medium whitespace-nowrap ${
                      step.step <= currentStep ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < trackingSteps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 mt-[-18px] ${
                      step.step < currentStep ? "bg-primary" : "bg-muted-foreground/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 flex gap-2 py-3 overflow-x-auto">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "secondary"}
              size="sm"
              className="rounded-full shrink-0 text-xs"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="w-12 text-center">S.No.</TableHead>
                <TableHead>Item Detail</TableHead>
                <TableHead className="w-24 text-center">HSN Code</TableHead>
                <TableHead className="w-28 text-right">Rate (₹)</TableHead>
                <TableHead className="w-36 text-center">Qty</TableHead>
                <TableHead className="w-28 text-right">Amount (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product, idx) => {
                const qty = cart[product.id] || 0;
                return (
                  <TableRow key={product.id} className="hover:bg-secondary/30">
                    <TableCell className="text-center text-muted-foreground text-sm">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {product.hsn}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">
                      ₹{product.price.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQty(product.id, -1)}
                          disabled={qty === 0}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm font-medium">{qty}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQty(product.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">
                      {qty > 0 ? `₹${(product.price * qty).toLocaleString("en-IN")}` : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Totals */}
        {cartCount > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 max-w-sm ml-auto space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="font-medium">₹{gst.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <Truck className="h-3.5 w-3.5" /> Transportation
              </span>
              {freeShipping ? (
                <span className="text-primary font-medium text-xs">FREE</span>
              ) : (
                <span className="text-destructive text-xs font-medium">
                  Order ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("en-IN")} more for free shipping
                </span>
              )}
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-semibold text-foreground">Final Amount</span>
              <span className="font-bold text-lg text-primary">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <Button className="w-full mt-2">Place Order</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
