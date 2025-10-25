"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AssignmentsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto py-10 px-4">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold">التكليفات</h1>
                    <p className="text-muted-foreground">
                        تتبع التكليفات المطلوبة، مواعيد التسليم، وحالة التقديم.
                    </p>
                    <div className="text-center text-muted-foreground py-24 border rounded-lg">
                        <p>قائمة بجميع تكليفاتك ستظهر هنا قريباً.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
