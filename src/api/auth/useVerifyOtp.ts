import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ResetPasswordOtpResponseType } from "../../types/auth";
import { APIResponseEnum } from "../../types/common";

interface Props {
    otp: string;
    userId: string;
}

const useVerifyOtp = () => {

  const mutation = useMutation({
    mutationFn: async ({ userId, otp }: Props) => {
      try {
        const response = await axios.post(
          `${process.env.BASE_URL}/reset-password/${userId}/`,
          {
            otp: otp,
            new_password: "n3w_p@55w0rd"
          }
        );
        
        if (response.data) {
          const data: ResetPasswordOtpResponseType = response.data;
          if (data.message == "Password reset successful"){
            return {status: APIResponseEnum.SUCCESS, message: "Password reset successful"};
          }else{
            return {status: APIResponseEnum.INVALID, message: "Invalid OTP"};
          }
        }else{
          return {status: APIResponseEnum.FAILED, message: ""};
        }
      } catch (error) {
        console.error(error);
        
        return {status: APIResponseEnum.FAILED, message: ""};
      }
    }
  });

  return mutation;
};

export default useVerifyOtp;