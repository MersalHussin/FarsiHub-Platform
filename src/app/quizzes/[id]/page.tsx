"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { Quiz, Question } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Confetti from 'react-dom-confetti';


export default function TakeQuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { id } = params;

  const fetchQuiz = useCallback(async () => {
    if (typeof id !== 'string') return;
    setLoading(true);
    try {
      const docRef = doc(db, "quizzes", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setQuiz({ id: docSnap.id, ...docSnap.data() } as Quiz);
      } else {
        toast({ variant: "destructive", title: "الاختبار غير موجود" });
        router.push('/lectures');
      }
    } catch (error) {
      console.error("Error fetching quiz: ", error);
      toast({ variant: "destructive", title: "فشل تحميل الاختبار" });
    } finally {
      setLoading(false);
    }
  }, [id, toast, router]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      toast({
        variant: "destructive",
        title: "الرجاء اختيار إجابة",
        description: "يجب عليك اختيار إجابة قبل المتابعة.",
      });
      return;
    }

    const newAnswers = { ...answers, [currentQuestionIndex]: selectedAnswer };
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };
  
  const finishQuiz = async (finalAnswers: Record<number, string>) => {
    if(!quiz || !user) return;
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
        if(finalAnswers[index] === question.correctAnswer) {
            correctCount++;
        }
    });
    const finalScore = (correctCount / quiz.questions.length) * 100;
    setScore(finalScore);
    setIsFinished(true);
    
    if(finalScore > 80) {
        setShowConfetti(true);
    }

    try {
        await addDoc(collection(db, "quizSubmissions"), {
            quizId: quiz.id,
            quizTitle: quiz.title,
            userId: user.uid,
            userName: user.name,
            score: finalScore,
            answers: finalAnswers,
            submittedAt: serverTimestamp(),
        });
        toast({ title: "تم تقديم الاختبار بنجاح!" });
    } catch(error) {
        console.error("Error submitting quiz: ", error);
        toast({ variant: "destructive", title: "فشل تقديم الاختبار" });
    }
  };


  const renderQuizContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full py-24">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (!quiz) {
      return <p className="text-center">لم يتم العثور على الاختبار.</p>;
    }

    if(isFinished) {
        return (
            <Card className="w-full max-w-2xl mx-auto text-center">
                 <Confetti active={ showConfetti } config={{
                    angle: 90,
                    spread: 360,
                    startVelocity: 40,
                    elementCount: 70,
                    dragFriction: 0.12,
                    duration: 3000,
                    stagger: 3,
                    width: "10px",
                    height: "10px",
                    perspective: "500px",
                    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
                 }}/>
                <CardHeader>
                    <CardTitle>لقد أكملت الاختبار!</CardTitle>
                    <CardDescription>هذه هي نتيجتك.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-5xl font-bold">{Math.round(score)}%</p>
                    <p className="text-muted-foreground">
                       أجبت بشكل صحيح على {Math.round(score/100 * quiz.questions.length)} من {quiz.questions.length} أسئلة.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button onClick={() => router.push(`/lectures/${quiz.lectureId}`)}>
                        <ArrowRight className="ml-2 h-4 w-4" />
                        العودة إلى المحاضرة
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    const question = quiz.questions[currentQuestionIndex];
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>
            السؤال {currentQuestionIndex + 1} من {quiz.questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-semibold">{question.text}</p>
          <RadioGroup value={selectedAnswer ?? undefined} onValueChange={setSelectedAnswer}>
            {question.options.map((option, index) => (
              option && (
                <div key={index} className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-base mr-4">
                    {option}
                  </Label>
                </div>
              )
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex === quiz.questions.length - 1 ? "إنهاء الاختبار" : "السؤال التالي"}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-4">
        {renderQuizContent()}
      </main>
      <Footer />
    </div>
  );
}