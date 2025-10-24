import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export interface AppUser extends FirebaseUser {
  name: string;
  role: 'student' | 'admin';
  approved: boolean;
  createdAt: Timestamp;
}

export type Lecture = {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  createdAt: Timestamp;
};

export type Student = {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    approved: boolean;
    createdAt: Date;
}
