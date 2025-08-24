import { columns } from "@/app/(admin)/admin/users/components/columns";
import { DataTable } from "@/app/(admin)/admin/users/components/data-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getUsers } from "@/lib/actions/users";
import { AlertTriangle, Users as UsersIcon } from "lucide-react";

const UsersPage = async () => {
  const result = await getUsers();

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
        <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex items-center gap-2">
          <UsersIcon className="h-5 w-5" />
          <h1 className="font-semibold">Tüm Kullanıcılar</h1>
        </div>
        <Alert>
          <UsersIcon className="h-4 w-4" />
          <AlertDescription>
            Henüz hiç kullanıcı bulunmuyor.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-5 w-5" />
          <h1 className="font-semibold">Tüm Kullanıcılar</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Toplam {result.data.length} kullanıcı
        </div>
      </div>
      <DataTable columns={columns} data={result.data} />
    </div>
  );
};

export default UsersPage;