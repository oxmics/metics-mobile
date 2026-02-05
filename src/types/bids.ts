import { AuctionHeaderType, OrganizationDetailsType } from './purchaseOrder';
import { TemplateType } from './template';

export type BidType = {
    id: string,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string,
    organisation: OrganizationDetailsType,
    auction_header: AuctionHeaderType,
    templates: TemplateType[],
    bidders_bid_number: number,
    bid_status: 'awarded' | 'rejected' | 'cancelled' | 'disqualified' | 'withdrawn' | 'submitted' | 'draft',
    type_of_response: string,
    bid_expiration_date: string,
    cancellation_date: string | null,
    disqualify_reason: string | null,
    submit_stage: string,
    note_to_supplier: string,
    bid_lines?: BidLineType[]
}

export type BidLineType = {
    id: string,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string,
    bid_header: string,
    auction_header: string,
    price: string,
    promised_date: string,
    bid_quantity: number
}
