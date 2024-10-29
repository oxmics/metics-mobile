import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/useApi";
import { SupplierActivityLogsType } from "../../types/dashboard";

const useBuyerActivityLogs = () => {
    const api = useApi();
  
    const query = useQuery({
      queryKey: ["supplier-activity-logs"],
      queryFn: async () => {
        const res = await api.get<SupplierActivityLogsType[]>(`/activity-logs/buyers/?all=true`);
        return res.data;
      },
    });
  
    return query;
};
export default useBuyerActivityLogs;