import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ResetPasswordOtpResponseType } from "../../types/auth";
import { APIResponseEnum } from "../../types/common";
import { useApi } from "../../hooks/useApi";

interface Props {
  new_password: string,
  old_password: string
}

const useChangePassword = () => {
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({ new_password, old_password }: Props) => {
      try {
        const response = await axios.post(
          `${process.env.BASE_URL}/change-password/`,
          {
            old_password,
            new_password
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