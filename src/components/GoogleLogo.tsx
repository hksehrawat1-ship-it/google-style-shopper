import logo from "@/assets/logo.png";

const GoogleLogo = () => (
  <div className="flex items-center gap-3">
    <img src={logo} alt="Clean Craft Store" className="h-10 w-10 object-contain" />
    <span className="text-2xl font-display font-bold text-foreground select-none leading-none">Clean Craft Store</span>
  </div>
);

export default GoogleLogo;
