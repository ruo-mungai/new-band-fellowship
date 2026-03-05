import { api } from './api';

export const authService = {
  register: async (userData) => {
    console.log('📝 Register API call:', userData.email);
    try {
      const response = await api.auth.register(userData);
      console.log('✅ Register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Register API error:', error);
      throw error;
    }
  },

  login: async (email, password) => {
    console.log('🔑 Login API call for:', email);
    
    try {
      const response = await api.auth.login({ email, password });
      console.log('📥 Raw login response:', response.data);
      
      // Handle different response formats
      let accessToken, refreshToken, user;
      
      // Check for nested data structure: { status: 'success', data: { accessToken, user } }
      if (response.data?.data?.accessToken) {
        console.log('✅ Found nested response format (data.data)');
        accessToken = response.data.data.accessToken;
        user = response.data.data.user;
        refreshToken = response.data.data.refreshToken;
      } 
      // Check for direct data structure: { data: { accessToken, user } }
      else if (response.data?.data?.accessToken) {
        console.log('✅ Found data wrapper format');
        accessToken = response.data.data.accessToken;
        user = response.data.data.user;
        refreshToken = response.data.data.refreshToken;
      }
      // Check for flat structure: { accessToken, user }
      else if (response.data?.accessToken) {
        console.log('✅ Found flat response format');
        accessToken = response.data.accessToken;
        user = response.data.user;
        refreshToken = response.data.refreshToken;
      }
      // Check for status wrapper: { status: 'success', accessToken, user }
      else if (response.data?.status === 'success' && response.data?.accessToken) {
        console.log('✅ Found status wrapper format');
        accessToken = response.data.accessToken;
        user = response.data.user;
        refreshToken = response.data.refreshToken;
      }
      else {
        console.error('❌ Unknown response format:', response.data);
        throw new Error('Invalid response format from server');
      }
      
      if (!accessToken) {
        console.error('❌ No access token in response');
        throw new Error('No access token received');
      }
      
      console.log('✅ Successfully parsed response:', {
        hasToken: !!accessToken,
        hasUser: !!user,
        userEmail: user?.email
      });
      
      return { 
        accessToken, 
        refreshToken, 
        user 
      };
    } catch (error) {
      console.error('❌ Login API error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  logout: async () => {
    console.log('🚪 Logout API call');
    try {
      const response = await api.auth.logout();
      console.log('✅ Logout response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    console.log('👤 Get current user API call');
    try {
      const response = await api.auth.getMe();
      console.log('📥 Raw get user response:', response.data);
      
      // Handle different response formats
      let user;
      
      if (response.data?.data?.user) {
        user = response.data.data.user;
      } else if (response.data?.user) {
        user = response.data.user;
      } else if (response.data?.data) {
        user = response.data.data;
      } else {
        user = response.data;
      }
      
      console.log('✅ Parsed user data:', user);
      return user;
    } catch (error) {
      console.error('❌ Get user error:', error);
      throw error;
    }
  },

  refreshToken: async (refreshToken) => {
    console.log('🔄 Refresh token API call');
    try {
      const response = await api.auth.refreshToken({ refreshToken });
      console.log('✅ Refresh token response:', response.data);
      
      let accessToken;
      
      if (response.data?.data?.accessToken) {
        accessToken = response.data.data.accessToken;
      } else if (response.data?.accessToken) {
        accessToken = response.data.accessToken;
      }
      
      return { accessToken };
    } catch (error) {
      console.error('❌ Refresh token error:', error);
      throw error;
    }
  },
};