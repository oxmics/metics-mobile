import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { AuctionType } from '../../types/auction';

const useAuctionHeaders = () => {
    const api = useApi();

    const query = useQuery({
      queryKey: ['auction-header'],
      queryFn: async () => {
        const res = await api.get<{closed_auctions: AuctionType[], open_auctions: AuctionType[]}>('/auctions/');
        return res.data;
      },
    });

    return query;
};
export default useAuctionHeaders;
