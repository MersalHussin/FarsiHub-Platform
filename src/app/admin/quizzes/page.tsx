import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function QuizzesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة الاختبارات</CardTitle>
        <CardDescription>
            إضافة وإدارة الاختبارات المرتبطة بالمحاضرات.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-24 border rounded-lg">
          <p>سيتم تنفيذ هذه الميزة قريباً.</p>
        </div>
      </CardContent>
    </Card>
  );
}
