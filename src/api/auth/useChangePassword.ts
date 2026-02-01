import { useMutation } from '@tanstack/react-query';
import { ResetPasswordOtpResponseType } from '../../types/auth';
import { APIResponseEnum } from '../../types/common';
import { useApi } from '../../hooks/useApi';
import EncryptedStorage from 'react-native-encrypted-storage';

interface Props {
  new_password: string;
  old_password: string;
}

const useChangePassword = () => {
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({ new_password, old_password }: Props) => {
      try {
        const response = await api.post(
          `${process.env.BASE_URL}/change-password/`,
          {
            old_password,
            new_password,
          }
        );

        if (!response.data) {
          return APIResponseEnum.FAILED;
        }

        const data: ResetPasswordOtpResponseType = response.data;
        if (!data.user_id) {
          return APIResponseEnum.INVALID;
        }

        await EncryptedStorage.removeItem('jwt-token');
        await EncryptedStorage.removeItem('user_id');
        await EncryptedStorage.removeItem('email');
        return APIResponseEnum.SUCCESS;
      } catch (error) {
        console.error(error);

        return APIResponseEnum.FAILED;
      }
    },
  });

  return mutation;
};

export default useChangePassword;
