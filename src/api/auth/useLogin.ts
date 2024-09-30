import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LoginResponseEnum, LoginResponseType } from "../../types/auth";
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from '@env';

interface Props {
  email: string;
  password: string;
}

const useLogin = () => {

  const mutation = useMutation({
    mutationFn: async ({ email, password }: Props) => {
      try {
        const response = await axios.post(
          `${BASE_URL}/login/`,
          {
            email,
            password,
          }
        );
        if (response.data) {
          const data: LoginResponseType = response.data;
          await EncryptedStorage.setItem('jwt-token', data.token);
          await EncryptedStorage.setItem('user_id', data.user_id);
          await EncryptedStorage.setItem('email', data.email);
          return LoginResponseEnum.SUCCESS;
        }else{
          return LoginResponseEnum.INVALID;
        }
      } catch (error) {
        console.error("Login API Failed!", error);
        return LoginResponseEnum.FAILED;
      }
    }
  });

  return mutation;
};

export default useLogin;