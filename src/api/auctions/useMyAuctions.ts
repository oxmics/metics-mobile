import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/useApi";
import { AuctionType } from "../../types/auction";

interface props {
    page: number
  }

const useMyAuctions = ({page}:props) => {
    const api = useApi();
  
    const query = useQuery({
      queryKey: ["my-auctions", page],
      queryFn: async () => {
        const res = await api.get<{count: number, next: string, previous:string|null, results:AuctionType[]}>(`/my-auctions/?page=${page}`);
        return res.data;
      },
    });
  
    return query;
};
export default useMyAuctions;