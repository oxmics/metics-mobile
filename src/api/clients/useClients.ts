import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { Client, ClientMetrics } from '../../types/client';

export const useClients = () => {
    const api = useApi();

    return useQuery<Client[]>({
        queryKey: ['clients'],
        queryFn: async () => {
            const response = await api.get('/organisations/clients/');
            return response.data;
        },
    });
};

export const useClientDetails = (clientId: string) => {
    const api = useApi();

    return useQuery<Client>({
        queryKey: ['client-details', clientId],
        queryFn: async () => {
            const response = await api.get(`/organisations/${clientId}`);
            return response.data;
        },
        enabled: !!clientId,
    });
};

export const useClientMetrics = (clientId: string) => {
    const api = useApi();

    return useQuery<ClientMetrics>({
        queryKey: ['client-metrics', clientId],
        queryFn: async () => {
            const response = await api.get(`/buyer-actions_count/${clientId}/`);
            return response.data;
        },
        enabled: !!clientId,
    });
};

export default useClients;
