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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming role selection

// Define User Role and User structure locally
type UserRole = 'Admin' | 'Customer' | 'Support'; // Example roles

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

// Mock data for initial users
const initialUsers: User[] = [
  { id: "user-1", name: "Alice Wonderland", email: "alice@example.com", role: "Admin", created_at: new Date().toISOString() },
  { id: "user-2", name: "Bob The Builder", email: "bob@example.com", role: "Customer", created_at: new Date().toISOString() },
  { id: "user-3", name: "Charlie Chaplin", email: "charlie@example.com", role: "Customer", created_at: new Date().toISOString() },
];

// --- AddUserSheet Component ---
const AddUserSheet = ({ onUserAdded }: { onUserAdded: (newUser: User) => void }) => {
  const [formData, setFormData] = React.useState<{ name: string; email: string; role: UserRole }>({
    name: '',
    email: '',
    role: 'Customer', // Default role
  });
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `user-${Date.now()}`, // Simple unique ID
      name: formData.name,
      email: formData.email,
      role: formData.role,
      created_at: new Date().toISOString(),
    };
    onUserAdded(newUser);
    console.log("User added locally:", newUser);
    setFormData({ name: '', email: '', role: 'Customer' }); // Reset form
    setIsOpen(false); // Close sheet
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-ctcColourSet-purpleVib hover:bg-opacity-90">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add New User</SheetTitle>
          <SheetDescription>
            Enter the details for the new user.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-userName">Name</Label>
              <Input
                id="add-userName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="add-userEmail">Email</Label>
              <Input
                id="add-userEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="add-userRole">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData({ ...formData, role: value })
                }
                required
              >
                <SelectTrigger id="add-userRole">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </SheetClose>
            <Button type="submit" className="bg-ctcColourSet-purpleVib">
              Create User
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

// --- EditUserSheet Component ---
interface EditUserSheetProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: (updatedUser: User) => void;
}

const EditUserSheet = ({ user, isOpen, onOpenChange, onUserUpdated }: EditUserSheetProps) => {
  const [formData, setFormData] = React.useState<{ name: string; email: string; role: UserRole }>({
    name: '',
    email: '',
    role: 'Customer',
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      setFormData({ name: '', email: '', role: 'Customer' });
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser: User = {
      ...user, // Keep original id, created_at
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };

    onUserUpdated(updatedUser);
    console.log("User updated locally:", updatedUser);
    onOpenChange(false); // Close sheet
  };

  if (!user) return null; // Don't render if no user selected

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
          <SheetDescription>
            Modify details for user: {user.name} ({user.id.substring(0, 8)}...)
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-userName">Name</Label>
              <Input
                id="edit-userName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-userEmail">Email</Label>
              <Input
                id="edit-userEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-userRole">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData({ ...formData, role: value })
                }
                required
              >
                <SelectTrigger id="edit-userRole">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                </SelectContent>
              </Select>
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
export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = React.useState(false);

  const filteredUsers = React.useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowerSearchTerm) ||
      user.email.toLowerCase().includes(lowerSearchTerm) ||
      user.role.toLowerCase().includes(lowerSearchTerm) ||
      user.id.toLowerCase().includes(lowerSearchTerm)
    );
  }, [users, searchTerm]);

  // --- Action Handlers ---
  const handleUserAdded = (newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to remove this user from the list?")) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      console.log(`Removed user with ID: ${userId}`);
    }
  };

  const handleEditUserClick = (user: User) => {
    setEditingUser(user);
    setIsEditSheetOpen(true);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    setEditingUser(null); // Clear editing state
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
                      <CardTitle className="text-2xl font-bold">User Management</CardTitle>
                      <AddUserSheet onUserAdded={handleUserAdded} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Search Input */}
                    <div className="mb-4 flex items-center">
                      <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Search users by name, email, role, ID..."
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
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <TableRow key={user.id}>
                                <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                      user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                      user.role === 'Support' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800' // Default for Customer
                                    }`}>
                                    {user.role}
                                  </span>
                                </TableCell>
                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditUserClick(user)}
                                    title="Edit user"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteUser(user.id)}
                                    title="Delete user"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="h-24 text-center">
                                No users found {searchTerm ? 'matching your search' : ''}.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Total Count */}
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Total users: {filteredUsers.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        {/* Render the Edit Sheet */}
        <EditUserSheet
          user={editingUser}
          isOpen={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
          onUserUpdated={handleUpdateUser}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}