"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import type { Lecture } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, BookOpen } from "lucide-react";
import Link from "next/link";

export default function StudentLecturesPage() {
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
          <h2 className="text-2xl font-bold">المحاضرات</h2>
          <p className="text-muted-foreground">تصفح جميع المحاضرات المتاحة.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lectures.length > 0 ? (
            lectures.map((lecture) => (
              <Card key={lecture.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{lecture.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3 h-14">{lecture.description}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/student/lectures/${lecture.id}`}>
                      <BookOpen className="ml-2 h-4 w-4" />
                      عرض التفاصيل
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground py-12 border rounded-lg">
              <p>لا توجد محاضرات متاحة حالياً.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
