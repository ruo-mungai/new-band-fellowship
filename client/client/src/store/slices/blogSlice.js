import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blogService } from '@/services/blogService';
import { publicService } from '@/services/publicService';
import { DEFAULT_PAGINATION } from '@/utils/constants';

export const fetchBlogs = createAsyncThunk(
  'blogs/fetch',
  async (params = {}) => {
    console.log('📡 Fetching blogs with params:', params);
    const response = await blogService.getAll(params);
    console.log('📡 Blogs response:', response);
    return response;
  }
);

export const fetchBlogBySlug = createAsyncThunk(
  'blogs/fetchBySlug',
  async (slug) => {
    console.log('📡 Fetching blog by slug:', slug);
    const response = await publicService.getBlogBySlug(slug);
    console.log('📡 Blog response:', response);
    return response;
  }
);

export const fetchCategories = createAsyncThunk(
  'blogs/fetchCategories',
  async () => {
    const response = await blogService.getCategories();
    return response;
  }
);

export const fetchTags = createAsyncThunk(
  'blogs/fetchTags',
  async () => {
    const response = await blogService.getTags();
    return response;
  }
);

const initialState = {
  posts: [],
  currentPost: null,
  categories: [],
  tags: [],
  pagination: DEFAULT_PAGINATION,
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.items || action.payload || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
        console.log('✅ Blogs loaded:', state.posts.length);
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error('❌ Error fetching blogs:', action.error);
      })
      
      // Fetch Blog By Slug
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentPost = null;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
        console.log('✅ Blog loaded:', action.payload?.title);
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error('❌ Error fetching blog:', action.error);
      })
      
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload || [];
      })
      
      // Fetch Tags
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = action.payload || [];
      });
  },
});

export const { clearCurrentPost, clearError } = blogSlice.actions;
export default blogSlice.reducer;