import { EditPostEditor } from "@/components/admin/edit-post-editor";
import { getPostById } from "@/lib/actions/posts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditPostPage = async ({ params }: EditPostPageProps) => {
  const { id } = await params;
  const postId = parseInt(id);
  
  if (isNaN(postId)) {
    notFound();
  }

  const result = await getPostById(postId);

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

  return (
    <div>
      <EditPostEditor post={result.data} />
    </div>
  );
};

export default EditPostPage;