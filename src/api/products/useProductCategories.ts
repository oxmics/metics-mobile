import { useQuery } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';

export type ProductCategory = {
    id: string;
    name: string;
    slug: string;
    description?: string;
};

export type ProductSubCategory = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    product_category: string;
};

const useProductCategories = () => {
    const api = useApi();

    const categoriesQuery = useQuery({
        queryKey: ['product-categories'],
        queryFn: async () => {
            const res = await api.get<ProductCategory[]>('/product/product-category/');
            return res.data;
        },
    });

    return categoriesQuery;
};

export const useProductSubCategories = (categorySlug?: string) => {
    const api = useApi();

    const subCategoriesQuery = useQuery({
        queryKey: ['product-subcategories', categorySlug],
        queryFn: async () => {
            if (!categorySlug) return [];
            const res = await api.get<ProductSubCategory[]>(
                `/product/product-category/${categorySlug}/product-subcategory/`
            );
            return res.data;
        },
        enabled: !!categorySlug,
    });

    return subCategoriesQuery;
};

export default useProductCategories;
