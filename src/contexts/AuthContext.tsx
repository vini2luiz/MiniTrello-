
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginRequest, RegisterRequest } from '../types';
import { api } from '../services/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (credentials: RegisterRequest) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'RESTORE_SESSION':
      return {
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: null,
        token: null
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Restaurar sessão do localStorage
    const savedAuth = localStorage.getItem('taskmanager_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        dispatch({ type: 'RESTORE_SESSION', payload: authData });
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem('taskmanager_auth');
      }
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const response = await api.login(credentials);
      
      if (response.success && response.data) {
        const authData = response.data;
        dispatch({ type: 'LOGIN_SUCCESS', payload: authData });
        localStorage.setItem('taskmanager_auth', JSON.stringify(authData));
        
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo, ${authData.user.username}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Erro no login",
          description: response.error || "Credenciais inválidas",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (credentials: RegisterRequest): Promise<boolean> => {
    try {
      const response = await api.register(credentials);
      
      if (response.success && response.data) {
        const authData = response.data;
        dispatch({ type: 'LOGIN_SUCCESS', payload: authData });
        localStorage.setItem('taskmanager_auth', JSON.stringify(authData));
        
        toast({
          title: "Conta criada com sucesso!",
          description: `Bem-vindo, ${authData.user.username}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Erro no cadastro",
          description: response.error || "Erro ao criar conta",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Register error:', error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('taskmanager_auth');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
