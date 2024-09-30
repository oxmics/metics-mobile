import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum UserType {
    Supplier,
    Buyer
}

type RootStackParamList = {
    Login: any;
    ForgotPassword: any;
    Otp: any;
    EnterNewPassword: any;
    BuyerDashboard: any;
    SupplierDashboard: any;
};
export type CustomNavigationProp = NativeStackNavigationProp<RootStackParamList>;