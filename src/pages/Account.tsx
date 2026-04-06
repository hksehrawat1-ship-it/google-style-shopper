import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  User,
  Phone,
  ShoppingBag,
  FileText,
  Settings,
  ArrowLeft,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoogleLogo from "@/components/GoogleLogo";

const pastOrders = [
  { id: "ORD-1024", date: "2026-03-28", items: 4, total: 3540, status: "Delivered" },
  { id: "ORD-1019", date: "2026-03-15", items: 2, total: 1680, status: "Delivered" },
  { id: "ORD-1011", date: "2026-02-22", items: 6, total: 8920, status: "Delivered" },
  { id: "ORD-1005", date: "2026-02-10", items: 1, total: 980, status: "Cancelled" },
];

const gstInvoices = [
  { invoice: "INV-2026-0042", order: "ORD-1024", date: "2026-03-28", amount: 3540, gst: 637 },
  { invoice: "INV-2026-0038", order: "ORD-1019", date: "2026-03-15", amount: 1680, gst: 302 },
  { invoice: "INV-2026-0029", order: "ORD-1011", date: "2026-02-22", amount: 8920, gst: 1606 },
];

const Account = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    shippingAddress: "42, MG Road, Bengaluru, Karnataka 560001",
    billingAddress: "42, MG Road, Bengaluru, Karnataka 560001",
    gst: "29ABCDE1234F1Z5",
    password: "••••••••",
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (field: string, value: string) => {
    setEditing(field);
    setEditValue(field === "password" ? "" : value);
  };

  const saveEdit = (field: string) => {
    if (editValue.trim()) {
      setProfile((prev) => ({
        ...prev,
        [field]: field === "password" ? "••••••••" : editValue,
      }));
    }
    setEditing(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditValue("");
  };

  const settingsFields = [
    { key: "name", label: "Name", icon: User, type: "text" },
    { key: "address", label: "Address", icon: Edit2, type: "text" },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
    { key: "gst", label: "GST Number", icon: FileText, type: "text" },
    { key: "password", label: "Password", icon: Settings, type: "password" },
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto flex items-center gap-4 py-3 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/shop")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <GoogleLogo />
          <span className="text-lg font-semibold text-foreground">My Account</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">ID: {profile.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="orders" className="gap-1.5 text-xs sm:text-sm">
              <ShoppingBag className="h-4 w-4" />
              Past Orders
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-1.5 text-xs sm:text-sm">
              <FileText className="h-4 w-4" />
              GST Invoice
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1.5 text-xs sm:text-sm">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Past Orders */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Items</TableHead>
                      <TableHead className="text-right">Total (₹)</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium text-sm">{order.id}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                        <TableCell className="text-center text-sm">{order.items}</TableCell>
                        <TableCell className="text-right text-sm font-medium">
                          ₹{order.total.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={order.status === "Delivered" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GST Invoices */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">GST Invoices</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead>Invoice No.</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount (₹)</TableHead>
                      <TableHead className="text-right">GST (₹)</TableHead>
                      <TableHead className="text-right">Total (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gstInvoices.map((inv) => (
                      <TableRow key={inv.invoice}>
                        <TableCell className="font-medium text-sm text-primary">{inv.invoice}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{inv.order}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{inv.date}</TableCell>
                        <TableCell className="text-right text-sm">
                          ₹{inv.amount.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          ₹{inv.gst.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium">
                          ₹{(inv.amount + inv.gst).toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 p-0">
                {settingsFields.map((field, i) => {
                  const Icon = field.icon;
                  const isEditing = editing === field.key;
                  const currentValue = profile[field.key as keyof typeof profile];

                  return (
                    <div key={field.key}>
                      <div className="flex items-center gap-4 px-6 py-4">
                        <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Label className="text-xs text-muted-foreground">{field.label}</Label>
                          {isEditing ? (
                            <div className="flex items-center gap-2 mt-1">
                              <Input
                                type={field.type}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                placeholder={field.key === "password" ? "Enter new password" : `Enter ${field.label.toLowerCase()}`}
                                className="h-8 text-sm"
                                autoFocus
                              />
                              <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => saveEdit(field.key)}>
                                <Check className="h-4 w-4 text-primary" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={cancelEdit}>
                                <X className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ) : (
                            <p className="text-sm font-medium text-foreground truncate">{currentValue}</p>
                          )}
                        </div>
                        {!isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-primary shrink-0"
                            onClick={() => startEdit(field.key, currentValue)}
                          >
                            Change
                          </Button>
                        )}
                      </div>
                      {i < settingsFields.length - 1 && <Separator />}
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

export default Account;
