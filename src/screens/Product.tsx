import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { ProductsStackParams } from '../navigator';
import { useCategories, useForm } from '../hooks';
import { ProductsContext } from '../context';

interface Props extends StackScreenProps<ProductsStackParams, 'Product'> {}

export const Product = ({ route, navigation: { setOptions } }: Props) => {
  //

  const { id = '', name = '' } = route.params;

  const [tempUri, setTempUri] = useState<string>('');

  const { categories, isLoading } = useCategories();
  const {
    loadProductById,
    addProduct,
    updateProduct,
    uploadImage,
    isUploadingImg,
  } = useContext(ProductsContext);
  const { _id, categoryId, productName, productImg, onChange, setFormValue } =
    useForm({
      _id: id,
      categoryId: '',
      productName: name,
      productImg: '',
    });

  const loadProduct = async () => {
    if (id.length === 0) return;
    const product = await loadProductById(id);
    const { categoria, img } = product;
    setFormValue({
      _id: id,
      categoryId: categoria._id,
      productName: name,
      productImg: img || '',
    });
  };

  const saveOrUpdateProduct = async () => {
    if (id.length > 0) return updateProduct(categoryId, productName, id);
    if (productName === '') return;
    const auxCategoryId = categoryId || categories[0]._id;
    const addedProduct = await addProduct(auxCategoryId, productName);
    onChange(addedProduct._id, '_id');
  };

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.5 }, resp => {
      if (resp.didCancel) return;
      setTempUri(resp.assets![0].uri!);
      uploadImage(resp, _id);
    });
  };

  const takePhotoFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, resp => {
      if (resp.didCancel) return;
      setTempUri(resp.assets![0].uri!);
      uploadImage(resp, _id);
    });
  };

  useEffect(() => {
    setOptions({
      title: productName ? productName : 'Product name missing',
    });
  }, [productName]);

  useEffect(() => {
    loadProduct();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Product name:</Text>
        <TextInput
          placeholder="your product name..."
          style={styles.textInput}
          autoCapitalize="words"
          value={productName}
          onChangeText={value => onChange(value, 'productName')}
        />

        {/* Picker / Selector */}
        <Text style={styles.label}>Category:</Text>
        {isLoading ? (
          <ActivityIndicator
            size={20}
            color="#5856D6"
            style={{ marginVertical: 15 }}
          />
        ) : (
          <Picker
            selectedValue={categoryId}
            onValueChange={itemValue => onChange(itemValue, 'categoryId')}
            dropdownIconColor="#5856D6">
            {categories.map(c => (
              <Picker.Item label={c.nombre} value={c._id} key={c._id} />
            ))}
          </Picker>
        )}

        <Button title="Save" onPress={saveOrUpdateProduct} color="#5856D6" />

        {_id.length > 0 && (
          <View style={styles.btnsContainer}>
            <Button title="Camera" onPress={takePhoto} color="#5856D6" />
            <View style={{ width: 10 }} />
            <Button
              title="Gallery"
              onPress={takePhotoFromGallery}
              color="#5856D6"
            />
          </View>
        )}

        {productImg.length > 0 && !tempUri && (
          <Image
            source={{ uri: productImg }}
            style={{
              width: '100%',
              height: 300,
              marginTop: 20,
              borderRadius: 20,
            }}
          />
        )}

        {
          // if is uploading image
          isUploadingImg && (
            <>
              <ActivityIndicator
                size={20}
                color="#5856D6"
                style={{ marginVertical: 15 }}
              />
              <Text style={{ textAlign: 'center' }}>Uploading image...</Text>
            </>
          )
        }
        {tempUri && (
          <Image
            source={{ uri: tempUri }}
            style={{
              width: '100%',
              height: 300,
              marginTop: 20,
              borderRadius: 20,
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  label: { fontSize: 18, color: 'black' },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderColor: 'rgba(0,0,0,0.3)',
    marginTop: 5,
    marginBottom: 15,
    height: 45,
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});
