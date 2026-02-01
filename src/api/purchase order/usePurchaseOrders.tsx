import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { PurchaseOrderType } from '../../types/purchaseOrder';

const usePurchaseOrders = () => {
    const api = useApi();

    const query = useQuery({
      queryKey: ['purchase-orders'],
      queryFn: async () => {
        const res = await api.get<PurchaseOrderType[]>('/purchase-orders/');
        return res.data;
      },
    });

    return query;
};
export default usePurchaseOrders;
