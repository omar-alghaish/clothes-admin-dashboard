// app/settings/types.ts

export interface Settings {
  // Personal Info Settings
  firstName: string;
  lastName: string;
  email: string;
  
  // Brand Settings
  brandName: string;
  brandDescription: string;
  brandStyle: string;
  
  // Business Settings
  businessAddress: string;
  phoneNumber: string;
  website: string;
  taxId: string;
  
  // Identity Settings
  primaryColor: string;
  brandLogo?: string;
}

// Default values for the forms
export const defaultSettings: Settings = {
  // Personal Info Defaults
  firstName: "",
  lastName: "",
  email: "",
  
  // Brand Defaults
  brandName: "",
  brandDescription: "",
  brandStyle: "",
  
  // Business Defaults
  businessAddress: "",
  phoneNumber: "",
  website: "https://",
  taxId: "",
  
  // Identity Defaults
  primaryColor: "#4F46E5",
};

// Selector functions to get specific parts of settings
export const selectPersonalInfo = (settings: Settings) => ({
  firstName: settings.firstName,
  lastName: settings.lastName,
  email: settings.email,
});

export const selectBrandInfo = (settings: Settings) => ({
  brandName: settings.brandName,
  brandDescription: settings.brandDescription,
  brandStyle: settings.brandStyle,
});

export const selectBusinessInfo = (settings: Settings) => ({
  businessAddress: settings.businessAddress,
  phoneNumber: settings.phoneNumber,
  website: settings.website,
  taxId: settings.taxId,
});

export const selectIdentityInfo = (settings: Settings) => ({
  primaryColor: settings.primaryColor,
  brandLogo: settings.brandLogo,
});