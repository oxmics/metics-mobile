import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { Product, ProductInventoryResponse } from '../../types/product';

const useSupplierProducts = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['supplier-products'],
        queryFn: async () => {
            const res = await api.get<ProductInventoryResponse>('/product/product-list/');
            return res.data;
        },
    });

    const editProduct = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
            const res = await api.patch<Product>(`/product/product-detail/${id}/`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supplier-products'] });
            queryClient.invalidateQueries({ queryKey: ['product-detail'] });
        },
    });

    const createProduct = useMutation({
        mutationFn: async (data: Partial<Product>) => {
            const res = await api.post<Product>('/product/product-list/', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supplier-products'] });
        },
    });

    return { ...query, editProduct, createProduct };
};

export default useSupplierProducts;
