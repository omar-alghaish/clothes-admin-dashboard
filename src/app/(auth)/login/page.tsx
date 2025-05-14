"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoginMutation } from "@/redux/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/auth/authSlice";
import { toast, Toaster } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading: isApiLoading }] = useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the login mutation from your API
      const result = await login(formData).unwrap();
      
      // If successful, update the auth state with the returned user and token
      dispatch(
        setCredentials({
          user: result.user,
          token: result.token
        })
      );
      
      toast?.success( "Login successful",);
      
      // Redirect to products page
      router.push("/products");
    } catch (error) {
      // Handle login errors
      console.error("Login failed", error);
      toast?.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login to Dashboard</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@example.com" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full mt-4" type="submit" disabled={isLoading || isApiLoading}>
              {isLoading || isApiLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-800">
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  );
}