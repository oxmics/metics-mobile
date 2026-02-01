import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { PurchaseOrderStatusType } from '../../types/purchaseOrder';

const usePurchaseOrderStatus = () => {
    const api = useApi();

    const query = useQuery({
      queryKey: ['purchase-order-status'],
      queryFn: async () => {
        const res = await api.get<PurchaseOrderStatusType[]>('/purchase-order-status/');
        return res.data;
      },
    });

    return query;
};
export default usePurchaseOrderStatus;
