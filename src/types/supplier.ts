export interface Supplier {
    id: string;
    name: string;
    email: string;
    contact: string;
    address_line1?: string;
    city?: string;
    country?: string;
    selling_categories?: string[];
    is_seller: boolean;
}

export interface SupplierMetrics {
    total_bids: number;
    total_pos: number;
    win_rate?: number;
    avg_response_time?: number;
}

export interface SupplierCatalogue {
    id: string;
    name: string;
    description?: string;
    products: any[];
}
