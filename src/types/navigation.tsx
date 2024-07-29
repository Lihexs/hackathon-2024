// src/types/navigation.ts
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';


export type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type RegisterPageNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;
export type SignInPageNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;
export type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainScreen'>;