import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LoginResponseEnum, LoginResponseType } from "../../types/auth";
import EncryptedStorage from 'react-native-encrypted-storage';

interface Props {
  email: string;
}

const useResetPassword = () => {

  const mutation = useMutation({
    mutationFn: async ({ email }: Props) => {
      try {
        const response = await axios.post(
          `${process.env.BASE_URL}/reset-password/`,
          {
            email,
          }
        );
        if (response.data) {
          const data: LoginResponseType = response.data;
          return LoginResponseEnum.SUCCESS;
        }else{
          return LoginResponseEnum.INVALID;
        }
      } catch (error) {
        return LoginResponseEnum.FAILED;
      }
    }
  });

  return mutation;
};

export default useResetPassword;