import { Platform, StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    height: 600,
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  label: {
    marginTop: Platform.OS === 'ios' ? 25 : 10,
    color: 'white',
    fontWeight: 'bold',
  },
  inputField: {
    color: 'white',
    fontSize: 20,
  },
  inputFieldIOS: {
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    paddingBottom: 5,
  },
  btnContainer: {
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 50 : 20,
  },
  btn: {
    borderWidth: 2,
    borderColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 100,
  },
  btnText: {
    color: 'white',
    fontSize: 18,
  },
  newUserContainer: {
    alignItems: 'flex-end',
    marginTop: 15,
  },
  btnNewUserText: {
    color: 'white',
    fontSize: 14,
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
