import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthContext } from '../context';
import { RootStackParams } from '../navigator';
import { WhiteLogo } from '../components';
import { useForm } from '../hooks';

import { loginStyles } from '../theme';

interface Props extends StackScreenProps<RootStackParams, 'Register'> {}

export const Register = ({ navigation: { replace } }: Props) => {
  //

  const { signUp, errorMessage, removeError } = useContext(AuthContext);

  const { email, password, name, onChange } = useForm({
    name: '',
    email: '',
    password: '',
  });

  const { top } = useSafeAreaInsets();

  const onRegister = () => {
    signUp({ nombre: name, correo: email, password });
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (errorMessage.length === 0) return;
    Alert.alert('Invalid Signup', errorMessage, [
      { text: 'Ok', onPress: removeError },
    ]);
  }, [errorMessage]);

  return (
    <>
      <TouchableWithoutFeedback onPressOut={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: '#5856D6' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              ...loginStyles.formContainer,
            }}>
            {/* Logo */}
            <WhiteLogo />

            {/* Form */}
            <Text style={loginStyles.title}>Register</Text>

            <Text style={loginStyles.label}>Name:</Text>
            <TextInput
              placeholder="User name"
              placeholderTextColor="rgba(255,255,255,0.4)"
              underlineColorAndroid="white"
              selectionColor={
                Platform.OS === 'ios' ? 'white' : 'rgba(255,255,255,0.2)'
              }
              autoCapitalize="words"
              autoCorrect={false}
              onChangeText={value => onChange(value, 'name')}
              value={name}
              onSubmitEditing={() => {
                if (name === '') return Keyboard.dismiss();
                onRegister();
              }}
              style={[
                loginStyles.inputField,
                Platform.OS === 'ios' && loginStyles.inputFieldIOS,
              ]}
            />

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
                onRegister();
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
                onRegister();
              }}
              style={[
                loginStyles.inputField,
                Platform.OS === 'ios' && loginStyles.inputFieldIOS,
              ]}
            />

            {/* Create Button */}
            <View style={loginStyles.btnContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={loginStyles.btn}
                onPress={onRegister}>
                <Text style={loginStyles.btnText}>Create Account</Text>
              </TouchableOpacity>
            </View>

            {/* Back to Login Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => replace('Login')}
              style={{ ...loginStyles.backBtn, top: top + 20 }}>
              <Text style={loginStyles.btnNewUserText}>Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};
