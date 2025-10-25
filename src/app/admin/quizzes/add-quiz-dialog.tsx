"use client";

import { useState, useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addDoc, collection, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { type Lecture } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";

const questionSchema = z.object({
  text: z.string().min(5, "يجب أن يكون السؤال 5 أحرف على الأقل."),
  options: z.array(z.string().min(1, "الخيار لا يمكن أن يكون فارغًا.")).min(2, "يجب أن يكون هناك خياران على الأقل."),
  correctAnswer: z.string().min(1, "الرجاء تحديد الإجابة الصحيحة."),
});

const formSchema = z.object({
  title: z.string().min(3, "يجب أن يكون العنوان 3 أحرف على الأقل."),
  lectureId: z.string({ required_error: "الرجاء ربط الاختبار بمحاضرة." }),
  questions: z.array(questionSchema).min(1, "يجب إضافة سؤال واحد على الأقل."),
});

type AddQuizDialogProps = {
  onQuizAdded: () => void;
};

export default function AddQuizDialog({ onQuizAdded }: AddQuizDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lectures, setLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    async function fetchLectures() {
      if (!isOpen) return;
      try {
        const q = query(collection(db, "lectures"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const lecturesList: Lecture[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lecture));
        setLectures(lecturesList);
      } catch (error) {
        toast({ variant: "destructive", title: "فشل تحميل المحاضرات" });
      }
    }
    fetchLectures();
  }, [isOpen, toast]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });
  
  const selectedLectureTitle = useMemo(() => {
    const lectureId = form.watch("lectureId");
    return lectures.find(l => l.id === lectureId)?.title;
  }, [form.watch("lectureId"), lectures]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await addDoc(collection(db, "quizzes"), {
        ...values,
        lectureTitle: selectedLectureTitle,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "تمت إضافة الاختبار",
        description: "تمت إضافة الاختبار بنجاح.",
      });
      form.reset();
      setIsOpen(false);
      onQuizAdded();
    } catch (error) {
      console.error("Error adding quiz: ", error);
      toast({
        variant: "destructive",
        title: "فشل إضافة الاختبار",
        description: "حدث خطأ أثناء إضافة الاختبار.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة اختبار
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>إضافة اختبار جديد</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل الاختبار الجديد، أضف الأسئلة، واربطه بمحاضرة.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-[60vh] p-4">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عنوان الاختبار</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lectureId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>المحاضرة المرتبطة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر محاضرة لربط الاختبار بها" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {lectures.map(lecture => (
                            <SelectItem key={lecture.id} value={lecture.id}>
                              {lecture.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>الأسئلة</FormLabel>
                  <FormDescription>
                    أضف أسئلة الاختبار، الخيارات، وحدد الإجابة الصحيحة.
                  </FormDescription>
                  <div className="space-y-4 mt-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="border p-4 rounded-md space-y-3 relative">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 left-2 h-6 w-6" 
                            onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>

                        <FormField
                          control={form.control}
                          name={`questions.${index}.text`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>نص السؤال {index + 1}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`questions.${index}.correctAnswer`}
                          render={({ field: radioField }) => (
                              <FormItem className="space-y-3">
                                  <FormLabel>الخيارات والإجابة الصحيحة</FormLabel>
                                  <RadioGroup
                                    onValueChange={radioField.onChange}
                                    defaultValue={radioField.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <div className="space-y-2">
                                        {[0, 1, 2, 3].map((optionIndex) => (
                                        <FormField
                                            key={optionIndex}
                                            control={form.control}
                                            name={`questions.${index}.options.${optionIndex}`}
                                            render={({ field }) => (
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                <div className="flex items-center gap-2 w-full">
                                                    <RadioGroupItem value={field.value} />
                                                    <Input {...field} placeholder={`خيار ${optionIndex + 1}`} />
                                                </div>
                                                </FormControl>
                                            </FormItem>
                                            )}
                                        />
                                        ))}
                                    </div>
                                  </RadioGroup>
                                  <FormMessage />
                              </FormItem>
                          )}
                          />
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => append({ text: "", options: ["", "", "", ""], correctAnswer: "" })}
                  >
                    <PlusCircle className="ml-2 h-4 w-4" />
                    إضافة سؤال
                  </Button>
                   <FormMessage>{form.formState.errors.questions?.message}</FormMessage>
                </div>
              </div>
            </ScrollArea>
            
            <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  إلغاء
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                إضافة الاختبار
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}