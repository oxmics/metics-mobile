import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { SupplierActivityLogsType } from '../../types/dashboard';

const useSupplierActivityLogs = () => {
    const api = useApi();

    const query = useQuery({
      queryKey: ['supplier-activity-logs'],
      queryFn: async () => {
        const res = await api.get<SupplierActivityLogsType[]>('/activity-logs/suppliers/?all=true');
        return res.data;
      },
    });

    return query;
};
export default useSupplierActivityLogs;
