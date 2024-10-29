import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/useApi";
import { BidType } from "../../types/bids";

interface props {
    id: string
}

const useBid = ({id}: props) => {
    const api = useApi();
  
    const query = useQuery({
      queryKey: ["bid", id],
      queryFn: async () => {
        const res = await api.get<BidType>(`/bids/${id}`);
        return res.data;
      },
    });
  
    return query;
};
export default useBid;