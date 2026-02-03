import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { Product } from '../../types/product';

const useSupplierProductDetails = (id: string) => {
    const api = useApi();

    const query = useQuery({
        queryKey: ['product-detail', id],
        queryFn: async () => {
            const res = await api.get<Product>(`/product/product-detail/${id}/`);
            return res.data;
        },
        enabled: !!id,
    });

    return query;
};

export default useSupplierProductDetails;
