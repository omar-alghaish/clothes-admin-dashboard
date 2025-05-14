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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useGetSettingsQuery, useUpdateBrandSettingsMutation } from "@/redux/settings/settingsApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

const brandSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  brandDescription: z.string().min(10, "Brand description should be at least 10 characters"),
  brandStyle: z.string(),
});

type BrandFormValues = z.infer<typeof brandSchema>;

export function BrandForm() {
  const { data, isLoading, error } = useGetSettingsQuery();
  const [updateBrandSettings, { isLoading: isUpdating }] = useUpdateBrandSettingsMutation();
  const [formError, setFormError] = useState<string | null>(null);
  
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      brandName: data?.data?.brand?.brandName,
        brandDescription: data?.data?.brand?.brandDescription,
        brandStyle: data?.data?.brand?.brandStyle,
    },
  });
console.log(data)
  // Update form when data is loaded
  useEffect(() => {
    if (data?.data?.brand) {
      form.reset({
        brandName: data?.data?.brand?.brandName,
        brandDescription: data?.data?.brand?.brandDescription,
        brandStyle: data?.data?.brand?.brandStyle,
      });
    }
  }, [data, form]);

  async function onSubmit(formData: BrandFormValues) {
    try {
      setFormError(null);
      await updateBrandSettings({
        brandSettings: formData,
        brandId: data?.data?.brand?._id || ''
      }).unwrap();
      toast.success("Brand information updated");
    } catch (err) {
      console.error("Failed to update brand information:", err);
      setFormError("Failed to update brand information. Please try again.");
      toast.error("Failed to update brand information");
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading brand information...</div>;
  }

  if (error && !data) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not load brand information. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div id="brand" className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Brand Information</h3>
        <p className="text-sm text-muted-foreground">
          Define your brand identity and messaging.
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
            name="brandName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="brandDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your brand..."
                    className="min-h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="brandStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Style/Voice</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Professional, Playful, Technical, etc."
                    {...field}
                  />
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
              "Save Brand Settings"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}