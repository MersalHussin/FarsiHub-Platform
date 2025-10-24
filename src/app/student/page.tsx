"use client";

import { useAuth } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BookCopy, FileQuestion, ClipboardCheck } from 'lucide-react';

export default function StudentDashboardPage() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">مرحباً بك في لوحة التحكم، {user.name}!</h1>
            <p className="text-muted-foreground">
                من هنا يمكنك متابعة رحلتك التعليمية في اللغة الفارسية. ابدأ بتصفح المحاضرات أو تحقق من واجباتك.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            المحاضرات
                        </CardTitle>
                        <BookCopy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">10+</div>
                        <p className="text-xs text-muted-foreground">
                            محاضرات متاحة
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            الاختبارات
                        </CardTitle>
                        <FileQuestion className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5+</div>
                        <p className="text-xs text-muted-foreground">
                            اختبارات للتمرين
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            التكليفات
                        </CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">
                            تكليفات نشطة
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
