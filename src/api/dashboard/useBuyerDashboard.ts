import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { BuyerDashboardType } from '../../types/dashboard';

const useBuyerDashboard = () => {
    const api = useApi();

    const query = useQuery({
      queryKey: ['buyer-dashboard'],
      queryFn: async () => {
        const res = await api.get<BuyerDashboardType>('/dashboard/');
        return res.data;
      },
    });

    return query;
};
export default useBuyerDashboard;
