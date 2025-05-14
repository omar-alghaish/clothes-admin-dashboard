"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useUpdateBrandMutation } from "@/redux/brands/brandsApi";
import { Brand } from "./brand-columns";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface UpdateBrandDialogProps {
    brand: Brand;
}

export function UpdateBrandDialog({ brand }: UpdateBrandDialogProps) {
    const [open, setOpen] = useState(false);
    const [updateBrand, { isLoading }] = useUpdateBrandMutation();

    const [formData, setFormData] = useState({
        active: brand.active,

    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            active: checked,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateBrand({
                id: brand._id,
                brandData: {
                    active: formData.active,


                }
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





                            <div className="flex items-center space-x-2 pt-6">
                                <Switch
                                    id="active"
                                    checked={formData.active}
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