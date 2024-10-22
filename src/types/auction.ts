import { AttachmentType, FocalPointsType } from "./purchaseOrder"

export type AuctionType = {
    id: string,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string,
    organisation: string,
    organization_name: string,
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
    auhtorized_sellers: any[],
    status: string,
    bid_count: number,
    partial_bidding: boolean,
    parital_quantity_bidding: boolean,
    can_compare: boolean,
    incoterms: any,
    bln_incoterms: boolean
}

export type AuctionLinesType = {
    id: string,
    created_at: string,
    updated_at: string,
    created_by: string,
    updated_by: string,
    header: string,
    product_name: string,
    quantity: string,
    uom_code: string,
    brand: string,
    product_description: string,
    target_price: string,
    product_id: string,
    best_bid: string,
    additional_attributes: {id: string, name: string, value: string}[],
    attachments: AttachmentType[]
}

export type CommentType = {
    id: string,
    created_at: string,
    updated_at: string,
    created_by: string,
    auction_header: string,
    message: string,
    author: string
}