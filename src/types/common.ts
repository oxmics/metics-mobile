import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export enum UserType {
    Supplier,
    Buyer
}

export type RootStackParamList = {
    Splash: any,
    Login: any;
    ForgotPassword: any;
    Otp: any;
    EnterNewPassword: any;
    BuyerDashboard: any;
    SupplierDashboard: any;
    SupplierPurchaseOrder: any;
    SupplierPurchaseOrderDetails: any;
    SupplierRequestHistory: any,
    SupplierRequestDetails: any,
    BuyerPurchaseOrder: any;
    BuyerPurchaseOrderDetails: any;
    BuyerRfqHistory: any;
    BuyerRfqDetails: any
    BuyerBidsDetails: any;
    SupplierTabs: any;
    BuyerTabs: any;
    SupplierProducts: any;
    SupplierProductDetails: { id: string };
    SupplierProductEdit: { id: string };
    SupplierProductCreate: any;
    SupplierProductEnquiries: any;
    SupplierProductEnquiryDetails: { id: string };
    BuyerApprovals: any;
    BuyerApprovalDetails: { taskId: string };
    BuyerSuppliers: any;
    BuyerSupplierDetails: { supplierId: string };
    BuyerBidComparison: { auctionId: string; auctionTitle: string };
    SupplierClients: any;
    SupplierClientDetails: { clientId: string };
};
export type CustomNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export enum APIResponseEnum {
    SUCCESS,
    INVALID,
    FAILED
}
