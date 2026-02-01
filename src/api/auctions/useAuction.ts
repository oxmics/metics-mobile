import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { AuctionType } from '../../types/auction';

interface props {
  id: string
}
const useAuctionDetails = ({ id }: props) => {
  const api = useApi();
  const query = useQuery({
    queryKey: ['auction-details', id],
    queryFn: async () => {
      const res = await api.get<AuctionType>(`/auctions/${id}`);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
  return query;
};

export default useAuctionDetails;
