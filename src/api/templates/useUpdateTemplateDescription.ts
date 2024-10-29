import { useMutation } from "@tanstack/react-query";
import { useApi } from "../../hooks/useApi";
import { APIResponseEnum } from "../../types/common";

interface Props {
  id: string;
  display_description: string;
}

const useUpdateTemplateDescription = () => {
    const api = useApi();

  const mutation = useMutation({
    mutationFn: async ({ id, display_description}: Props) => {
      try {
        const response = await api.patch(
          `/templates/${id}/`,
          {
            display_description
          }
        );
        if (response.data) {
          const data = response.data;
          return APIResponseEnum.SUCCESS;
        }else{
          return APIResponseEnum.INVALID;
        }
      } catch (error) {
        console.error("Template description update API Failed!", error);
        return APIResponseEnum.FAILED;
      }
    }
  });

  return mutation;
};

export default useUpdateTemplateDescription;