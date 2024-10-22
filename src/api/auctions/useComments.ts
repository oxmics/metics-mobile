import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/useApi";
import { AuctionType, CommentType } from "../../types/auction";

interface props {
    id: string
}
const useComments = ({id}: props) => {
    const api = useApi();
    const query = useQuery({
      queryKey: ["comments", id],
      queryFn: async () => {
        const res= await api.get<CommentType[]>(`/auctions/${id}/comments`);
        return res.data;
      },
      refetchOnWindowFocus: false,
    });
    return query;
  };
  
  export default useComments;