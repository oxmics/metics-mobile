import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/useApi";
import { AuctionLinesType, AuctionType } from "../../types/auction";

interface props {
    id: string
}
const useAuctionLines = ({id}: props) => {
    const api = useApi();
    const query = useQuery({
      queryKey: ["auction-lines", id],
      queryFn: async () => {
        const res= await api.get<AuctionLinesType[]>(`/auctions/${id}/auction-lines`);
        return res.data;
      },
      refetchOnWindowFocus: false,
    });
    return query;
  };
  
  export default useAuctionLines;