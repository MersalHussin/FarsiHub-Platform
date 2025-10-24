"use client";

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

export default function StudentProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const getInitials = (name: string) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">الملف الشخصي</h1>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Avatar className="h-24 w-24 text-3xl">
                            <AvatarImage src={user.photoURL || undefined} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className='text-center sm:text-right'>
                            <CardTitle className="text-2xl">{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <h3 className="font-semibold mb-2">تفاصيل الحساب</h3>
                    <div className="text-sm text-muted-foreground">
                        <p><span className="font-medium text-foreground">الدور:</span> طالب</p>
                        <p><span className="font-medium text-foreground">الحالة:</span> <span className="text-primary font-semibold">مفعل</span></p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
