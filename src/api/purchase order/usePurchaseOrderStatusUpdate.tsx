import { useMutation } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { APIResponseEnum } from '../../types/common';

interface Props {
  id: string;
  status: string;
}

const useUpdatePurchaseOrderStatus = () => {
  const api = useApi();

  const mutation = useMutation({
    mutationFn: async ({ id, status }: Props) => {
      try {
        const response = await api.post('/purchase-order-status/', {
          po_id: id,
          status,
        });
        if (response.data) {
          return APIResponseEnum.SUCCESS;
        }
        return APIResponseEnum.INVALID;
      } catch (error) {
        console.error('Purchase order status update API Failed!', error);
        return APIResponseEnum.FAILED;
      }
    },
  });

  return mutation;
};

export default useUpdatePurchaseOrderStatus;
