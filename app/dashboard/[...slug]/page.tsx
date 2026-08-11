"use client";

import { usePathname } from "next/navigation";
import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardCatchAllPage() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md">
        <CardContent className="flex flex-col items-center text-center gap-3 py-10">
          <Construction className="h-10 w-10 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Page Under Development</h2>
          <p className="text-sm text-muted-foreground">
            <span className="font-mono">{pathname}</span> isn&apos;t built yet. Check back soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
