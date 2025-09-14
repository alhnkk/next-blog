import { EditCategoryEditor } from "@/components/admin/edit-category-editor";
import { getCategoryById } from "@/lib/actions/categories";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditCategoryPage = async ({ params }: EditCategoryPageProps) => {
  const { id } = await params;
  const categoryId = parseInt(id);
  
  if (isNaN(categoryId)) {
    notFound();
  }

  const result = await getCategoryById(categoryId);

  if (!result.success) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Hata:</strong> {result.error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!result.data) {
    notFound();
  }

  return (
    <div>
      <EditCategoryEditor category={result.data} />
    </div>
  );
};

export default EditCategoryPage;