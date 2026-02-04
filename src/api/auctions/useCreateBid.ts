import { useMutation } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { APIResponseEnum } from '../../types/common';

interface Props {
  id: string;
  note_to_supplier?: string;
  lst_bid_line: any[];
  template_data?: string;
}

const useCreateBid = () => {
  const api = useApi();

  const mutation = useMutation({
    mutationFn: async ({ id, lst_bid_line, note_to_supplier, template_data }: Props) => {
      console.log('=== BID SUBMISSION START ===');
      console.log('Raw inputs:', { id, lst_bid_line, note_to_supplier, template_data });

      try {
        // SIMPLIFIED VERSION FOR TESTING
        let note = note_to_supplier || 'No note';

        // Build minimal payload
        const payload = {
          lst_bid_line,
          note_to_supplier: note,
          template_data,
        };

        console.log('Final payload:', JSON.stringify(payload, null, 2));
        console.log('Sending to:', `/auctions/${id}/bids`);

        const response = await api.post(`/auctions/${id}/bids`, payload);

        console.log('=== BID SUBMISSION SUCCESS ===');
        console.log('Response:', response.data);

        if (response.data) {
          return APIResponseEnum.SUCCESS;
        }
        return APIResponseEnum.INVALID;
      } catch (error: any) {
        console.error('=== BID SUBMISSION FAILED ===');
        console.error('Error:', error.message);
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Data:', JSON.stringify(error.response.data, null, 2));
          // extract meaningful error message
          const msg = error.response.data?.detail || error.response.data?.message || JSON.stringify(error.response.data);
          throw new Error(`Failed: ${error.response.status} - ${msg}`);
        }
        throw error;
      }
    },
  });

  return mutation;
};

export default useCreateBid;
