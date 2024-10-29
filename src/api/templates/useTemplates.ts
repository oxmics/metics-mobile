import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../hooks/useApi";
import { TemplateType } from "../../types/template";

const useTemplates = () => {
    const api = useApi();
    const query = useQuery({
      queryKey: ["list-templates"],
      queryFn: async () => {
        try {
            const res= await api.get<TemplateType[]>(`/list-templates/`);
            return res.data;
        } catch (error) {
            console.log("Failed to get list templates, Error: ", error);
        }
      },
      refetchOnWindowFocus: false,
    });
    return query;
  };
  
export default useTemplates;