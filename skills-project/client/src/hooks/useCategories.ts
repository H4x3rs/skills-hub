import { useState, useEffect, useCallback } from 'react';
import { categoryAPI } from '@/lib/api';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export interface Category {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCategories?: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const useCategories = (fetchWhenActive: boolean = true, withPagination: boolean = false) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchCategories = useCallback(async (pageNum: number = page) => {
    try {
      setLoading(true);
      const params = withPagination ? { page: pageNum, limit } : {};
      const response = await categoryAPI.getAll(params);
      const categoriesData = response.data.success !== undefined
        ? response.data.data?.categories || []
        : response.data.categories || [];
      
      if (withPagination && response.data.data?.pagination) {
        setPagination(response.data.data.pagination);
      } else {
        setPagination(null);
      }
      
      if (withPagination) {
        // 分页模式：返回所有分类（包括未激活的）
        setCategories(categoriesData);
      } else {
        // 非分页模式：只返回激活的分类，按order排序（用于下拉选择）
        const activeCategories = categoriesData
          .filter((cat: Category) => cat.isActive)
          .sort((a: Category, b: Category) => a.order - b.order);
        setCategories(activeCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(t('admin.fetchUsersError') || 'Error fetching categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [t, withPagination, limit, page]);

  useEffect(() => {
    if (fetchWhenActive) {
      fetchCategories(page);
    }
  }, [fetchWhenActive, fetchCategories, page]);

  return { categories, loading, pagination, page, setPage, fetchCategories };
};
