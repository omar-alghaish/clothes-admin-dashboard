"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { UserForm } from "./user-form";
import { UserFormValues } from "@/lib/types";
import { toast } from "sonner";
import { useCreateUserMutation } from "@/redux/users/userApi";

const transformFormDataToApiFormat = (formData: UserFormValues) => {
  return {
    name: formData.name,
    email: formData.email,
    role: formData.role || "user",
    status: formData.status || "active",
    phone: formData.phone,
    address: formData.address,
    avatar: formData.avatar,
  };
};

interface AddUserDialogProps {
  onSuccess: () => void;
}

export function AddUserDialog({ onSuccess }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [createUser, { isLoading: isSubmitting }] = useCreateUserMutation();
  
  const handleSubmit = async (values: UserFormValues) => {
    try {
      console.log("Form values:", values);
      
      const apiData = transformFormDataToApiFormat(values);
      console.log("Submitting to API:", apiData);
      
      const result = await createUser(apiData).unwrap();
      console.log("API response:", result);
      
      toast.success("User created successfully");
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.data?.message || "Failed to create user");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:w-[50vw] max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new user to the system.
          </DialogDescription>
        </DialogHeader>
        <UserForm 
          initialData={{}}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}