import { useMutation } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { APIResponseEnum } from '../../types/common';

interface Props {
  id: string;
  message: string;
}

const useCreateComment = () => {
  const api = useApi();

  const mutation = useMutation({
    mutationFn: async ({ id, message }: Props) => {
      try {
        const response = await api.post(`/auctions/${id}/comments`, {
          message,
        });
        if (response.data) {
          return APIResponseEnum.SUCCESS;
        }
        return APIResponseEnum.INVALID;
      } catch (error) {
        console.error('Comment create API Failed!', error);
        return APIResponseEnum.FAILED;
      }
    },
  });

  return mutation;
};

export default useCreateComment;
