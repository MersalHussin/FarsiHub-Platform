"use client";

import { useEffect } from 'react';
import { errorEmitter } from '@/lib/error-emitter';
import { FirestorePermissionError } from '@/lib/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error("Caught Firestore Permission Error:", error);
      
      const contextualError = new Error(`
        FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
        ${JSON.stringify({
          path: error.context.path,
          operation: error.context.operation,
          requestResourceData: error.context.requestResourceData,
        }, null, 2)}
      `);
      
      // Throwing the error so Next.js can display it in the development overlay
      throw contextualError;
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
