import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleLogo from "@/components/GoogleLogo";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/shop");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/50 px-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <GoogleLogo />
          <h1 className="text-2xl font-display font-medium text-foreground mt-4">Sign in</h1>
          <p className="text-muted-foreground text-sm mt-1">to continue to ShopHub</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Link
            to="/forgot-password"
            className="inline-block text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </Link>

          <Button type="submit" className="w-full" size="lg">
            Sign in
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-muted-foreground">Don't have an account? </span>
          <Link
            to="/signup"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
