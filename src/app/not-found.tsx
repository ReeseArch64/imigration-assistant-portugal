import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center p-8">
      <MapPin className="mb-4 h-16 w-16 text-muted-foreground" />
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <h2 className="mt-2 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-3 max-w-md text-muted-foreground">
        Looks like you&apos;ve taken a wrong turn on your immigration journey.
        This page doesn&apos;t exist.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
