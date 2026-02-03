import { AttachmentType } from './purchaseOrder';

export type AdditionalAttribute = {
    name: string;
    value: string;
};

export type ProductImage = {
    id: string; // Added ID for mapping
    image: string; // URL or base64
};

export type ProductDocument = {
    id?: string; // Optional ID
    name: string;
    document: string; // URL or base64
};

export type Product = {
    id: string;
    name: string;
    description: string;
    product_sub_category: string;
    market_price: string;
    list_price_per_unit: string;
    unit_of_issue: string;
    base_item_id: string;
    is_available: boolean;
    show_in_catalogue: boolean;
    is_inventory_item: boolean;
    additional_attributes: AdditionalAttribute[];
    images: ProductImage[];
    documents: ProductDocument[];
    currency?: string;
};

export type ProductInventoryResponse = {
    inventory: Product[];
    enquiry_count: number;
};

export type EnquiryItem = {
    product_id: string;
    product_name?: string; // API might return this
    quantity: number;
};

export type ProductEnquiry = {
    id: string;
    organisation_name: string;
    email: string; // Requester email
    supplier_email: string;
    items: EnquiryItem[];
    int_status: number; // 0: Pending?, 1: Acknowledged, -1: Rejected
    created_at?: string;
    // Add other fields as necessary from API response
};

export type EnquiryActionPayload = {
    action: 'acknowledge' | 'reject';
};
