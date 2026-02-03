import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', formData);
    // 实际应用中这里会调用登录API
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl border shadow-sm">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold font-heading">{t('auth.login.title')}</h2>
            <p className="text-muted-foreground mt-2">
              {t('auth.login.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t('auth.login.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  {t('auth.login.password')}
                </label>
                <a href="#" className="text-sm text-primary hover:underline">
                  {t('auth.login.forgotPassword')}
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm">
                {t('auth.login.rememberMe')}
              </label>
            </div>

            <Button type="submit" className="w-full">
              {t('auth.login.signIn')}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            {t('auth.login.noAccount')}{' '}
            <a href="/register" className="text-primary hover:underline">
              {t('auth.login.signUp')}
            </a>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('auth.login.orContinueWith')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              Google
            </Button>
            <Button variant="outline" className="w-full">
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;