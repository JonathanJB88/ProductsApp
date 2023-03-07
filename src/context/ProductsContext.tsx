import React, { createContext, useEffect, useState } from 'react';
import { ImagePickerResponse } from 'react-native-image-picker';
import { Platform } from 'react-native';

import apiCafe from '../api/apiCafe';
import { Producto, ProductsResp } from '../interfaces';

type ProductsContextProps = {
  products: Producto[];
  isUploadingImg: boolean;
  loadProducts: () => Promise<void>;
  addProduct: (categoryId: string, productName: string) => Promise<Producto>;
  updateProduct: (
    categoryId: string,
    productName: string,
    productId: string,
  ) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  loadProductById: (productId: string) => Promise<Producto>;
  uploadImage: (data: any, productId: string) => Promise<void>;
};

export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  //

  const [products, setProducts] = useState<Producto[]>([]);
  const [isUploadingImg, setIsUploadingImg] = useState<boolean>(false);

  const loadProducts = async () => {
    const {
      data: { productos },
    } = await apiCafe.get<ProductsResp>('/productos?limite=50');
    setProducts([...productos]);
  };

  const addProduct = async (
    categoryId: string,
    productName: string,
  ): Promise<Producto> => {
    const { data } = await apiCafe.post<Producto>('/productos', {
      nombre: productName,
      categoria: categoryId,
    });
    setProducts([...products, data]);
    return data;
  };

  const updateProduct = async (
    categoryId: string,
    productName: string,
    productId: string,
  ) => {
    const { data } = await apiCafe.put<Producto>(`/productos/${productId}`, {
      nombre: productName,
      categoria: categoryId,
    });
    const updatedProducts = products.map(product =>
      product._id === productId ? { ...product, ...data } : product,
    );
    setProducts(updatedProducts);
  };

  const deleteProduct = async (productId: string) => {
    await apiCafe.delete(`/productos/${productId}`);
    const updatedProducts = products.filter(
      product => product._id !== productId,
    );
    setProducts(updatedProducts);
  };

  const loadProductById = async (productId: string): Promise<Producto> => {
    const { data } = await apiCafe.get<Producto>(`/productos/${productId}`);
    return data;
  };

  const uploadImage = async (data: ImagePickerResponse, productId: string) => {
    setIsUploadingImg(true);
    const params = {
      uri:
        Platform.OS === 'ios'
          ? data.assets![0].uri!.replace('file://', '')
          : data.assets![0].uri!,
      type: data.assets![0].type!,
      name: data.assets![0].fileName!,
    };
    const fileToUpload = JSON.parse(JSON.stringify(params));
    const formData = new FormData();
    formData.append('archivo', fileToUpload);

    try {
      const resp = await apiCafe.put(
        `/uploads/productos/${productId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setIsUploadingImg(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        isUploadingImg,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        loadProductById,
        uploadImage,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};
