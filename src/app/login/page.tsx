// Placeholder for Login Screen (Screen 13)
// This page would typically not use the (main) layout.
// For now, a simple placeholder.
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">NDSP Stakeholder Login</CardTitle>
          <CardDescription>Access your account or DoDEA resources.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username/Email</Label>
            <Input id="username" type="email" placeholder="user@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link href="/forgot-password" passHref>
              <Button variant="link" className="p-0 h-auto text-accent">Forgot Password?</Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full bg-primary hover:bg-primary/90">Login</Button>
          <Button variant="outline" className="w-full">Login with DoDEA SSO (Placeholder)</Button>
           <p className="text-xs text-muted-foreground text-center">
            Manually created accounts may need to reset password on first login. <cite>[cite: 221]</cite>
          </p>
          <Button variant="link" className="p-0 h-auto text-sm" asChild>
            <Link href="/">Back to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
