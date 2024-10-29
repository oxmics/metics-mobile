import { useMutation } from "@tanstack/react-query";
import { useApi } from "../../hooks/useApi";
import { APIResponseEnum } from "../../types/common";

interface Props {
  id: string;
}

const useAuctionIgnore = () => {
    const api = useApi();

  const mutation = useMutation({
    mutationFn: async ({ id}: Props) => {
      try {
        const response = await api.post(
          `/ignore-auction-header/${id}/`
        );
        if (response.data) {
          const data = response.data;
          return APIResponseEnum.SUCCESS;
        }else{
          return APIResponseEnum.INVALID;
        }
      } catch (error) {
        console.error("Bid ignore API Failed!", error);
        return APIResponseEnum.FAILED;
      }
    }
  });

  return mutation;
};

export default useAuctionIgnore;