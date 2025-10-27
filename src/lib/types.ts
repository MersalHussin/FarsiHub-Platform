import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export interface AppUser extends FirebaseUser {
  name: string;
  role: 'student' | 'admin';
  approved: boolean;
  createdAt: Timestamp;
  year?: LectureYear;
}

export type LectureYear = "first" | "second" | "third" | "fourth";

export type Question = {
  text: string;
  options: string[];
  correctAnswer: string;
};

export type Quiz = {
    title: string;
    questions: Question[];
};

export type Lecture = {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  createdAt: Timestamp;
  year: LectureYear;
  quiz?: Quiz;
};

export type Student = {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    approved: boolean;
    createdAt: Date;
    year?: LectureYear;
}
