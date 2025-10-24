"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import type { Lecture } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import AddLectureDialog from "./add-lecture-dialog";

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLectures = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "lectures"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const lecturesList: Lecture[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lecture));
      setLectures(lecturesList);
    } catch (error) {
      console.error("Error fetching lectures: ", error);
      toast({
        variant: "destructive",
        title: "فشل تحميل المحاضرات",
        description: "حدث خطأ أثناء جلب بيانات المحاضرات.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة المحاضرات</h2>
          <p className="text-muted-foreground">إضافة وتعديل المحاضرات المتاحة للطلاب.</p>
        </div>
        <AddLectureDialog onLectureAdded={fetchLectures} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lectures.length > 0 ? (
            lectures.map((lecture) => (
              <Card key={lecture.id}>
                <CardHeader>
                  <CardTitle>{lecture.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 h-14">{lecture.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <a href={lecture.pdfUrl} target="_blank" rel="noopener noreferrer">
                      فتح PDF
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground py-12 border rounded-lg">
              <p>لا توجد محاضرات. قم بإضافة محاضرتك الأولى.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
