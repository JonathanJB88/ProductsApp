import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthContext } from '../context';
import { Login, Register, Protected, Loading } from '../screens';
import { ProductsNavigator } from './';

export type RootStackParams = {
  Login: undefined;
  Register: undefined;
  Protected: undefined;
  ProductsNavigator: undefined;
};

const Stack = createStackNavigator<RootStackParams>();

export const Navigator = () => {
  //

  const { status } = useContext(AuthContext);

  if (status === 'checking') return <Loading />;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      {status !== 'authenticated' ? (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="ProductsNavigator"
            component={ProductsNavigator}
          />
          <Stack.Screen name="Protected" component={Protected} />
        </>
      )}
    </Stack.Navigator>
  );
};
