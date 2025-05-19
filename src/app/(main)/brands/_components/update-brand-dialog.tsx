// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { useUpdateBrandMutation } from "@/redux/brands/brandsApi";
// import { Brand } from "./brand-columns";
// import { Pencil } from "lucide-react";
// import { toast } from "sonner";

// interface UpdateBrandDialogProps {
//     brand: Brand;
// }

// export function UpdateBrandDialog({ brand }: UpdateBrandDialogProps) {
//     const [open, setOpen] = useState(false);
//     const [updateBrand, { isLoading }] = useUpdateBrandMutation();
    
//     const [formData, setFormData] = useState({
//         active: brand.active,
//     });
    
//     const handleSwitchChange = (checked: boolean) => {
//         setFormData((prev) => ({
//             ...prev,
//             active: checked,
//         }));
//     };
    
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
        
//         try {
//             await updateBrand({
//                 id: brand._id,
//                 // Fix: Change the structure to match what the API expects
//                 brand: {
//                     active: formData.active,
//                 }
//             }).unwrap();
            
//             toast.success("Brand updated successfully");
//             setOpen(false);
//         } catch (error) {
//             toast.error("Failed to update brand");
//             console.error(error);
//         }
//     };
    
//     return (
//         <>
//             <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setOpen(true)}
//                 className="h-8 w-8"
//             >
//                 <Pencil className="h-4 w-4" />
//                 <span className="sr-only">Edit brand</span>
//             </Button>
            
//             <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogContent className="sm:max-w-[600px]">
//                     <form onSubmit={handleSubmit}>
//                         <DialogHeader>
//                             <DialogTitle>Edit Brand</DialogTitle>
//                             <DialogDescription>
//                                 Update brand information. Click save when you're done.
//                             </DialogDescription>
//                         </DialogHeader>
                        
//                         <div className="grid gap-4 py-4">
//                             <div className="flex items-center space-x-2 pt-6">
//                                 <Switch
//                                     id="active"
//                                     checked={formData.active}
//                                     onCheckedChange={handleSwitchChange}
//                                 />
//                                 <Label htmlFor="active">Active</Label>
//                             </div>
//                         </div>
//                         <DialogFooter>
//                             <Button variant="outline" onClick={() => setOpen(false)} type="button">
//                                 Cancel
//                             </Button>
//                             <Button type="submit" disabled={isLoading}>
//                                 {isLoading ? "Saving..." : "Save changes"}
//                             </Button>
//                         </DialogFooter>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }


"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUpdateBrandMutation } from "@/redux/brands/brandsApi";
import { Brand } from "./brand-columns";
import { Pencil, Upload } from "lucide-react";
import { toast } from "sonner";

interface UpdateBrandDialogProps {
  brand: Brand;
}

export function UpdateBrandDialog({ brand }: UpdateBrandDialogProps) {
  const [open, setOpen] = useState(false);
  const [updateBrand, { isLoading }] = useUpdateBrandMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formState, setFormState] = useState({
    brandName: brand.brandName || "",
    active: brand.active,
    logoFile: null as File | null,
    logoPreview: brand.brandLogo || ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      active: checked,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormState((prev) => ({
        ...prev,
        logoFile: file,
        logoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData object for multipart/form-data
    const formData = new FormData();
    formData.append("brandName", formState.brandName);
    formData.append("active", String(formState.active));
    
    // Only append file if a new one was selected
    if (formState.logoFile) {
      formData.append("brandLogo", formState.logoFile);
    }
    
    try {
      await updateBrand({
        id: brand._id,
        brand: formData
      }).unwrap();
      toast.success("Brand updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update brand");
      console.error(error);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-8 w-8"
      >
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit brand</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Brand</DialogTitle>
              <DialogDescription>
                Update brand information. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="brandName" className="text-right">
                  Brand Name
                </Label>
                <Input
                  id="brandName"
                  name="brandName"
                  value={formState.brandName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="brandLogo" className="text-right">
                  Brand Logo
                </Label>
                <div className="col-span-3 flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                    <input
                      ref={fileInputRef}
                      id="brandLogo"
                      name="brandLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {formState.logoFile && (
                      <span className="text-sm text-gray-500">
                        {formState.logoFile.name}
                      </span>
                    )}
                  </div>
                  
                  {formState.logoPreview && (
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                      <img 
                        src={formState.logoPreview} 
                        alt="Brand logo preview" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="active"
                  checked={formState.active}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}