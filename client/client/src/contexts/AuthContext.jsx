import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { authService } from '@/services/authService';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('🔍 AuthProvider useEffect running');
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      console.log('🔍 AuthProvider - Loading user:', { 
        hasStoredUser: !!storedUser, 
        hasToken: !!token,
        hasRefreshToken: !!refreshToken
      });

      // If no token, user is not authenticated
      if (!token) {
        console.log('🔍 No token found, user is not authenticated');
        setLoading(false);
        return;
      }

      // If we have stored user but no token, clear everything
      if (storedUser && !token) {
        console.log('🔍 Stored user but no token - clearing');
        clearStorage();
        setLoading(false);
        return;
      }

      // Try to verify token with backend
      try {
        const userData = await authService.getCurrentUser();
        console.log('✅ Token valid, user data:', userData);
        
        const safeUser = {
          id: userData.id || '',
          email: userData.email || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          role: userData.role || 'USER',
          isApproved: userData.isApproved || false,
          profileImage: userData.profileImage || null,
          bio: userData.bio || '',
        };
        
        setUser(safeUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(safeUser));
        
      } catch (error) {
        console.log('❌ Token verification failed:', error.response?.status);
        
        // If token expired (401 or 403), try to refresh
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('🔄 Attempting to refresh token...');
          
          const refreshed = await refreshAccessToken();
          
          if (!refreshed) {
            console.log('❌ Token refresh failed, logging out');
            clearStorage();
            toast.error('Session expired. Please login again.');
          }
        } else {
          // Other errors - clear storage to be safe
          console.log('❌ Other error, clearing storage');
          clearStorage();
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
      clearStorage();
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;
      
      const response = await authService.refreshToken(refreshToken);
      
      if (response?.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        console.log('✅ Token refreshed successfully');
        
        // Try to get user data again with new token
        const userData = await authService.getCurrentUser();
        if (userData) {
          const safeUser = {
            id: userData.id || '',
            email: userData.email || '',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phone: userData.phone || '',
            role: userData.role || 'USER',
            isApproved: userData.isApproved || false,
            profileImage: userData.profileImage || null,
            bio: userData.bio || '',
          };
          
          setUser(safeUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(safeUser));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      return false;
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Login attempt for:', email);
      const response = await authService.login(email, password);
      const { accessToken, refreshToken, user: userData } = response;
      
      console.log('✅ Login successful for:', userData.email);
      
      const safeUser = {
        id: userData.id || '',
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        role: userData.role || 'USER',
        isApproved: userData.isApproved || false,
        profileImage: userData.profileImage || null,
        bio: userData.bio || '',
      };
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(safeUser));
      
      setUser(safeUser);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${safeUser.firstName || 'User'}!`);
      
      return { success: true, user: safeUser };
    } catch (error) {
      console.error('❌ Login failed:', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      toast.success('Registration successful! Please wait for approval.');
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Registration failed:', error);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearStorage();
      toast.success('Logged out successfully');
      window.location.href = '/';
    }
  };

  const updateUser = (updatedUser) => {
    const safeUser = {
      ...user,
      ...updatedUser,
    };
    setUser(safeUser);
    localStorage.setItem('user', JSON.stringify(safeUser));
  };

  const hasRole = (roles) => {
    if (!user || !user.role) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};