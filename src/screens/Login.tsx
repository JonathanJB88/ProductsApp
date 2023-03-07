import React, { useContext, useEffect } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../navigator';

import { Background, WhiteLogo } from '../components';
import { AuthContext } from '../context';
import { useForm } from '../hooks';

import { loginStyles } from '../theme';

interface Props extends StackScreenProps<RootStackParams, 'Login'> {}

export const Login = ({ navigation: { replace } }: Props) => {
  //
  const { signIn, errorMessage, removeError } = useContext(AuthContext);

  const { email, password, onChange } = useForm({
    email: '',
    password: '',
  });

  const onLogin = () => {
    signIn({ correo: email, password });
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (errorMessage.length === 0) return;
    Alert.alert('Unsuccessful login', errorMessage, [
      { text: 'Ok', onPress: removeError },
    ]);
  }, [errorMessage]);

  return (
    <>
      {/* Background */}
      <Background />

      <TouchableWithoutFeedback onPressOut={() => Keyboard.dismiss()}>
        {/* Keyboard avoid view */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              ...loginStyles.formContainer,
              marginBottom: Platform.OS === 'ios' ? 50 : 65,
              marginTop: Platform.OS === 'android' ? 10 : 0,
            }}>
            {/* Logo */}
            <WhiteLogo />

            {/* Form */}
            <Text style={loginStyles.title}>Login</Text>

            <Text style={loginStyles.label}>Email:</Text>
            <TextInput
              placeholder="username@google.com"
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType="email-address"
              underlineColorAndroid="white"
              selectionColor={
                Platform.OS === 'ios' ? 'white' : 'rgba(255,255,255,0.2)'
              }
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={value => onChange(value, 'email')}
              value={email}
              onSubmitEditing={() => {
                if (email === '') return Keyboard.dismiss();
                onLogin();
              }}
              style={[
                loginStyles.inputField,
                Platform.OS === 'ios' && loginStyles.inputFieldIOS,
              ]}
            />

            <Text style={loginStyles.label}>Password:</Text>
            <TextInput
              placeholder="********"
              placeholderTextColor="rgba(255,255,255,0.4)"
              underlineColorAndroid="white"
              selectionColor={
                Platform.OS === 'ios' ? 'white' : 'rgba(255,255,255,0.2)'
              }
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={value => onChange(value, 'password')}
              value={password}
              onSubmitEditing={() => {
                if (password === '') return Keyboard.dismiss();
                onLogin();
              }}
              style={[
                loginStyles.inputField,
                Platform.OS === 'ios' && loginStyles.inputFieldIOS,
              ]}
            />

            {/* Login Button */}
            <View style={loginStyles.btnContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={loginStyles.btn}
                onPress={onLogin}>
                <Text style={loginStyles.btnText}>Login</Text>
              </TouchableOpacity>
            </View>

            {/* Create new account */}

            <View style={loginStyles.newUserContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => replace('Register')}>
                <Text style={loginStyles.btnNewUserText}>
                  Create new account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};
