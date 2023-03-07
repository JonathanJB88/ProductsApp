import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { AuthContext, ProductsContext } from '../context';
import { ProductsStackParams } from '../navigator';

interface Props extends StackScreenProps<ProductsStackParams, 'Products'> {}

export const Products = ({ navigation: { navigate, setOptions } }: Props) => {
  //
  const { user, logOut } = useContext(AuthContext);
  const { products, loadProducts, deleteProduct } = useContext(ProductsContext);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadBackendProducts = async () => {
    setIsRefreshing(true);
    await loadProducts();
    setIsRefreshing(false);
  };

  const deleteItemProduct = (id: string, productName: string) => {
    if (user?.rol !== 'ADMIN_ROLE') {
      Alert.alert('Warning!!', 'Admin user permissions required.');
      return;
    }

    Alert.alert(`Do you want to delete the product ${productName}?`, '', [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'destructive',
      },
      {
        text: 'Confirm',
        onPress: async () => {
          await deleteProduct(id);
          await loadProducts();
        },
      },
    ]);
  };

  useEffect(() => {
    setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.btnAddProduct}
          onPress={() => navigate('Product', {})}>
          <Icon name="add-circle-outline" size={20} style={styles.addProduct} />
          <Text style={styles.textAddProduct}> Add Product</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <Icon
          name="cube-outline"
          size={28}
          color="#5856D6"
          style={{ marginLeft: 10 }}
        />
      ),
    });
  }, []);

  return (
    <View style={styles.containerProduct}>
      <View style={styles.containerUserLogged}>
        <Icon
          name="person-circle-outline"
          size={25}
          color="rgba(0,0,0,0.7)"
          style={styles.icon}
        />
        <Text style={styles.userName}>{user?.correo}</Text>
      </View>

      <View style={styles.listHeader}>
        <View style={styles.cantProductContainer}>
          <Text style={styles.cantTitle}>Products: </Text>
          <Text style={{ color: 'rgba(0,0,0,0.7)' }}>{products.length}</Text>
        </View>
        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.buttonLogOut}
            onPress={logOut}>
            <Text style={styles.titleLogOut}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={p => p._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigate('Product', { id: item._id, name: item.nombre })
            }
            style={styles.itemProduct}>
            <Text style={styles.productName}>{item.nombre}</Text>
            {
              // Only admin user can delete products
              user?.rol === 'ADMIN_ROLE' && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => deleteItemProduct(item._id, item.nombre)}>
                  <Icon
                    name="close-outline"
                    size={20}
                    color="#F47062"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              )
            }
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={loadBackendProducts}
            // Android only
            progressBackgroundColor="#D5D9D9"
            colors={['white', '#5856D6', 'grey']}
            // iOS only
            tintColor="#5856D6"
            title="Updating..."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerProduct: {
    marginHorizontal: 20,
    marginTop: 20,
    flex: 1,
  },
  productName: {
    fontSize: 18,
    color: 'black',
    textTransform: 'capitalize',
  },
  itemProduct: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginVertical: 5,
  },
  btnAddProduct: {
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#5856D6',
    marginEnd: 20,
    marginTop: 2,
  },
  textAddProduct: {
    color: '#5856D6',
    fontWeight: 'bold',
  },
  addProduct: {
    marginLeft: 6,
    color: '#5856D6',
  },
  containerUserLogged: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 18,
    color: 'black',
  },
  icon: {
    marginRight: 10,
  },
  cantProductContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  cantTitle: {
    marginRight: 5,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.7)',
  },
  buttonLogOut: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F47062',
  },
  titleLogOut: {
    fontSize: 13,
    color: '#F47062',
  },
  listHeader: {
    flexDirection: 'row',
    marginBottom: 28,
    marginTop: 10,
  },
});
