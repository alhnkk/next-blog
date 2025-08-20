import { AppAreaChart } from "@/components/admin/app-area-chart";
import { AppBarChart } from "@/components/admin/app-bar-chart";
import AppPieChart from "@/components/admin/app-pie-chart";
import CardList from "@/components/admin/card-list";

const AdminDashboard = () => {
  return <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
    <div className="bg-primary-foreground p-4 rounded-md lg:col-span-2 xl:col-span-1 2xl:col-span-2">
      <AppBarChart />
    </div>
    <div className="bg-primary-foreground p-4 rounded-md"><CardList title="Son Üyeler" /></div>
    <div className="bg-primary-foreground p-4 rounded-md"><AppPieChart /></div>
    <div className="bg-primary-foreground p-4 rounded-md">Test</div>
    <div className="bg-primary-foreground p-4 rounded-md lg:col-span-2 xl:col-span-1 2xl:col-span-2">
      <AppAreaChart />
    </div>
    <div className="bg-primary-foreground p-4 rounded-md"><CardList title="Son Mesajlar" /></div>
  </div>
};

export default AdminDashboard;
