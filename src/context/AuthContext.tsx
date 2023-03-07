import React, { useReducer, createContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAxiosError } from 'axios';

import { authReducer, AuthState } from './';
import apiCafe from '../api/apiCafe';

import { LoginData, LoginResp, RegisterData, Usuario } from '../interfaces';

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  user: Usuario | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  signUp: ({ nombre, correo, password }: RegisterData) => void;
  signIn: ({ correo, password }: LoginData) => void;
  logOut: () => void;
  removeError: () => void;
};

const authInitState: AuthState = {
  status: 'checking',
  token: null,
  user: null,
  errorMessage: '',
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  //

  const [state, dispatch] = useReducer(authReducer, authInitState);

  const signIn = async ({ correo, password }: LoginData) => {
    try {
      const resp = await apiCafe.post<LoginResp>('/auth/login', {
        correo,
        password,
      });
      const { token, usuario } = resp.data;
      dispatch({ type: 'signUp', payload: { token, user: usuario } });
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data.msg);
        dispatch({
          type: 'addError',
          payload: error.response?.data.msg
            ? 'Invalid email and password'
            : 'Invalid inputs',
        });
      }
    }
  };

  const signUp = async ({ nombre, correo, password }: RegisterData) => {
    try {
      const resp = await apiCafe.post<LoginResp>('/usuarios', {
        nombre,
        correo,
        password,
      });
      const { token, usuario } = resp.data;
      dispatch({ type: 'signUp', payload: { token, user: usuario } });
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data.errors[0].msg);
        dispatch({
          type: 'addError',
          payload: error.response?.data.errors[0].msg
            ? 'Check your inputs: email cannot be already registered and all inputs are required'
            : 'Invalid inputs',
        });
      }
    }
  };
  const logOut = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'logout' });
  };
  const removeError = () => {
    dispatch({ type: 'removeError' });
  };

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      //Token null
      if (!token) return dispatch({ type: 'notAuthenticated' });
      //Valid Token
      const { status, data } = await apiCafe.get<LoginResp>('/auth');
      if (status !== 200) return dispatch({ type: 'notAuthenticated' });
      await AsyncStorage.setItem('token', data.token);
      dispatch({
        type: 'signUp',
        payload: { token: data.token, user: data.usuario },
      });
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        logOut,
        removeError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
