"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const accountFormSchema = z.object({
  type: z.enum(["CREDIT_CARD", "CHEQUING", "SAVING", "TFSA", "FHSA", "RRSP"]),
  balance: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Balance must be a number",
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface Account {
  id: number;
  type: string;
  balance: number;
}

export function DataTable() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      type: "CHEQUING",
      balance: "0",
    },
  });

  // Fetch accounts from the API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/accounts");
        if (!response.ok) throw new Error("Failed to fetch accounts");
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        toast.error("Failed to load accounts");
      }
    };

    fetchAccounts();
  }, []);

  const handleAddAccount = async (data: AccountFormValues) => {
    try {
      console.log("Sending account data:", {
        type: data.type,
        balance: Number(data.balance),
      });

      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: data.type,
          balance: Number(data.balance),
        }),
      });

      // Enhanced error handling
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });

        let errorMessage = "Failed to add account";
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          if (errorText) {
            errorMessage = errorText;
          }
        }

        throw new Error(errorMessage);
      }

      const newAccount = await response.json();
      setAccounts((prev) => [...prev, newAccount]);
      toast.success("Account added successfully");
      setIsAddAccountOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error adding account:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add account"
      );
    }
  };

  const handleRemoveAccount = async (accountId: number) => {
    try {
      const response = await fetch(`/api/accounts?id=${accountId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to remove account");

      setAccounts((prev) => prev.filter((account) => account.id !== accountId));
      toast.success("Account removed successfully");
    } catch (error) {
      console.error("Error removing account:", error);
      toast.error("Failed to remove account");
    }
  };

  const openEditModal = (account: Account) => {
    setEditingAccount(account);
    form.reset({
      type: account.type as
        | "CREDIT_CARD"
        | "CHEQUING"
        | "SAVING"
        | "TFSA"
        | "FHSA"
        | "RRSP",
      balance: account.balance.toString(),
    });
    setIsAddAccountOpen(true);
  };

  const handleUpdateAccount = async (data: AccountFormValues) => {
    if (!editingAccount) return;

    try {
      const response = await fetch("/api/accounts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingAccount.id,
          type: data.type,
          balance: Number(data.balance),
        }),
      });

      // Enhanced error handling
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });

        let errorMessage = "Failed to update account";
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (e) {
          if (errorText) {
            errorMessage = errorText;
          }
        }

        throw new Error(errorMessage);
      }

      const updatedAccount = await response.json();
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === editingAccount.id ? updatedAccount : account
        )
      );

      toast.success("Account updated successfully");
      setIsAddAccountOpen(false);
      setEditingAccount(null);
      form.reset();
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update account"
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <h2 className="text-lg font-semibold">Accounts</h2>
        <div className="flex items-center gap-2">
          <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-green-400 hover:bg-green-300"
              >
                <PlusIcon />
                <span className="hidden lg:inline">Add Account</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAccount ? "Edit Account" : "Add New Account"}
                </DialogTitle>
                <DialogDescription>
                  Specify the account type and balance.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(
                    editingAccount ? handleAddAccount : handleAddAccount
                  )}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CREDIT_CARD">
                              Credit Card
                            </SelectItem>
                            <SelectItem value="CHEQUING">Chequing</SelectItem>
                            <SelectItem value="SAVING">Saving</SelectItem>
                            <SelectItem value="TFSA">TFSA</SelectItem>
                            <SelectItem value="FHSA">FHSA</SelectItem>
                            <SelectItem value="RRSP">RRSP</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="balance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Balance</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">
                      {editingAccount ? "Update Account" : "Add Account"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Render the table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.type.replace("_", " ")}</TableCell>
                <TableCell>${account.balance.toFixed(2)}</TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditModal(account)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveAccount(account.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
