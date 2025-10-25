"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { Lecture } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, FileQuestion, ClipboardCheck, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function LectureDetailsPage() {
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (typeof id !== 'string') return;
    async function fetchLecture() {
      setLoading(true);
      try {
        const docRef = doc(db, "lectures", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLecture({ id: docSnap.id, ...docSnap.data() } as Lecture);
        } else {
          toast({ variant: "destructive", title: "المحاضرة غير موجودة" });
        }
      } catch (error) {
        console.error("Error fetching lecture: ", error);
        toast({ variant: "destructive", title: "فشل تحميل المحاضرة" });
      } finally {
        setLoading(false);
      }
    }
    fetchLecture();
  }, [id, toast]);

  const pageContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
  
    if (!lecture) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold">لم يتم العثور على المحاضرة</h2>
          <p className="text-muted-foreground">قد تكون المحاضرة التي تبحث عنها قد حُذفت.</p>
        </div>
      );
    }

    return (
        <div className="space-y-6">
            <div>
            <Button variant="ghost" onClick={() => router.push('/lectures')} className="mb-4">
                <ArrowRight className="ml-2 h-4 w-4" />
                العودة للمحاضرات
            </Button>
            <h1 className="text-3xl font-bold">{lecture.title}</h1>
            <p className="text-lg text-muted-foreground mt-2">{lecture.description}</p>
            </div>
            <Separator />
    
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ملف المحاضرة</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    افتح ملف PDF الخاص بالمحاضرة للمراجعة والدراسة.
                </p>
                <Button asChild>
                    <a href={lecture.pdfUrl} target="_blank" rel="noopener noreferrer">
                    فتح PDF
                    </a>
                </Button>
                </CardContent>
            </Card>
    
            <Card className="bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الاختبار</CardTitle>
                <FileQuestion className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    اختبر فهمك للمحاضرة من خلال هذا الاختبار القصير.
                </p>
                <Button variant="secondary" disabled>
                    بدء الاختبار (قريباً)
                </Button>
                </CardContent>
            </Card>
    
            <Card className="bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">التكليف</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    عرض تفاصيل التكليف المطلوب لهذه المحاضرة.
                </p>
                <Button variant="secondary" disabled>
                    عرض التكليف (قريباً)
                </Button>
                </CardContent>
            </Card>
            </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-4">
        {pageContent()}
      </main>
      <Footer />
    </div>
  );
}
