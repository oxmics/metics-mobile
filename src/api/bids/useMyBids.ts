import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { BidType } from '../../types/bids';

interface props {
    page?: number
}

const useMyBids = ({ page = 1 }: props = {}) => {
    const api = useApi();

    const query = useQuery({
        queryKey: ['my-bids', page],
        queryFn: async () => {
            console.log(`[useMyBids] Fetching page ${page}...`);
            try {
                // API doc: seller "my bids" list lives at /all-bids/
                const res = await api.get<BidType[] | { count: number, next: string | null, previous: string | null, results: BidType[] }>(`/all-bids/?page=${page}`);
                // Check if response has nested 'data' property (like web app implies)
                const rawData = (res.data as any).data || res.data;

                const normalized = Array.isArray(rawData)
                    ? { count: rawData.length, next: null, previous: null, results: rawData }
                    : rawData;
                console.log(`[useMyBids] Success! Items: ${normalized.results?.length}`);
                return normalized;
            } catch (error) {
                console.error('[useMyBids] Error fetching:', error);
                // Alert.alert('Error', 'Could not fetch bids. please check connection.'); // Optional: importing Alert
                throw error;
            }
        },
    });

    return query;
};
export default useMyBids;
