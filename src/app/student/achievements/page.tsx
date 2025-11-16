"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Loader2, FileQuestion, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface Submission {
    id: string;
    quizTitle: string;
    score: number;
    submittedAt: {
        toDate: () => Date;
    };
    lectureId: string;
    subjectId: string;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    date: Date;
    type: 'quiz' | 'lecture';
    icon: React.ReactNode;
}

export default function StudentAchievementsPage() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();

    const fetchAchievements = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch Quiz Completions
            const q = query(
                collection(db, "quizSubmissions"),
                where("userId", "==", user.uid),
                orderBy("submittedAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const quizAchievements = querySnapshot.docs.map(doc => {
                const data = doc.data() as Submission;
                return {
                    id: `quiz-${doc.id}`,
                    title: `أكملت اختبار: ${data.quizTitle}`,
                    description: `أحرزت ${Math.round(data.score)}% في هذا الاختبار.`,
                    date: data.submittedAt.toDate(),
                    type: 'quiz',
                    icon: <FileQuestion className="h-6 w-6 text-blue-500" />,
                } as Achievement;
            });
            
            // TODO: Fetch Lecture Views when implemented
            const lectureAchievements: Achievement[] = [
                // Example of what a lecture achievement would look like
                // {
                //     id: 'lecture-123',
                //     title: 'ذاكرت محاضرة: مقدمة في الشعر الفارسي',
                //     description: 'لقد أكملت استعراض هذه المحاضرة.',
                //     date: new Date(),
                //     type: 'lecture',
                //     icon: <BookOpen className="h-6 w-6 text-green-500" />
                // }
            ];

            const allAchievements = [...quizAchievements, ...lectureAchievements].sort((a, b) => b.date.getTime() - a.date.getTime());
            
            setAchievements(allAchievements);

        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "فشل تحميل الإنجازات",
            });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        fetchAchievements();
    }, [fetchAchievements]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-amber-500" />
                <div>
                    <h1 className="text-3xl font-bold">الإنجازات</h1>
                    <p className="text-muted-foreground">
                        سجل بإنجازاتك التعليمية. كل خطوة هي تقدم!
                    </p>
                </div>
            </div>
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : achievements.length > 0 ? (
                 <div className="space-y-4">
                    {achievements.map(ach => (
                        <Card key={ach.id}>
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <div className="p-3 rounded-full bg-muted">
                                  {ach.icon}
                                </div>
                                <div className="flex-1">
                                    <CardTitle>{ach.title}</CardTitle>
                                    <CardDescription>
                                        {format(ach.date, 'PPP')}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-24 border rounded-lg bg-card">
                    <p className="text-lg mb-2">لم تحقق أي إنجازات بعد.</p>
                    <p>ابدأ رحلتك الآن بمذاكرة محاضرة أو حل اختبار.</p>
                     <Button asChild className="mt-4">
                        <Link href="/lectures">تصفح المحاضرات وابدأ</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
