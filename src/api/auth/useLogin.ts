import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { LoginResponseEnum, LoginResponseType } from '../../types/auth';
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
          },
          {
            timeout: 15000, // 15 second timeout
          }
        );
        if (response.data) {
          const data: LoginResponseType = response.data;
          await EncryptedStorage.setItem('jwt-token', data.token);
          await EncryptedStorage.setItem('user_id', data.user_id);
          await EncryptedStorage.setItem('email', data.email);
          return LoginResponseEnum.SUCCESS;
        } else {
          return LoginResponseEnum.INVALID;
        }
      } catch (error: any) {
        console.error('Login API Failed!', error);

        // Log detailed error information for debugging
        if (error.response) {
          console.error('Error status:', error.response.status);
          console.error('Error data:', JSON.stringify(error.response.data, null, 2));
          console.error('Error headers:', error.response.headers);
        }

        // Network or timeout errors
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          console.error('Login timeout');
          return LoginResponseEnum.FAILED;
        }

        if (error.code === 'ERR_NETWORK' || !error.response) {
          console.error('Network error');
          return LoginResponseEnum.FAILED;
        }

        // Bad request (400) - validation error
        if (error.response?.status === 400) {
          console.error('Bad request - validation error');
          return LoginResponseEnum.INVALID;
        }

        // Invalid credentials (401/403)
        if (error.response?.status === 401 || error.response?.status === 403) {
          return LoginResponseEnum.INVALID;
        }

        // Server errors (500+)
        return LoginResponseEnum.FAILED;
      }
    },
  });

  return mutation;
};

export default useLogin;
