"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { type LectureYear } from "@/lib/types";

const yearMap: Record<LectureYear, string> = {
  first: "الفرقة الأولى",
  second: "الفرقة الثانية",
  third: "الفرقة الثالثة",
  fourth: "الفرقة الرابعة",
};

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState<LectureYear | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user || !selectedYear) {
        toast({
            variant: "destructive",
            title: "الرجاء اختيار فرقتك الدراسية.",
        });
      return;
    }
    setIsLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { year: selectedYear });
      toast({
        title: "تم الحفظ بنجاح!",
        description: "سيتم توجيهك إلى لوحة التحكم.",
      });
      // A hard refresh to ensure the new user data (with year) is fetched by the layout
      window.location.href = '/student';
    } catch (error) {
      console.error("Error updating user year: ", error);
      toast({
        variant: "destructive",
        title: "فشل حفظ البيانات",
        description: "حدث خطأ ما، يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">أهلاً بك يا {user.name}!</CardTitle>
          <CardDescription>
            قبل أن تبدأ، يرجى تحديد فرقتك الدراسية الحالية. سيساعدنا هذا على تخصيص المحتوى لك.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup 
            onValueChange={(value) => setSelectedYear(value as LectureYear)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {Object.keys(yearMap).map((yearKey) => (
              <Label 
                key={yearKey} 
                htmlFor={yearKey}
                className="flex items-center space-x-3 space-x-reverse rounded-md border p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground has-[:checked]:bg-primary has-[:checked]:text-primary-foreground"
              >
                <RadioGroupItem value={yearKey} id={yearKey} className="border-muted-foreground text-primary-foreground" />
                <span className="font-bold">{yearMap[yearKey as LectureYear]}</span>
              </Label>
            ))}
          </RadioGroup>
          <Button onClick={handleSave} className="w-full" disabled={isLoading || !selectedYear}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            حفظ والمتابعة
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
