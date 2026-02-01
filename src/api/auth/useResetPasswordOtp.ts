import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ResetPasswordOtpResponseType } from '../../types/auth';
import { APIResponseEnum } from '../../types/common';

interface Props {
  email: string;
}

const useResetPasswordOtp = () => {

  const mutation = useMutation({
    mutationFn: async ({ email }: Props) => {
      try {
        const response = await axios.post(
          `${process.env.BASE_URL}/reset-password/`,
          {
            email: email,
          }
        );

        if (response.data) {
          const data: ResetPasswordOtpResponseType = response.data;
          if (data.user_id){
            return {status: APIResponseEnum.SUCCESS, user_id: data.user_id};
          }else{
            return {status: APIResponseEnum.INVALID, user_id: ''};
          }
        }else{
          return {status: APIResponseEnum.FAILED, user_id: ''};
        }
      } catch (error) {
        console.error(error);

        return {status: APIResponseEnum.FAILED, user_id: ''};
      }
    },
  });

  return mutation;
};

export default useResetPasswordOtp;
