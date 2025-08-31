import { columns } from "@/app/(admin)/admin/posts/components/columns";
import { DataTable } from "@/app/(admin)/admin/posts/components/data-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/actions/posts";
import { AlertTriangle, FileText, Plus } from "lucide-react";
import Link from "next/link";

const PostsPage = async () => {
  const result = await getPosts();

  // Hata durumunu handle et
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

  // Başarılı durumda veri yoksa
  if (!result.data || result.data.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h1 className="font-semibold">Tüm Gönderiler</h1>
          </div>
          <Link href="/admin/posts/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Gönderi
            </Button>
          </Link>
        </div>
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            Henüz hiç gönderi bulunmuyor. İlk gönderinizi oluşturmak için yukarıdaki butona tıklayın.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h1 className="font-semibold">Tüm Gönderiler</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Toplam {result.data.length} gönderi
          </div>
          <Link href="/admin/posts/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Gönderi
            </Button>
          </Link>
        </div>
      </div>
      <DataTable columns={columns} data={result.data} />
    </div>
  );
};

export default PostsPage;