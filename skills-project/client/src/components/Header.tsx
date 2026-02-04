import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Menu, X, Globe, ChevronDown, LogOut, User as UserProfileIcon, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { siteTitle } = useSiteSettings();
  const { pathname } = useLocation();
  const isAdminPage = pathname.startsWith('/admin');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const languages = [
    { code: 'zh-CN', name: 'Chinese', native: '简体中文' },
    { code: 'en-US', name: 'English', native: 'English' },
    { code: 'ja-JP', name: 'Japanese', native: '日本語' },
    { code: 'ko-KR', name: 'Korean', native: '한국어' },
    { code: 'de-DE', name: 'German', native: 'Deutsch' },
    { code: 'fr-FR', name: 'French', native: 'Français' },
    { code: 'ru-RU', name: 'Russian', native: 'Русский' },
    { code: 'ar-SA', name: 'Arabic', native: 'العربية' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto w-full h-16 px-4 md:px-6 flex items-center">
        {/* Logo - always on left */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold">
            <div className="bg-gradient-to-r from-primary to-secondary w-8 h-8 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-primary">{siteTitle?.split(' - ')[0] || 'skillshub'}</span>
          </Link>
          {isAdminPage && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
              <Shield className="h-3.5 w-3.5" />
              {t('admin.adminPanel', '管理后台')}
            </span>
          )}
        </div>

        {/* Desktop: Right-aligned nav and operation buttons */}
        <div className="hidden md:flex flex-1 items-center justify-end ml-8">
          {/* Desktop Navigation - right aligned */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/skills" className="transition-colors hover:text-primary">{t('navigation.skills')}</Link>
            <Link to="/docs" className="transition-colors hover:text-primary">{t('navigation.docs')}</Link>
            <Link to="/skills" className="transition-colors hover:text-primary">{t('navigation.download')}</Link>
            <Link to="/about" className="transition-colors hover:text-primary">{t('navigation.about')}</Link>
            <Link to="/blog" className="transition-colors hover:text-primary">{t('navigation.blog')}</Link>
          </nav>
          
          {/* Gap between nav and operation buttons - increased spacing */}
          <div className="w-10"></div>
          
          {/* Desktop Operation Buttons */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1"
              >
                <Globe className="h-4 w-4 mr-1" />
                <span>{currentLanguage.native}</span>
              </Button>
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg z-50">
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center justify-between ${
                          i18n.language === lang.code ? 'bg-accent font-medium' : ''
                        }`}
                        onClick={() => changeLanguage(lang.code)}
                      >
                        <span>{lang.native} ({lang.name})</span>
                        {i18n.language === lang.code && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {isAuthenticated && user ? (
              // 用户已登录 - 显示用户下拉菜单
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 pl-2 pr-3"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-6 h-6 rounded-full" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <span className="hidden sm:inline-block">{user.username}</span>
                  <ChevronDown className="h-4 w-4 hidden sm:block" />
                </Button>
                
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <UserProfileIcon className="h-4 w-4" />
                        {t('navigation.profile')}
                      </Link>
                      
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        {t('navigation.mySkills')}
                      </Link>
                      
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-accent"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          {t('navigation.adminPanel')}
                        </Link>
                      )}
                      
                      <button
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-accent text-red-600"
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                          navigate('/');
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        {t('navigation.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // 用户未登录 - 显示登录按钮
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-1" />
                  {t('navigation.login')}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile: Only operation buttons and menu button */}
        <div className="ml-auto flex md:hidden items-center gap-1 relative">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
          >
            <Globe className="h-5 w-5" />
          </Button>
          {isLangDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-md shadow-lg z-50">
              <div className="py-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center justify-between ${
                      i18n.language === lang.code ? 'bg-accent font-medium' : ''
                    }`}
                    onClick={() => changeLanguage(lang.code)}
                  >
                    <span>{lang.native} ({lang.name})</span>
                    {i18n.language === lang.code && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          {isAuthenticated && user ? (
              // 移动端用户已登录 - 显示用户下拉菜单
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-6 h-6 rounded-full" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                </Button>
                
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <UserProfileIcon className="h-4 w-4" />
                        {t('navigation.profile')}
                      </Link>
                      
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        {t('navigation.mySkills')}
                      </Link>
                      
                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-accent"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          {t('navigation.adminPanel')}
                        </Link>
                      )}
                      
                      <button
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-accent text-red-600"
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                          navigate('/');
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        {t('navigation.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // 移动端用户未登录 - 显示登录按钮
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          <button 
            className="p-2 rounded-md hover:bg-muted"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <div className="flex flex-col gap-4">
            <Link to="/skills" className="transition-colors hover:text-primary">{t('navigation.skills')}</Link>
            <Link to="/docs" className="transition-colors hover:text-primary">{t('navigation.docs')}</Link>
            <Link to="/skills" className="transition-colors hover:text-primary">{t('navigation.download')}</Link>
            <Link to="/about" className="transition-colors hover:text-primary">{t('navigation.about')}</Link>
            <Link to="/blog" className="transition-colors hover:text-primary">{t('navigation.blog')}</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;