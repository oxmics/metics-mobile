import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/useApi";
import { SupplierDashboardType } from "../../types/dashboard";

const useSupplierDashboard = () => {
    const api = useApi();
  
    const query = useQuery({
      queryKey: ["supplier-dashboard"],
      queryFn: async () => {
        const res = await api.get<SupplierDashboardType>(`/supplier-dashboard/`);
        return res.data;
      },
    });
  
    return query;
};
export default useSupplierDashboard;