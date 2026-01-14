'use client';

/**
 * Auth Context Provider
 * Gerencia estado de autenticação e dados do usuário logado
 */

import { supabase } from '@/components/clients/Supabase';
import { User, Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Tipos para o perfil do usuário
export interface UserProfile {
  id: string;
  name: string | null;
  phone: string | null;
  document: string | null;
  code: number | null;
  role: 'partner' | 'client' | 'admin' | null;
  status: string | null;
  pix_key: string | null;
  bank_name: string | null;
  bank_agency: string | null;
  bank_account: string | null;
  created_at: string;
}

// Tipos do contexto
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Busca o perfil do usuário na tabela profiles
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }

      return data as UserProfile;
    } catch (err) {
      console.error('Erro ao buscar perfil:', err);
      return null;
    }
  };

  // Atualiza o perfil manualmente
  const refreshProfile = async () => {
    if (user?.id) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  // Inicialização e listener de auth
  useEffect(() => {
    let isMounted = true;
    let profileFetched = false;

    // Busca sessão inicial
    const initAuth = async () => {
      setIsLoading(true);

      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession?.user && isMounted) {
          setSession(currentSession);
          setUser(currentSession.user);

          if (!profileFetched) {
            profileFetched = true;
            const profileData = await fetchProfile(currentSession.user.id);
            if (isMounted) {
              setProfile(profileData);
            }
          }
        }
      } catch (err) {
        console.error('Erro ao inicializar auth:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;

        console.log('Auth state changed:', event);

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);

          // Busca perfil apenas no SIGNED_IN (não no TOKEN_REFRESHED)
          if (event === 'SIGNED_IN' && !profileFetched) {
            profileFetched = true;
            const profileData = await fetchProfile(currentSession.user.id);
            if (isMounted) {
              setProfile(profileData);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          profileFetched = false;
        }

        setIsLoading(false);
      }
    );

    // Cleanup
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: !!session,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
