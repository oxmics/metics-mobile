import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { BidType } from '../../types/bids';

interface props {
    id: string
}

const useBids = ({id}: props) => {
    const api = useApi();

    const query = useQuery({
      queryKey: ['bids', id],
      queryFn: async () => {
        const res = await api.get<BidType[]>(`/auctions/${id}/bids`);
        return res.data;
      },
    });

    return query;
};
export default useBids;
