import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ResetPasswordOtpResponseType } from "../../types/auth";
import { APIResponseEnum } from "../../types/common";

interface Props {
    otp: string;
    userId: string;
}

const useChangePassword = () => {

  const mutation = useMutation({
    mutationFn: async ({ userId, otp }: Props) => {
      try {
        const response = await axios.post(
          `${process.env.BASE_URL}/reset-password/${userId}`,
          {
            otp: otp,
          }
        );
        
        if (response.data) {
          const data: ResetPasswordOtpResponseType = response.data;
          if (data.user_id){
            return APIResponseEnum.SUCCESS;
          }else{
            return APIResponseEnum.INVALID;
          }
        }else{
          return APIResponseEnum.FAILED;
        }
      } catch (error) {
        console.error(error);
        
        return APIResponseEnum.FAILED;
      }
    }
  });

  return mutation;
};

export default useChangePassword;