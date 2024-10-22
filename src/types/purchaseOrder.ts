export type PurchaseOrderType = {
    id: string,
    details: PurchaseOrderDetailsType[]
    bid_header_details: BidHeaderDetails,
    auction_header: AuctionHeaderType,
    supplier_organisation_details: OrganizationDetailsType,
    buyer_organisation_details: OrganizationDetailsType,
    int_status: -1|0|1,
    total_price: string,
    created_by: string,
    created_at: string
}

export type PurchaseOrderStatusType = {
    id: string,
    document_num: string,
    bid_header: string,
    auction_header: string,
    supplier_organisation_details: {
        id: string,
        name: string,
        email: string,
        contact: string,
        address_line1: string,
        address_line2: string
    },
    buyer_organisation_details: {
        id: string,
        name: string,
        email: string,
        contact: string,
        address_line1: string,
        address_line2: string
    },
    int_status: -1|0|1,
    total_price: string
}

type OrganizationDetailsType = {
    additional_attributes: {id: string, name: string, value: string}[];
    address_line1: string;
    address_line2: string;
    authorised_sellers: string[]; 
    city: string;
    code: string;
    contact: string;
    country: string;
    default_currency: string;
    email: string;
    id: string;
    is_active: boolean;
    is_seller: boolean;
    name: string;
    number_of_employees: number;
    postal_code: string;
    selling_categories: string[]; 
    state: string;
    total_turnover: number;
}

type PurchaseOrderDetailsType = {
    purchase_order: string,
    bid_line: string,
    auction_line: string,
    product_name: string,
    quantity: number,
    price: string,
    total_price: string
}

type BidHeaderDetails = {
    id: string,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string,
    organisation: OrganizationDetailsType,
    auction_header: AuctionHeaderType,
    bidders_bid_number: number,
    bid_status: string,
    type_of_response: string,
    bid_expiration_date: string,
    cancellation_date: string|null,
    disqualify_reason: string|null,
    submit_stage: string,
    note_to_supplier?: string,
    templates: {
        name: string,
        description: string
    }[]
}

type AuctionHeaderType = {
    id: string,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string,
    organisation: string,
    organisation_name: string,
    title: string,
    requisition_number: string,
    product_category: string,
    product_sub_category: string,
    is_open: boolean,
    is_editable: boolean,
    need_by_date: string,
    additional_attributes: {id: string, name: string, value: string}[],
    attachments: AttachmentType[],
    focal_points: FocalPointsType[],
    authorized_sellers: any[],
    status: string,
    bid_count: number,
    partial_bidding: boolean,
    partial_quantity_bidding: boolean,
    can_compare: boolean,
}

export type AttachmentType = {
    id: string,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string,
    auction_header: string,
    name: string,
    description: string,
    file: string
}

export type FocalPointsType = {
    id: string,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string,
    auction_header: string,
    user: UserType,
    role: string
}

type UserType = {
    email: string,
    first_name: string,
    middle_name: string,
    last_name: string
}