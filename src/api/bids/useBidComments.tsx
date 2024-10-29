import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/useApi";
import { BidCommentType } from "../../types/auction";

interface props {
    id: string
}

const useBidComments = ({id}: props) => {
    const api = useApi();
  
    const query = useQuery({
      queryKey: ["bid-comments", id],
      queryFn: async () => {
        const res = await api.get<BidCommentType[]>(`/bids/${id}/comments`);
        return res.data;
      },
    });
  
    return query;
};
export default useBidComments;