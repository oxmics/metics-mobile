import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum UserType {
    Supplier,
    Buyer
}

type RootStackParamList = {
    Splash: any,
    Login: any;
    ForgotPassword: any;
    Otp: any;
    EnterNewPassword: any;
    BuyerDashboard: any;
    SupplierDashboard: any;
    SupplierPurchaseOrder: any;
    SupplierPurchaseOrderDetails: any;
    BuyerPurchaseOrder: any;
    BuyerPurchaseOrderDetails: any;
};
export type CustomNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export enum APIResponseEnum {
    SUCCESS,
    INVALID,
    FAILED
}