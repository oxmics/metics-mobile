export interface Client {
    id: string;
    name: string;
    email: string;
    contact: string;
    address_line1?: string;
    city?: string;
    country?: string;
    is_buyer?: boolean;
}

export interface ClientMetrics {
    total_auctions: number;
    total_pos: number;
    avg_order_value?: number;
    total_spend?: number;
}
