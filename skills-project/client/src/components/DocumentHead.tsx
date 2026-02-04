import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { useTranslation } from 'react-i18next';

const PAGE_KEYS: Record<string, string> = {
  '/': 'home',
  '/skills': 'skills',
  '/about': 'about',
  '/docs': 'docs',
  '/login': 'login',
  '/register': 'register',
  '/profile': 'profile',
  '/admin': 'adminPanel',
};

export const DocumentHead = () => {
  const { pathname } = useLocation();
  const { siteTitle, siteDescription } = useSiteSettings();
  const { t } = useTranslation();

  useEffect(() => {
    const baseTitle = siteTitle || 'SkillHub - 智能技能市场';
    const pageKey = PAGE_KEYS[pathname];
    const pageTitle = pageKey ? t(`navigation.${pageKey}`) : null;
    document.title = pageTitle && pageTitle !== `navigation.${pageKey}` ? `${pageTitle} - ${baseTitle}` : baseTitle;
  }, [pathname, siteTitle, t]);

  useEffect(() => {
    const desc = siteDescription || '连接开发者与智能技能的桥梁，让技术更易用';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
  }, [siteDescription]);

  return null;
};
