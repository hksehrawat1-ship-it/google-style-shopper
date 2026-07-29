import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Menu,
  TrendingUp,
  Megaphone,
  BookOpen,
  Settings2,
  Wrench,
  HeartHandshake,
  SearchCheck,
  FileText,
  ChevronRight,
  Lightbulb,
  Users,
  BarChart3,
  Sparkles,
} from "lucide-react";
import GoogleLogo from "@components/GoogleLogo";

const sections = [
  {
    id: "increase-sales",
    label: "Increase Sales",
    icon: TrendingUp,
    badge: "Top priority",
    description: "Actionable tactics to grow your store revenue.",
    content: [
      { title: "Upsell at checkout", body: "Train staff to suggest complementary items like fabric softener or premium detergents at billing." },
      { title: "Loyalty reminders", body: "Display a simple ‘Refer a neighbour’ offer to bring in new footfall." },
      { title: "Peak-hour staffing", body: "Ensure extra help during weekends and evenings to reduce walkaway customers." },
      { title: "Bundle pricing", body: "Create wash + fold + iron bundles to increase average ticket size." },
    ],
  },
  {
    id: "marketing-campaigns",
    label: "Marketing Campaigns Guide",
    icon: Megaphone,
    description: "Ready-to-run campaigns for your local market.",
    content: [
      { title: "WhatsApp launch kit", body: "Use store photos, a simple price list, and a grand-opening discount message." },
      { title: "Festival offers", body: "Run pre-Diwali curtain cleaning and monsoon shoe-care campaigns." },
      { title: "Google Business Profile", body: "Keep photos, timings, and reviews updated so local searches find you." },
      { title: "SMS retargeting", body: "Send ‘We miss you’ offers to customers inactive for 45 days." },
    ],
  },
  {
    id: "profit-playbooks",
    label: "Profit Playbooks",
    icon: BookOpen,
    description: "Step-by-step guides to protect and improve margins.",
    content: [
      { title: "Cost-per-wash tracker", body: "Log detergent, power, water, and labour per machine cycle to find leakage." },
      { title: "Pricing ladder", body: "Price by garment complexity, not just weight, to capture true value." },
      { title: "Reduce re-wash", body: "Pre-sort by colour and fabric to cut expensive reprocessing." },
      { title: "Inventory discipline", body: "Order consumables in MOQ batches to avoid stock-outs and dead stock." },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: Settings2,
    description: "Daily SOPs and checklists for smooth running.",
    content: [
      { title: "Opening checklist", body: "Machine inspection, cash float, POS login, and cleanliness verification." },
      { title: "Order triage", body: "Tag urgent orders by delivery time and communicate delays proactively." },
      { title: "End-of-day reconciliation", body: "Match POS sales, UPI settlements, and physical cash before closing." },
      { title: "Staff rota", body: "Publish weekly shifts and backup contacts to avoid no-show chaos." },
    ],
  },
  {
    id: "machine-care",
    label: "Machine Care",
    icon: Wrench,
    description: "Keep equipment running longer with less downtime.",
    content: [
      { title: "Daily wipe-down", body: "Clean door seals, detergent drawers, and lint filters every day." },
      { title: "Drain filter clean", body: "Clear the drain pump filter weekly to prevent blockages." },
      { title: "Calibration check", body: "Verify water inlet pressure and level sensors monthly." },
      { title: "Service log", body: "Record every service visit, part change, and warranty date in one place." },
    ],
  },
  {
    id: "customer-experience",
    label: "Customer Experience",
    icon: HeartHandshake,
    description: "Delight customers so they return and refer others.",
    content: [
      { title: "First impression", body: "Greet every customer, explain turnaround time, and confirm contact details." },
      { title: "Damage protocol", body: "Inspect garments in front of the customer and note pre-existing issues." },
      { title: "Delivery promise", body: "Under-promise and over-deliver; send an SMS when order is ready." },
      { title: "Feedback loop", body: "Ask for a rating after pickup and resolve complaints within 24 hours." },
    ],
  },
  {
    id: "spotting-guide",
    label: "Spotting Guide",
    icon: SearchCheck,
    description: "Identify and pre-treat common stains safely.",
    content: [
      { title: "Oil / grease", body: "Apply mild dishwash liquid, tamp gently, then wash warm." },
      { title: "Coffee / tea", body: "Rinse from back with cold water; avoid hot water which sets tannins." },
      { title: "Ink / pen marks", body: "Dab with rubbing alcohol on a hidden area first, then rinse." },
      { title: "Sweat yellowing", body: "Pre-soak in enzyme detergent before normal wash cycle." },
    ],
  },
  {
    id: "case-studies",
    label: "Case Studies",
    icon: FileText,
    description: "Real store wins you can replicate.",
    content: [
      { title: "Store A: 30% revenue jump", body: "Added express delivery and premium dry-cleaning; average ticket rose by ₹120." },
      { title: "Store B: Cost control", body: "Tracked cost-per-wash and switched to bulk detergent; saved ₹8,500/month." },
      { title: "Store C: Retention win", body: "Loyalty card + SMS reminders increased repeat visits by 22%." },
      { title: "Store D: Festive spike", body: "Diwali curtain campaign brought 40 new customers in two weeks." },
    ],
  },
];

const sectionIcons: Record<string, typeof TrendingUp> = {
  "increase-sales": TrendingUp,
  "marketing-campaigns": Megaphone,
  "profit-playbooks": BookOpen,
  operations: Settings2,
  "machine-care": Wrench,
  "customer-experience": HeartHandshake,
  "spotting-guide": SearchCheck,
  "case-studies": FileText,
};

const GrowthCentre = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(sections[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeSection = sections.find((s) => s.id === activeId) || sections[0];
  const ActiveIcon = sectionIcons[activeSection.id];

  const handleSelect = (id: string) => {
    setActiveId(id);
    setMobileMenuOpen(false);
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Growth Centre</p>
            <p className="text-[10px] text-muted-foreground">Resources for store owners</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="px-2 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                onClick={() => handleSelect(section.id)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{section.label}</span>
                {isActive && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">Pro tip</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Pick one playbook each week and implement it fully before moving to the next.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-2 py-2 px-3 md:px-4">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate("/shop")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <GoogleLogo />
          <span className="text-base font-semibold text-foreground">Growth Centre</span>

          {/* Mobile menu trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 ml-auto md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetTitle className="sr-only">Growth Centre Menu</SheetTitle>
              {SidebarContent}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-56px)]">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-72 flex-col border-r border-border bg-card sticky top-14 h-[calc(100vh-56px)]">
          {SidebarContent}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 max-w-5xl">
          <div className="flex items-start gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ActiveIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg md:text-xl font-bold text-foreground">{activeSection.label}</h1>
                {activeSection.badge && (
                  <Badge variant="secondary" className="text-[10px] h-5">
                    {activeSection.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{activeSection.description}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {activeSection.content.map((item, index) => (
              <Card key={index} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      {index + 1}
                    </div>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick actions footer */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-full text-xs h-9" onClick={() => navigate("/raise-issue")}>
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Raise a concern
            </Button>
            <Button variant="outline" className="rounded-full text-xs h-9" onClick={() => navigate("/shop")}>
              <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
              Back to shop
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GrowthCentre;
