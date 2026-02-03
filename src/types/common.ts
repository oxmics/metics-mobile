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
};
export type CustomNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export enum APIResponseEnum {
    SUCCESS,
    INVALID,
    FAILED
}
