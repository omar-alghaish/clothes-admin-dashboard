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
import { Pencil } from "lucide-react";
import { UserForm } from "./user-form";
import { User, UserFormValues } from "@/lib/types";
import { toast } from "sonner";
import { useUpdateUserMutation } from "@/redux/users/userApi";

const transformFormDataToApiFormat = (formData: UserFormValues) => {
  return {

    role: formData.role,
    active: formData.active,

  };
};

const prepareUserForForm = (user: User): Partial<UserFormValues> => {
  return {

    role: user.role,
    active: user.active,
  };
};

interface UpdateUserDialogProps {
  user: User;
}

export function UpdateUserDialog({ user }: UpdateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateUser, { isLoading: isSubmitting }] = useUpdateUserMutation();

  const initialData = prepareUserForForm(user);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const apiData = transformFormDataToApiFormat(values);

      await updateUser({
        id: user._id || user.id,
        user: apiData
      }).unwrap();

      toast.success("User updated");
      setOpen(false);
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.data?.message || "An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:w-[50vw] max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user details below.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}