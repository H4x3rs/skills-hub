import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { skillAPI } from '@/lib/api';
import { toast } from 'sonner';

const SEARCH_DEBOUNCE_MS = 300;

export interface PublicSkill {
  _id: string;
  name: string;
  description: string;
  version?: string;
  category: string;
  tags?: string[];
  downloads?: number;
  rating?: { average?: number; count?: number };
  author?: { _id: string; username: string; fullName?: string; avatar?: string };
  repositoryUrl?: string;
  documentationUrl?: string;
  demoUrl?: string;
  license?: string;
  createdAt?: string;
  lastUpdated?: string;
}

export interface SkillsPagination {
  currentPage: number;
  totalPages: number;
  totalSkills: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const SKILLS_PER_PAGE = 12;

export const useSkills = (
  searchTerm: string = '',
  category: string = 'all',
  page: number = 1
) => {
  const { t } = useTranslation();
  const [skills, setSkills] = useState<PublicSkill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<SkillsPagination>({
    currentPage: 1,
    totalPages: 0,
    totalSkills: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchSkills = useCallback(async (
    q: string = '',
    cat: string = 'all',
    p: number = 1
  ) => {
    const categoryParam = cat === 'all' || !cat ? undefined : cat;
    const trimmedQ = q.trim();

    try {
      setLoading(true);
      setError(null);

      const apiParams: { page: number; limit: number; q?: string; category?: string } = {
        page: p,
        limit: SKILLS_PER_PAGE,
      };
      if (trimmedQ) apiParams.q = trimmedQ;
      if (categoryParam) apiParams.category = categoryParam;

      const res = await skillAPI.search(apiParams);
      const data = res.data;
      setSkills(data.skills || []);
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 0,
        totalSkills: 0,
        hasNext: false,
        hasPrev: false,
      });
    } catch (err: any) {
      console.error('Error fetching skills:', err);
      const msg = err.response?.data?.error || t('skills.fetchError', '获取技能失败');
      setError(msg);
      toast.error(msg);
      setSkills([]);
      setPagination({
        currentPage: 1,
        totalPages: 0,
        totalSkills: 0,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setLoading(false);
    }
  }, [t]);

  const trimmedSearchTerm = (searchTerm ?? '').trim();

  useEffect(() => {
    if (trimmedSearchTerm) {
      const timer = setTimeout(
        () => fetchSkills(searchTerm, category, page),
        SEARCH_DEBOUNCE_MS
      );
      return () => clearTimeout(timer);
    }
    fetchSkills(searchTerm, category, page);
  }, [searchTerm, category, page, fetchSkills]);

  const refetch = useCallback(
    () => fetchSkills(searchTerm, category, page),
    [fetchSkills, searchTerm, category, page]
  );

  return {
    skills,
    loading,
    error,
    pagination,
    refetch,
    fetchSkills,
  };
};
