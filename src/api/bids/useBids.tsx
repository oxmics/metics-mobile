import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { BidType } from '../../types/bids';
import { Bid, BidComparison } from '../../types/bid';

interface props {
  id: string
}

const useBids = ({ id }: props) => {
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

export const useAuctionBids = (auctionId: string) => {
  const api = useApi();

  return useQuery<Bid[]>({
    queryKey: ['auction-bids', auctionId],
    queryFn: async () => {
      const response = await api.get(`/auctions/${auctionId}/bids`);
      // Validate/Normalize response
      const rawData = (response.data as any).data || response.data;
      const results = (rawData as any).results || rawData;
      return Array.isArray(results) ? results : [];
    },
    enabled: !!auctionId,
  });
};

export const useBidComparison = (auctionId: string) => {
  const api = useApi();

  return useQuery<BidComparison>({
    queryKey: ['bid-comparison', auctionId],
    queryFn: async () => {
      const response = await api.get(`/auctions/${auctionId}/compare-bids`);
      return response.data;
    },
    enabled: !!auctionId,
  });
};

export const useAwardBid = () => {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (bidId: string) => {
      const response = await api.post(`/create-purchase-order/${bidId}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auction-bids'] });
      queryClient.invalidateQueries({ queryKey: ['bids'] });
      queryClient.invalidateQueries({ queryKey: ['buyer-rfq-history'] });
    },
  });
};

export default useBids;
