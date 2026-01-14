'use client';

/**
 * Universal Login Page
 * Email + Password authentication for partners and clients
 * Integrated with Supabase Auth
 */

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, CheckCircle, LogIn, Users, Briefcase, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/components/clients/Supabase';

export default function LoginPage() {
  const t = useTranslations('Login');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get redirect destination from query params (default to partner platform)
  const redirectTo = searchParams.get('redirect') || 'plataforma-parceiro/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        setError(t('error'));
        setIsLoading(false);
        return;
      }

      if (data.session) {
        setIsSuccess(true);
        // Redirect after short delay to show success state
        setTimeout(() => {
          router.push(`/${locale}/${redirectTo}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t('error'));
      setIsLoading(false);
    }
  };

  // Features to display on the left side
  const features = [
    { icon: <Briefcase size={16} />, text: t('features.clients') },
    { icon: <Users size={16} />, text: t('features.partners') },
    { icon: <Shield size={16} />, text: t('features.secure') },
    { icon: <Zap size={16} />, text: t('features.realtime') },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/AS.png"
              alt="Asevedo Company"
              width={120}
              height={120}
              className="opacity-90"
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            {t('brandTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">{t('brandHighlight')}</span>
          </h1>
          
          <p className="text-slate-400 text-center max-w-md mb-10">
            {t('brandSubtitle')}
          </p>

          {/* Features */}
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

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <Image
                src="/AS.png"
                alt="Asevedo Company"
                width={48}
                height={48}
              />
              <span className="text-xl font-bold text-foreground">Asevedo Company</span>
            </div>
          </div>

          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <LogIn size={28} className="text-violet-400" />
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
                {/* Email */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    {t('emailLabel')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-foreground-muted" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder={t('emailPlaceholder')}
                    />
                  </div>
                </div>

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

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    {t('forgotPassword')}
                  </button>
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
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Register Links */}
              <div className="mt-8 text-center space-y-3">
                <p className="text-foreground-secondary text-sm">
                  {t('notRegistered')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href={`/${locale}/parceiro`}
                    className="text-violet-400 hover:text-violet-300 font-medium transition-colors text-sm"
                  >
                    {t('registerPartner')}
                  </Link>
                  <span className="hidden sm:inline text-foreground-muted">•</span>
                  <Link 
                    href={`/${locale}#cta`}
                    className="text-slate-400 hover:text-slate-300 font-medium transition-colors text-sm"
                  >
                    {t('registerClient')}
                  </Link>
                </div>
              </div>
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
              <p className="text-foreground-secondary mb-6">
                {t('success.message')}
              </p>
              <div className="flex items-center justify-center gap-2 text-violet-400">
                <Loader2 size={18} className="animate-spin" />
                <span>{t('success.loading')}</span>
              </div>
            </div>
          )}

          {/* Back to site */}
          <div className="mt-12 text-center">
            <Link 
              href={`/${locale}`}
              className="text-foreground-muted hover:text-foreground text-sm transition-colors"
            >
              ← {t('backToSite')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
