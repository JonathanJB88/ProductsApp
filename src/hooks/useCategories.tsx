import { useEffect, useState } from 'react';
import apiCafe from '../api/apiCafe';
import { Categoria, CategoriesResp } from '../interfaces';

export const useCategories = () => {
  //

  const [categories, setCategories] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCategories = async () => {
    const {
      data: { categorias },
    } = await apiCafe.get<CategoriesResp>('/categorias');
    setCategories(categorias);
    setIsLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return {
    categories,
    isLoading,
  };
};
