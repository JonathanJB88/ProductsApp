import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import { AuthContext } from '../context';

export const Protected = () => {
  //

  const { user, token, logOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Protected Screen</Text>

      <Button title="Logout" color="#5856D6" onPress={logOut} />

      <Text style={{ color: 'black', fontSize: 14 }}>
        {JSON.stringify(user, null, 5)}
      </Text>
      <Text style={{ color: 'black', fontSize: 14, marginHorizontal: 20 }}>
        {token}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
});
