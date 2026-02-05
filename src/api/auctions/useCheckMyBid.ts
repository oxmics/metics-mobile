import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { BidType } from '../../types/bids';

interface Props {
    id: string;
}

const useCheckMyBid = ({ id }: Props) => {
    const api = useApi();

    const query = useQuery({
        queryKey: ['auction-bid', id],
        queryFn: async () => {
            try {
                const response = await api.get<BidType[]>(`/auctions/${id}/bids`);
                console.log('useCheckMyBid: Checking for existing bid', response.data);

                // Response is expected to be an array of bids (likely just one for the seller)
                if (Array.isArray(response.data) && response.data.length > 0) {
                    return response.data[0];
                }
                return null;
            } catch (error) {
                console.error('useCheckMyBid: Error checking bid', error);
                return null;
            }
        },
        enabled: !!id,
        retry: false,
    });

    return query;
};

export default useCheckMyBid;
