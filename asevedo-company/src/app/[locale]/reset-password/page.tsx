'use client';

/**
 * Reset Password Page
 * Allows users to set a new password after clicking the recovery link
 */

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Lock, ArrowRight, Loader2, CheckCircle, Briefcase, Users, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/components/clients/Supabase';

export default function ResetPasswordPage() {
  const t = useTranslations('ResetPassword');
  const loginT = useTranslations('Login');
  const locale = useLocale();
  const router = useRouter();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Check if the user is authorized to be here
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If there's no session, they shouldn't be here
      // Supabase automatically creates a session when clicking the recovery link
      if (!session) {
        router.push(`/${locale}/login`);
      }
    };

    checkAuth();
  }, [locale, router]);

  // The password reset flow in Supabase works by having the user logged in
  // via the recovery link (PKCE or implicit flow)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError(t('matchError'));
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.updateUser({
        password: password
      });

      if (resetError) {
        console.error('Reset error:', resetError);
        
        // Handle specific error when new password is same as old
        if (resetError.message.toLowerCase().includes('different') || 
            resetError.message.toLowerCase().includes('mesma') ||
            resetError.code === 'same_password') {
          setError(t('samePasswordError'));
        } else {
          setError(t('error'));
        }
        
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setIsLoading(false);
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 3000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(t('error'));
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Briefcase size={16} />, text: loginT('features.clients') },
    { icon: <Users size={16} />, text: loginT('features.partners') },
    { icon: <Shield size={16} />, text: loginT('features.secure') },
    { icon: <Zap size={16} />, text: loginT('features.realtime') },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="mb-8">
            <Link href={`/${locale}`}>
              <Image
                src="/AS.png"
                alt="Asevedo Company"
                width={120}
                height={120}
                className="opacity-90"
              />
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            {loginT('brandTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">{loginT('brandHighlight')}</span>
          </h1>
          
          <p className="text-slate-400 text-center max-w-md mb-10">
            {loginT('brandSubtitle')}
          </p>

          <div className="space-y-4 text-left max-w-md w-full">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0 text-violet-400">
                  {feature.icon}
                </div>
                <span className="text-slate-300 text-sm leading-relaxed">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href={`/${locale}`} className="inline-flex items-center gap-3 mb-4">
              <Image
                src="/AS.png"
                alt="Asevedo Company"
                width={48}
                height={48}
              />
              <span className="text-xl font-bold text-foreground">Asevedo Company</span>
            </Link>
          </div>

          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Lock size={28} className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t('title')}
                </h2>
                <p className="text-foreground-secondary">
                  {t('subtitle')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Password */}
                <div>
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    {t('passwordLabel')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-foreground-muted" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder={t('passwordPlaceholder')}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label 
                    htmlFor="confirmPassword" 
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    {t('confirmLabel')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-foreground-muted" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder={t('confirmPlaceholder')}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {t('submitting')}
                    </>
                  ) : (
                    <>
                      {t('submitButton')}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                {t('success.title')}
              </h2>
              <p className="text-foreground-secondary mb-8">
                {t('success.message')}
              </p>
              
              <Link 
                href={`/${locale}/login`}
                className="inline-flex items-center justify-center gap-2 py-3 px-8 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-all duration-300 cursor-pointer"
              >
                {loginT('submitButton')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
