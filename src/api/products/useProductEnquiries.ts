import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../hooks/useApi';
import { ProductEnquiry } from '../../types/product';

const useProductEnquiries = (id?: string) => {
    const api = useApi();
    const queryClient = useQueryClient();

    // Fetch all enquiries
    const listQuery = useQuery({
        queryKey: ['product-enquiries'],
        queryFn: async () => {
            const res = await api.get<ProductEnquiry[]>('/product/enquiries/');
            return res.data;
        },
        enabled: !id,
    });

    // Fetch single enquiry
    const detailQuery = useQuery({
        queryKey: ['product-enquiry', id],
        queryFn: async () => {
            const res = await api.get<ProductEnquiry>(`/product/enquiries/${id}/`);
            return res.data;
        },
        enabled: !!id,
    });

    // Acknowledge Enquiry
    const acknowledgeMutation = useMutation({
        mutationFn: async (enquiryId: string) => {
            await api.patch(`/product/enquiries/${enquiryId}/`, {});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-enquiries'] });
            queryClient.invalidateQueries({ queryKey: ['product-enquiry', id] });
        },
    });

    // Reject Enquiry
    const rejectMutation = useMutation({
        mutationFn: async (enquiryId: string) => {
            await api.delete(`/product/enquiries/${enquiryId}/`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-enquiries'] });
            queryClient.invalidateQueries({ queryKey: ['product-enquiry', id] });
        },
    });

    return {
        ...listQuery,
        detail: detailQuery,
        acknowledge: acknowledgeMutation,
        reject: rejectMutation,
    };
};

export default useProductEnquiries;
