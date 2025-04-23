"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const accountFormSchema = z.object({
    type: z.enum(['CREDIT_CARD', 'CHEQUING', 'SAVING', 'TFSA', 'FHSA', 'RRSP']),
    balance: z.string().refine((val) => !isNaN(Number(val)), {
        message: "Balance must be a number",
    }),
    bankName: z.string().optional(),
    branch: z.string().optional(),
    address: z.string().optional(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

interface Account {
    id: number;
    type: string;
    balance: number;
    bank?: {
        name: string;
        branch: string;
        address: string;
    };
}

interface AccountManagerProps {
    accounts: Account[];
    onAccountsChange: () => void;
}

export function AccountManager({ accounts, onAccountsChange }: AccountManagerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [editingAccount, setEditingAccount] = useState<Account | null>(null)
    const supabase = createClientComponentClient()

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            type: 'CHEQUING',
            balance: '0',
            bankName: '',
            branch: '',
            address: '',
        },
    })

    const onSubmit = async (data: AccountFormValues) => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('Not authenticated')

            if (editingAccount) {
                // Update existing account
                const { error: accountError } = await supabase
                    .from('financial_accounts')
                    .update({
                        type: data.type,
                        balance: Number(data.balance),
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', editingAccount.id)

                if (accountError) throw accountError

                if (data.bankName && data.branch && data.address) {
                    const { error: bankError } = await supabase
                        .from('banks')
                        .update({
                            name: data.bankName,
                            branch: data.branch,
                            address: data.address,
                        })
                        .eq('financial_account_id', editingAccount.id)

                    if (bankError) throw bankError
                }

                toast.success('Account updated successfully')
            } else {
                // Create new account
                const { data: account, error: accountError } = await supabase
                    .from('financial_accounts')
                    .insert([
                        {
                            user_id: session.user.id,
                            type: data.type,
                            balance: Number(data.balance),
                        },
                    ])
                    .select()
                    .single()

                if (accountError) throw accountError

                if (data.bankName && data.branch && data.address) {
                    const { error: bankError } = await supabase
                        .from('banks')
                        .insert([
                            {
                                financial_account_id: account.id,
                                name: data.bankName,
                                branch: data.branch,
                                address: data.address,
                            },
                        ])

                    if (bankError) throw bankError
                }

                toast.success('Account created successfully')
            }

            setIsOpen(false)
            setEditingAccount(null)
            form.reset()
            onAccountsChange()
        } catch (error) {
            console.error('Error saving account:', error)
            toast.error('Failed to save account')
        }
    }

    const handleDelete = async (accountId: number) => {
        try {
            const { error } = await supabase
                .from('financial_accounts')
                .delete()
                .eq('id', accountId)

            if (error) throw error

            toast.success('Account deleted successfully')
            onAccountsChange()
        } catch (error) {
            console.error('Error deleting account:', error)
            toast.error('Failed to delete account')
        }
    }

    const handleEdit = (account: Account) => {
        setEditingAccount(account)
        form.reset({
            type: account.type as any,
            balance: account.balance.toString(),
            bankName: account.bank?.name || '',
            branch: account.bank?.branch || '',
            address: account.bank?.address || '',
        })
        setIsOpen(true)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Financial Accounts</h2>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingAccount ? 'Edit Account' : 'Add New Account'}</DialogTitle>
                            <DialogDescription>
                                {editingAccount ? 'Update your account details' : 'Add a new financial account to track your finances'}
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select account type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
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
                                <FormField
                                    control={form.control}
                                    name="bankName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bank Name (Optional)</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="branch"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Branch (Optional)</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bank Address (Optional)</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">{editingAccount ? 'Update' : 'Create'} Account</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid gap-4">
                {accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-medium">{account.type.replace('_', ' ')}</h3>
                            <p className="text-sm text-gray-500">Balance: ${account.balance.toFixed(2)}</p>
                            {account.bank && (
                                <p className="text-sm text-gray-500">
                                    {account.bank.name} - {account.bank.branch}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleEdit(account)}>
                                <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDelete(account.id)}>
                                <TrashIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 