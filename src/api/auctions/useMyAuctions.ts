import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { AuctionType } from '../../types/auction';

interface props {
  page: number
}

const useMyAuctions = ({ page }: props) => {
  const api = useApi();

  const query = useQuery({
    queryKey: ['my-auctions', page],
    queryFn: async () => {
      console.log(`[useMyAuctions] Fetching page ${page}...`);
      try {
        const res = await api.get<{ count: number, next: string, previous: string | null, results: AuctionType[] }>(`/my-auctions/?page=${page}`);
        console.log(`[useMyAuctions] Success! Items: ${res.data.results?.length}`);
        return res.data;
      } catch (error) {
        console.error('[useMyAuctions] Error fetching:', error);
        throw error;
      }
    },
  });

  return query;
};
export default useMyAuctions;
