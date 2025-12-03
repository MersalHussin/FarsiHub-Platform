
"use client";

import { AlertTriangle } from 'lucide-react';

export function PendingApprovalBanner() {
    return (
        <div className="bg-yellow-500 border-b border-yellow-600 text-yellow-950 p-2 text-center text-sm flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>حسابك قيد المراجعة. قد تكون بعض الميزات محدودة حتى تتم الموافقة على حسابك.</span>
        </div>
    );
}
