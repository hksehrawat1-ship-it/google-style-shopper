import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TicketCheck, Plus, CheckCircle2, Clock, Loader2 } from "lucide-react";
import GoogleLogo from "@/components/GoogleLogo";
import { toast } from "@/hooks/use-toast";

const PROBLEM_CATEGORIES = [
  "A. Machine",
  "B. Manpower",
  "C. Marketing",
  "D. POS",
  "E. Graphic and Design",
  "F. Agreements",
  "G. Owner",
  "H. Logistics & Supply Chain",
  "I. Others",
];

type Status = "Open" | "In Progress" | "Resolved";

interface Ticket {
  id: string;
  storeCode: string;
  category: string;
  description: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "raise_issue_tickets";

const loadTickets = (): Ticket[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const statusMeta: Record<Status, { icon: typeof Clock; className: string }> = {
  Open: { icon: Clock, className: "bg-amber-500/15 text-amber-700 border-amber-500/30" },
  "In Progress": { icon: Loader2, className: "bg-blue-500/15 text-blue-700 border-blue-500/30" },
  Resolved: { icon: CheckCircle2, className: "bg-green-500/15 text-green-700 border-green-500/30" },
};

const RaiseIssue = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [storeCode, setStoreCode] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tab, setTab] = useState("new");

  useEffect(() => {
    setTickets(loadTickets());
  }, []);

  const persist = (list: Ticket[]) => {
    setTickets(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeCode.trim() || !category) {
      toast({ title: "Missing details", description: "Store code and problem category are required.", variant: "destructive" });
      return;
    }
    const now = new Date().toISOString();
    const newTicket: Ticket = {
      id: `TKT-${Date.now().toString().slice(-6)}`,
      storeCode: storeCode.trim().toUpperCase(),
      category,
      description: description.trim(),
      status: "Open",
      createdAt: now,
      updatedAt: now,
    };
    persist([newTicket, ...tickets]);
    toast({ title: "Ticket submitted to RM", description: `${newTicket.id} raised successfully.` });
    setStoreCode("");
    setCategory("");
    setDescription("");
    setTab("tickets");
  };

  // Demo: allow user to cycle status to simulate RM update
  const cycleStatus = (id: string) => {
    const order: Status[] = ["Open", "In Progress", "Resolved"];
    persist(
      tickets.map((t) =>
        t.id === id
          ? { ...t, status: order[(order.indexOf(t.status) + 1) % order.length], updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  return (
    <div className="min-h-screen bg-secondary/30 pb-10">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-3 py-3 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <GoogleLogo />
          <span className="text-base font-semibold text-foreground">Raise Issue</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-5 max-w-2xl">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="new" className="gap-1.5 text-sm">
              <Plus className="h-4 w-4" /> New Issue
            </TabsTrigger>
            <TabsTrigger value="tickets" className="gap-1.5 text-sm">
              <TicketCheck className="h-4 w-4" /> My Tickets
              {tickets.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 text-[10px]">{tickets.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Raise a New Issue</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="storeCode">A. Store Code</Label>
                    <Input
                      id="storeCode"
                      placeholder="e.g. STR-042"
                      value={storeCode}
                      onChange={(e) => setStoreCode(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>B. Problem / Query</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROBLEM_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="desc">Describe the issue (optional)</Label>
                    <Textarea
                      id="desc"
                      rows={4}
                      placeholder="Add any details that will help the RM resolve this faster..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full h-11 rounded-full font-semibold">
                    Submit to RM
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ticket Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tickets.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No tickets yet. Raise your first issue above.
                  </p>
                )}
                {tickets.map((t) => {
                  const meta = statusMeta[t.status];
                  const Icon = meta.icon;
                  return (
                    <div
                      key={t.id}
                      className="border border-border rounded-lg p-3 bg-card"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">{t.id} · {t.storeCode}</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{t.category}</p>
                          {t.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                          )}
                        </div>
                        <button onClick={() => cycleStatus(t.id)} title="Simulate status update">
                          <Badge className={`gap-1 border ${meta.className}`} variant="outline">
                            <Icon className={`h-3 w-3 ${t.status === "In Progress" ? "animate-spin" : ""}`} />
                            {t.status}
                          </Badge>
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 mt-2">
                        Updated {new Date(t.updatedAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default RaiseIssue;
