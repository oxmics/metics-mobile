import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum UserType {
    Supplier,
    Buyer
}

type RootStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
    Otp: undefined;
    EnterNewPassword: undefined;
    BuyerDashboard: undefined;
    SupplierDashboard: undefined;
};
export type CustomNavigationProp = NativeStackNavigationProp<RootStackParamList>;