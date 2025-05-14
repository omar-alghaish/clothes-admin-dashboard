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
import { toast } from "sonner";
import { useGetSettingsQuery, useUpdateIdentitySettingsMutation } from "@/redux/settings/settingsApi";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

const identitySchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color"),
});

type IdentityFormValues = z.infer<typeof identitySchema>;

export function IdentityForm() {
  const { data, isLoading, error } = useGetSettingsQuery();
  const [updateIdentitySettings, { isLoading: isUpdating }] = useUpdateIdentitySettingsMutation();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  
  const form = useForm<IdentityFormValues>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      primaryColor: "#4F46E5",
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (data?.data.brand) {
      const brand = data.data.brand
      form.reset({
        primaryColor: brand.primaryColor,
      });


      
      // Set logo preview if available
      if (brand.brandLogo) {
        if (brand.brandLogo instanceof File) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setLogoPreview(event.target.result as string);
            }
          };
          reader.readAsDataURL(brand.brandLogo);
        } else {
          // setLogoPreview(brand.brandLogo as string);
        }
      }
    }
  }, [data, form]);

  async function onSubmit(formData: IdentityFormValues) {
    try {
      setFormError(null);
      const updateData = {
        identitySettings: {
          ...formData,
          brandLogo: logoFile || undefined,
        },
        brandId: data?.data?.brand?._id || ''
      };
      
      await updateIdentitySettings(updateData).unwrap();
      toast.success("Brand identity updated");
    } catch (err) {
      console.error("Failed to update brand identity:", err);
      setFormError("Failed to update brand identity. Please try again.");
      toast.error("Failed to update brand identity");
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Check file size (max 2MB)
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo file is too large. Maximum size is 2MB.");
        return;
      }
      
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading brand identity...</div>;
  }

  if (error && !data) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not load brand identity. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div id="identity" className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Brand Identity</h3>
        <p className="text-sm text-muted-foreground">
          Upload your logo and set your brand colors.
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
          <div className="space-y-2">
            <FormLabel>Brand Logo</FormLabel>
            <div className="flex items-center gap-4">
              <div className="border rounded-md w-24 h-24 flex items-center justify-center overflow-hidden bg-gray-50">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-sm text-gray-400">No logo</span>
                )}
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended size: 512x512px. Max 2MB.
                </p>
              </div>
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Brand Color</FormLabel>
                <div className="flex gap-2 items-center">
                  <div
                    className="w-10 h-10 rounded-md border"
                    style={{ backgroundColor: field.value }}
                  />
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </div>
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
              "Save Identity Settings"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}