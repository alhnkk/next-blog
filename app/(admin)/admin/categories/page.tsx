import { columns } from "@/app/(admin)/admin/categories/components/columns";
import { DataTable } from "@/app/(admin)/admin/categories/components/data-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NewCategoryModal } from "@/components/admin/new-category-modal";
import { getCategories } from "@/lib/actions/categories";
import { AlertTriangle, Folder } from "lucide-react";

const CategoriesPage = async () => {
  const result = await getCategories();

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
            <Folder className="h-5 w-5" />
            <h1 className="font-semibold">Tüm Kategoriler</h1>
          </div>
          <NewCategoryModal />
        </div>
        <Alert>
          <Folder className="h-4 w-4" />
          <AlertDescription>
            Henüz hiç kategori bulunmuyor. İlk kategorinizi oluşturmak için yukarıdaki butona tıklayın.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          <h1 className="font-semibold">Tüm Kategoriler</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Toplam {result.data.length} kategori
          </div>
          <NewCategoryModal />
        </div>
      </div>
      <DataTable columns={columns} data={result.data} />
    </div>
  );
};

export default CategoriesPage;