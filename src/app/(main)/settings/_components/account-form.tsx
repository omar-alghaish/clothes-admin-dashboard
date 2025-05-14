"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast , Toaster} from "sonner";
import { 
  useGetSettingsQuery, 
  useUpdatePersonalInfoMutation, 
  useUpdatePasswordMutation 
} from "@/redux/settings/settingsApi"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useGetMeQuery } from "@/redux/auth/authApi";
import { current } from "@reduxjs/toolkit";

// Personal information schema
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

// Password schema
const passwordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPasswordConfirm: z.string(),
}).refine((data) => data.newPassword === data.newPasswordConfirm, {
  message: "Passwords do not match",
  path: ["newPasswordConfirm"],
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function AccountForms() {
  return (
    <div id="account" className="space-y-8">
      <PersonalInfoForm />
      <PasswordForm />
    </div>
  );
}

function PersonalInfoForm() {
  const { data, isLoading, error } = useGetMeQuery();
  const [updatePersonalInfo, { isLoading: isUpdating }] = useUpdatePersonalInfoMutation();
  const [formError, setFormError] = useState<string | null>(null);
  
  console.log(data)
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: data?.data?.user?.firstName,
      lastName: data?.data?.user?.lastName,
      email: data?.data?.user?.email,
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (data?.data.user) {
      form.reset({
        firstName: data?.data?.user?.firstName,
        lastName: data?.data?.user?.lastName,
        email: data?.data?.user?.email,
      });
    }
  }, [data, form]);

  async function onSubmit(formData: PersonalInfoFormValues) {
    try {
      setFormError(null);
      await updatePersonalInfo(formData).unwrap();
      toast.success("Personal information updated");
    } catch (err) {
      console.error("Failed to update personal information:", err);
      setFormError("Failed to update personal information. Please try again.");
      toast.error("Failed to update personal information");
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading personal information...</div>;
  }

  if (error && !data) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not load personal information. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Personal Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your personal account details.
        </p>
      </div>

      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Personal Information"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

function PasswordForm() {
  const [updatePassword, { isLoading: isUpdating }] = useUpdatePasswordMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    try {
      setFormError(null);
      await updatePassword(data).unwrap();
      toast.success("Password updated successfully");
      form.reset(); // Clear the form after successful update
    } catch (err) {
      console.error("Failed to update password:", err);
      setFormError("Failed to update password. Please try again.");
      toast.error("Failed to update password");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-sm text-muted-foreground">
          Update your account password.
        </p>
      </div>

      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPasswordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}