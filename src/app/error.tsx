"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <AlertTriangle className="h-24 w-24 text-destructive/50 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">حدث خطأ!</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="outline">
            إعادة المحاولة
          </Button>
          <Button onClick={() => (window.location.href = "/")}>
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}
