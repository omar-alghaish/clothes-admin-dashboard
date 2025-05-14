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
import { useState, useEffect } from "react";
import { useGetSettingsQuery, useUpdateBusinessSettingsMutation } from "@/redux/settings/settingsApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface BusinessAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface BusinessSettings {
  businessAddress?: BusinessAddress;
  phoneNumber?: string;
  website?: string;
  taxId?: string;
}

const businessSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  website: z.string().url("Must be a valid URL"),
  taxId: z.string(),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

export function BusinessForm() {
  const { data, isLoading, error } = useGetSettingsQuery();
  const [updateBusinessSettings, { isLoading: isUpdating }] = useUpdateBusinessSettingsMutation();
  const [formError, setFormError] = useState<string | null>(null);
  
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phoneNumber: "",
      website: "",
      taxId: "",
    },
  });

  // Update form when data is loaded
  useEffect(() => {
    if (data?.data?.brand) {
      const brand = data.data.brand;
      const address = brand.businessAddress || {};
      
      form.reset({
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
        country: address.country || "",
        phoneNumber: brand.phoneNumber || "",
        website: brand.website || "",
        taxId: brand.taxId || "",
      });
    }
  }, [data, form]);

  async function onSubmit(formData: BusinessFormValues) {
    try {
      setFormError(null);
      
      // Extract address fields and reconstruct the payload
      const { street, city, state, postalCode, country, ...otherFields } = formData;
      
      const businessSettings = {
        ...otherFields,
       businessAddress:{...formData}
      
        
      };
      
      await updateBusinessSettings({
        businessSettings,
        brandId: data?.data?.brand?._id || ''
      }).unwrap();
      
      toast.success("Business details updated");
    } catch (err) {
      console.error("Failed to update business details:", err);
      setFormError("Failed to update business details. Please try again.");
      toast.error("Failed to update business details");
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading business details...</div>;
  }

  if (error && !data) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Could not load business details. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div id="business" className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Business Details</h3>
        <p className="text-sm text-muted-foreground">
          Add your business contact information.
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
            <h4 className="text-sm font-medium">Business Address</h4>
            
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal/ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="taxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID/Business Number</FormLabel>
                <FormControl>
                  <Input placeholder="123456789" {...field} />
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
              "Save Business Settings"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}