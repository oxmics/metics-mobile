import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ResetPasswordOtpResponseEnum, ResetPasswordOtpResponseType } from "../../types/auth";

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
            return ResetPasswordOtpResponseEnum.SUCCESS;
          }else{
            return ResetPasswordOtpResponseEnum.INVALID;
          }
        }else{
          return ResetPasswordOtpResponseEnum.FAILED;
        }
      } catch (error) {
        console.error(error);
        
        return ResetPasswordOtpResponseEnum.FAILED;
      }
    }
  });

  return mutation;
};

export default useResetPasswordOtp;