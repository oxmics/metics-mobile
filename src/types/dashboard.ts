export type SupplierDashboardType = {
    total_auctions_count: number,
    clients_count: number,
    supplier_purchase_orders_count: number,
    last_five_auctions: RecentAuctionType[]
}

export type RecentAuctionType = {
    id: string,
    organisation_name: string,
    title: string,
    requisition_number: string,
    need_by_date: string,
    product_category_name: string,
    is_open: boolean
}

export type SupplierActivityLogsType = {
    id: string,
    activity_type: string,
    description: string,
    created_at: string,
    updated_at: string
}

export type BuyerDashboardType = {
    total_rfq_count: number,
    completed_auctions_count: number,
    total_suppliers_count: number,
    recently_added_suppliers_count: number,
    total_purchase_orders_count: number,
    completed_purchase_orders_count: number,
    auctions: BuyerDashboardAuctionType[]
}

export type BuyerDashboardAuctionType = {
    id: string,
    organisation: string,
    organisation_name: string,
    title: string,
    requisition_number: string,
    created_at: string,
    updated_at: string,
    need_by_date: string,
    status: string,
    bid_count: number,
    product_category: string,
    is_open: boolean
}
