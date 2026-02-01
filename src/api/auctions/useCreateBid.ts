import { useMutation } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { APIResponseEnum } from '../../types/common';

interface Props {
  id: string;
  note_to_supplier: string;
  lst_bid_line: string;
  template_data: string;
}

const useCreateBid = () => {
  const api = useApi();

  const mutation = useMutation({
    mutationFn: async ({ id, lst_bid_line, note_to_supplier, template_data }: Props) => {
      try {
        console.log({
          lst_bid_line,
          note_to_supplier,
          template_data: template_data ? template_data : JSON.stringify({}),
        });

        const response = await api.post(`/auctions/${id}/bids`, {
          lst_bid_line,
          note_to_supplier,
          template_data: template_data ? template_data : JSON.stringify({}),
        });
        if (response.data) {
          return APIResponseEnum.SUCCESS;
        }
        return APIResponseEnum.INVALID;
      } catch (error) {
        console.error('Bid update API Failed!', error);
        return APIResponseEnum.FAILED;
      }
    },
  });

  return mutation;
};

export default useCreateBid;
