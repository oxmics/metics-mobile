export interface Bid {
    id: string;
    auction: string;
    organisation: {
        id: string;
        name: string;
    };
    total_amount?: number;
    currency?: string;
    status: 'submitted' | 'awarded' | 'rejected';
    created_at: string;
    updated_at: string;
}

export interface BidComparison {
    auction_lines: Array<{
        id: string;
        description: string;
        quantity: number;
        unit: string;
    }>;
    bids: Array<{
        bid_id: string;
        supplier_name: string;
        total_price: number;
        currency: string;
        line_prices: Array<{
            line_id: string;
            unit_price: number;
            total_price: number;
        }>;
    }>;
}

export interface AwardPayload {
    bid_id: string;
}
