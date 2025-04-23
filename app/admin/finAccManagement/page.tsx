"use client";

import * as React from "react"; // Use React import
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon, TrashIcon, PlusIcon, Search } from "lucide-react";
import {
  Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter,
  SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define AccountType and Account structure locally for mock data
type AccountType = 'Debit' | 'Credit' | 'TFSA' | 'FHSA';

interface Account {
  id: string;
  user_id: string; // Keep user_id for structure consistency
  type: AccountType;
  balance: number;
  created_at: string; // Keep created_at for structure consistency
}

// Mock data for initial accounts
const initialAccounts: Account[] = [
  { id: "acc-1", user_id: "user-1", type: "Debit", balance: 1500.75, created_at: new Date().toISOString() },
  { id: "acc-2", user_id: "user-2", type: "Credit", balance: -500.20, created_at: new Date().toISOString() },
  { id: "acc-3", user_id: "user-1", type: "TFSA", balance: 12000.00, created_at: new Date().toISOString() },
];

// --- AddAccountSheet Component (Manages Form and Calls Callback) ---
const AddAccountSheet = ({ onAccountAdded }: { onAccountAdded: (newAccount: Account) => void }) => {
  const [formData, setFormData] = React.useState<{ accountType: AccountType; balance: number }>({
    accountType: 'Debit', // Default type
    balance: 0,
  });
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create a new account object with a simple unique ID
    const newAccount: Account = {
      id: `acc-${Date.now()}`, // Simple unique ID based on timestamp
      user_id: `user-${Math.floor(Math.random() * 10)}`, // Mock user ID
      type: formData.accountType,
      balance: formData.balance,
      created_at: new Date().toISOString(),
    };

    onAccountAdded(newAccount); // Pass the new account object up to the parent
    console.log("Account added locally:", newAccount); // Log instead of toast
    setFormData({ accountType: 'Debit', balance: 0 }); // Reset form
    setIsOpen(false); // Close the sheet
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {/* This button opens the sheet */}
        <Button className="bg-ctcColourSet-purpleVib hover:bg-opacity-90">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Account
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add New Account</SheetTitle>
          <SheetDescription>
            Enter the details for the new financial account.
          </SheetDescription>
        </SheetHeader>
        {/* Form inside the sheet */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            {/* Account Type Selection */}
            <div>
              <Label htmlFor="accountType">Account Type</Label>
              <Select
                value={formData.accountType}
                onValueChange={(value: AccountType) =>
                  setFormData({ ...formData, accountType: value })
                }
                required // Make field required
              >
                <SelectTrigger id="accountType">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Debit">Debit Card</SelectItem>
                  <SelectItem value="Credit">Credit Card</SelectItem>
                  <SelectItem value="TFSA">TFSA</SelectItem>
                  <SelectItem value="FHSA">FHSA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Initial Balance Input */}
            <div>
              <Label htmlFor="balance">Initial Balance</Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="balance"
                  type="number"
                  step="0.01" // Allow decimals
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                  className="pl-6"
                  placeholder="0.00"
                  required // Make field required
                />
              </div>
            </div>
          </div>
          {/* Sheet Footer with Buttons */}
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </SheetClose>
            <Button
              type="submit"
              className="bg-ctcColourSet-purpleVib"
            >
              Create Account
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

// --- Main Page Component ---
export default function FinAccPage() {
  // State to hold the list of accounts, initialized with mock data
  const [accounts, setAccounts] = React.useState<Account[]>(initialAccounts);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Filter accounts based on search term (using local state)
  const filteredAccounts = React.useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    // Filter the 'accounts' state
    return accounts.filter(acc =>
      acc.id.toLowerCase().includes(lowerSearchTerm) ||
      acc.type.toLowerCase().includes(lowerSearchTerm) ||
      acc.user_id.toLowerCase().includes(lowerSearchTerm) // Or filter by other relevant fields
    );
  }, [accounts, searchTerm]); // Re-filter when accounts list or search term changes

  // --- Action Handlers (Modify Local State) ---

  // Function to add a new account to the local state
  const handleAccountAdded = (newAccount: Account) => {
    setAccounts(prevAccounts => [...prevAccounts, newAccount]); // Add the new account to the existing array
  };

  // Delete account function (modifies local state)
  const handleDeleteAccount = (accountId: string) => {
    if (confirm("Are you sure you want to remove this account from the list?")) {
      setAccounts(prevAccounts => prevAccounts.filter(acc => acc.id !== accountId));
      console.log(`Removed account with ID: ${accountId}`); // Log instead of toast
    }
  };

  // Edit account function (placeholder)
  const handleEditAccount = (accountId: string) => {
    // For now, just log. Later, you could open a modal/sheet prefilled with data.
    console.log(`Edit account with ID: ${accountId}`);
    // Removed toast call
  };

  // --- Render Logic ---
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold">Financial Account Management</CardTitle>
                      {/* Render the AddAccountSheet and pass the handler */}
                      <AddAccountSheet onAccountAdded={handleAccountAdded} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Search Input */}
                    <div className="mb-4 flex items-center">
                      <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Search accounts by ID, Type, User ID..."
                          className="w-full pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Table displays data from local 'filteredAccounts' */}
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[120px]">ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Balance</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAccounts.length > 0 ? (
                            filteredAccounts.map((account) => (
                              <TableRow key={account.id}>
                                <TableCell className="font-mono text-xs">{account.id.substring(0, 8)}...</TableCell>
                                <TableCell>
                                  {/* Style based on type */}
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                      account.type === 'Credit' ? 'bg-red-100 text-red-800' :
                                      account.type === 'Debit' ? 'bg-blue-100 text-blue-800' :
                                      account.type === 'TFSA' ? 'bg-green-100 text-green-800' :
                                      account.type === 'FHSA' ? 'bg-purple-100 text-purple-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                    {account.type}
                                  </span>
                                </TableCell>
                                <TableCell>${account.balance.toFixed(2)}</TableCell>
                                <TableCell className="font-mono text-xs">{account.user_id.substring(0, 8)}...</TableCell>
                                <TableCell>{new Date(account.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                  {/* Buttons call local state handlers */}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditAccount(account.id)}
                                    title="Edit account"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteAccount(account.id)}
                                    title="Delete account"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center">
                                No accounts found {searchTerm ? 'matching your search' : ''}.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Total Count */}
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Total accounts: {filteredAccounts.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}