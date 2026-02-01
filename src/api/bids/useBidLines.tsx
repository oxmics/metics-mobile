import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { BidLineType } from '../../types/bids';

interface props {
    id: string
}

const useBidLines = ({id}: props) => {
    const api = useApi();

    const query = useQuery({
      queryKey: ['bid-lines', id],
      queryFn: async () => {
        const res = await api.get<BidLineType[]>(`/bids/${id}/bid-lines`);
        return res.data;
      },
    });

    return query;
};
export default useBidLines;
