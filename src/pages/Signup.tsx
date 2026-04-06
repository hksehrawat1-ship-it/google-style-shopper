import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import GoogleLogo from "@/components/GoogleLogo";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    pincode: "",
    phone: "",
    password: "",
    gstin: "",
    billingAddress: "",
  });
  const [detectingLocation, setDetectingLocation] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", variant: "destructive" });
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          update("address", data.display_name || `${pos.coords.latitude}, ${pos.coords.longitude}`);
        } catch {
          update("address", `${pos.coords.latitude}, ${pos.coords.longitude}`);
        }
        setDetectingLocation(false);
      },
      () => {
        toast({ title: "Location access denied", variant: "destructive" });
        setDetectingLocation(false);
      }
    );
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Account created successfully!" });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/50 px-4 py-8">
      <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <GoogleLogo />
          <h1 className="text-2xl font-display font-medium text-foreground mt-4">Create account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join Clean Craft Store today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Shipping Address</Label>
            <div className="flex gap-2">
              <Input
                id="address"
                placeholder="Enter your shipping address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className="flex-1"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={detectLocation}
                disabled={detectingLocation}
                title="Detect current location"
              >
                <MapPin className={`h-4 w-4 ${detectingLocation ? "animate-pulse text-primary" : ""}`} />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pin Code</Label>
            <Input
              id="pincode"
              placeholder="Enter pin code"
              value={form.pincode}
              onChange={(e) => update("pincode", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstin">GSTIN <span className="text-muted-foreground font-normal">(Optional)</span></Label>
            <Input
              id="gstin"
              placeholder="Enter GSTIN number"
              value={form.gstin}
              onChange={(e) => update("gstin", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingAddress">Billing Address <span className="text-muted-foreground font-normal">(Optional)</span></Label>
            <Input
              id="billingAddress"
              placeholder="Enter billing address (if different)"
              value={form.billingAddress}
              onChange={(e) => update("billingAddress", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-phone">Phone number</Label>
            <Input
              id="signup-phone"
              type="tel"
              placeholder=""
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Create account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-muted-foreground">Already have an account? </span>
          <Link
            to="/"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
