"use client";

import * as React from "react";
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
  user_id: string;
  type: AccountType;
  balance: number;
  created_at: string;
}

// Mock data for initial accounts
const initialAccounts: Account[] = [
  { id: "acc-1", user_id: "user-1", type: "Debit", balance: 1500.75, created_at: new Date().toISOString() },
  { id: "acc-2", user_id: "user-2", type: "Credit", balance: -500.20, created_at: new Date().toISOString() },
  { id: "acc-3", user_id: "user-1", type: "TFSA", balance: 12000.00, created_at: new Date().toISOString() },
];

// --- AddAccountSheet Component (Remains the same) ---
const AddAccountSheet = ({ onAccountAdded }: { onAccountAdded: (newAccount: Account) => void }) => {
  const [formData, setFormData] = React.useState<{ accountType: AccountType; balance: number | string }>({
    accountType: 'Debit',
    balance: '',
  });
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBalance = parseFloat(String(formData.balance)) || 0;
    const newAccount: Account = {
      id: `acc-${Date.now()}`,
      user_id: `user-${Math.floor(Math.random() * 10)}`,
      type: formData.accountType,
      balance: finalBalance,
      created_at: new Date().toISOString(),
    };
    onAccountAdded(newAccount);
    console.log("Account added locally:", newAccount);
    setFormData({ accountType: 'Debit', balance: '' });
    setIsOpen(false);
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, balance: value });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
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
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-accountType">Account Type</Label>
              <Select
                value={formData.accountType}
                onValueChange={(value: AccountType) =>
                  setFormData({ ...formData, accountType: value })
                }
                required
              >
                <SelectTrigger id="add-accountType">
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
            <div>
              <Label htmlFor="add-balance">Initial Balance</Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="add-balance"
                  type="text"
                  inputMode="decimal"
                  value={formData.balance}
                  onChange={handleBalanceChange}
                  className="pl-6"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </SheetClose>
            <Button type="submit" className="bg-ctcColourSet-purpleVib">
              Create Account
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

// --- EditAccountSheet Component (New) ---
interface EditAccountSheetProps {
  account: Account | null; // Account being edited
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountUpdated: (updatedAccount: Account) => void;
}

const EditAccountSheet = ({ account, isOpen, onOpenChange, onAccountUpdated }: EditAccountSheetProps) => {
  // State for the form data within the edit sheet
  const [formData, setFormData] = React.useState<{ accountType: AccountType; balance: number | string }>({
    accountType: 'Debit', // Default
    balance: '',
  });

  // Effect to update form data when the account prop changes (sheet opens)
  React.useEffect(() => {
    if (account) {
      setFormData({
        accountType: account.type,
        balance: account.balance, // Keep as number initially
      });
    } else {
      // Reset form if account becomes null (sheet closes unexpectedly)
      setFormData({ accountType: 'Debit', balance: '' });
    }
  }, [account, isOpen]); // Depend on account and isOpen

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return; // Should not happen if sheet is open correctly

    const finalBalance = parseFloat(String(formData.balance)) || 0;

    // Create the updated account object, keeping original ID, user_id, created_at
    const updatedAccount: Account = {
      ...account, // Spread original account data
      type: formData.accountType, // Update type
      balance: finalBalance, // Update balance
    };

    onAccountUpdated(updatedAccount); // Pass the updated account object up
    console.log("Account updated locally:", updatedAccount);
    onOpenChange(false); // Close the sheet
  };

  // Re-use balance change handler
  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, balance: value });
    }
  };

  // Don't render the sheet if no account is selected
  if (!account) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Account</SheetTitle>
          <SheetDescription>
            Modify the details for account ID: {account.id.substring(0, 8)}...
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-accountType">Account Type</Label>
              <Select
                value={formData.accountType}
                onValueChange={(value: AccountType) =>
                  setFormData({ ...formData, accountType: value })
                }
                required
              >
                <SelectTrigger id="edit-accountType">
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
            <div>
              <Label htmlFor="edit-balance">Balance</Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="edit-balance"
                  type="text"
                  inputMode="decimal"
                  value={formData.balance} // Use state value
                  onChange={handleBalanceChange}
                  className="pl-6"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            </SheetClose>
            <Button type="submit" className="bg-ctcColourSet-purpleVib">
              Save Changes
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};


// --- Main Page Component ---
export default function FinAccPage() {
  const [accounts, setAccounts] = React.useState<Account[]>(initialAccounts);
  const [searchTerm, setSearchTerm] = React.useState("");
  // State for managing the edit sheet
  const [editingAccount, setEditingAccount] = React.useState<Account | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false);


  const filteredAccounts = React.useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return accounts.filter(acc =>
      acc.id.toLowerCase().includes(lowerSearchTerm) ||
      acc.type.toLowerCase().includes(lowerSearchTerm) ||
      acc.user_id.toLowerCase().includes(lowerSearchTerm)
    );
  }, [accounts, searchTerm]);

  // --- Action Handlers ---
  const handleAccountAdded = (newAccount: Account) => {
    setAccounts(prevAccounts => [...prevAccounts, newAccount]);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (confirm("Are you sure you want to remove this account from the list?")) {
      setAccounts(prevAccounts => prevAccounts.filter(acc => acc.id !== accountId));
      console.log(`Removed account with ID: ${accountId}`);
    }
  };

  // Open edit sheet and set the account to edit
  const handleEditAccountClick = (account: Account) => {
    setEditingAccount(account); // Set the account to be edited
    setIsEditSheetOpen(true); // Open the sheet
  };

  // Update the account in the main list
  const handleUpdateAccount = (updatedAccount: Account) => {
    setAccounts(prevAccounts =>
      prevAccounts.map(acc =>
        acc.id === updatedAccount.id ? updatedAccount : acc // Find and replace
      )
    );
    setEditingAccount(null); // Clear editing state
    // Sheet closing is handled by its own onOpenChange
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
                      <CardTitle className="text-2xl font-bold">Financial Account Management (Local)</CardTitle>
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

                    {/* Table */}
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
                                  {/* Update onClick for Edit Button */}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditAccountClick(account)} // Pass the specific account
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