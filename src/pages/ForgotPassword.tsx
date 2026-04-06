import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleLogo from "@/components/GoogleLogo";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Reset link sent!", description: "Check your phone for instructions." });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/50 px-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <GoogleLogo />
          <h1 className="text-2xl font-display font-medium text-foreground mt-4">Password recovery</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter your phone number to reset</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Send reset link
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
