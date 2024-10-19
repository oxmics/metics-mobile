import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/useApi";
import { PurchaseOrderType } from "../../types/purchaseOrder";

interface props {
    id: string
}
const usePurchaseOrder = ({id}: props) => {
    const api = useApi();
    const query = useQuery({
      queryKey: ["purchase-order", id],
      queryFn: async () => {
        const res= await api.get<PurchaseOrderType>(`/purchase-orders/${id}/`);
        return res.data;
      },
      refetchOnWindowFocus: false,
    });
    return query;
  };
  
  export default usePurchaseOrder;