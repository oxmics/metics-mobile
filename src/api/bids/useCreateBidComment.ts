import { useMutation } from "@tanstack/react-query";
import { useApi } from "../../hooks/useApi";
import { APIResponseEnum } from "../../types/common";

interface Props {
  id: string;
  message: string;
}

const useCreateBidComment = () => {
    const api = useApi();

  const mutation = useMutation({
    mutationFn: async ({ id, message}: Props) => {
      try {
        const response = await api.post(
          `/bids/${id}/comments`,
          {
            "message": message,
          }
        );
        if (response.data) {
          const data = response.data;
          return APIResponseEnum.SUCCESS;
        }else{
          return APIResponseEnum.INVALID;
        }
      } catch (error) {
        console.error("Comment create API Failed!", error);
        return APIResponseEnum.FAILED;
      }
    }
  });

  return mutation;
};

export default useCreateBidComment;