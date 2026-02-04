import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { Supplier, SupplierMetrics } from '../../types/supplier';

export const useSuppliers = () => {
    const api = useApi();

    return useQuery<Supplier[]>({
        queryKey: ['suppliers'],
        queryFn: async () => {
            const response = await api.get('/organisations/sellers/');
            return response.data;
        },
    });
};

export const useSupplierDetails = (supplierId: string) => {
    const api = useApi();

    return useQuery<Supplier>({
        queryKey: ['supplier-details', supplierId],
        queryFn: async () => {
            const response = await api.get(`/organisations/${supplierId}`);
            return response.data;
        },
        enabled: !!supplierId,
    });
};

export const useSupplierMetrics = (supplierId: string) => {
    const api = useApi();

    return useQuery<SupplierMetrics>({
        queryKey: ['supplier-metrics', supplierId],
        queryFn: async () => {
            const response = await api.get(`/supplier-actions_count/${supplierId}/`);
            return response.data;
        },
        enabled: !!supplierId,
    });
};

export default useSuppliers;
