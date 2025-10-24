import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AssignmentsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة التكليفات</CardTitle>
        <CardDescription>
            إضافة وإدارة التكليفات ومتابعة تقديمات الطلاب.
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
