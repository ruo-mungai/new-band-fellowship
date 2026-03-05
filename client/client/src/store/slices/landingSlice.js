import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { publicService } from '@/services/publicService';

export const fetchLandingContent = createAsyncThunk(
  'landing/fetchContent',
  async () => {
    const response = await publicService.getLanding();
    return response;
  }
);

export const fetchEventBanner = createAsyncThunk(
  'landing/fetchBanner',
  async () => {
    try {
      const events = await publicService.getEvents({ limit: 1, upcoming: true });
      const eventList = events.items || [];
      if (eventList.length > 0 && eventList[0].banner) {
        return eventList[0].banner;
      }
    } catch (error) {
      console.log('No banner available, using default');
    }
    // Return default banner
    return {
      message: 'Join us this Sunday for worship! 🎵',
      linkUrl: '/events',
      linkText: 'View Events',
      backgroundColor: '#f97316',
      textColor: '#ffffff',
      isActive: true,
    };
  }
);

export const fetchGallery = createAsyncThunk(
  'landing/fetchGallery',
  async () => {
    const response = await publicService.getGallery();
    return response;
  }
);

const initialState = {
  hero: {
    title: 'Welcome to New Band Fellowship',
    subtitle: 'Experience the beauty of worship through Nyimbo cia Agendi and old Kikuyu gospel songs',
    backgroundImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    buttonText: 'Join Us This Sunday',
    buttonLink: '/events',
  },
  about: {
    title: 'About New Band Fellowship',
    content: 'We are a community of believers dedicated to preserving and celebrating the rich heritage of Kikuyu gospel music while creating a welcoming space for worship and fellowship in Ruiru Town.',
    imageUrl: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
  },
  mission: {
    title: 'Our Mission',
    content: 'To preserve and promote the rich heritage of Kikuyu gospel music while creating an inclusive community where people can experience God\'s love through worship.',
  },
  vision: {
    title: 'Our Vision',
    content: 'A community where traditional gospel music bridges generations, bringing people together in worship and fellowship.',
  },
  banner: {
    message: 'Join us this Sunday for worship! 🎵',
    linkUrl: '/events',
    linkText: 'View Events',
    backgroundColor: '#f97316',
    textColor: '#ffffff',
    isActive: true,
  },
  gallery: [],
  siteTitle: 'New Band Fellowship',
  logo: '',
  loading: false,
  error: null,
};

const landingSlice = createSlice({
  name: 'landing',
  initialState,
  reducers: {
    updateHero: (state, action) => {
      state.hero = { ...state.hero, ...action.payload };
    },
    updateAbout: (state, action) => {
      state.about = { ...state.about, ...action.payload };
    },
    updateMission: (state, action) => {
      state.mission = { ...state.mission, ...action.payload };
    },
    updateVision: (state, action) => {
      state.vision = { ...state.vision, ...action.payload };
    },
    updateBanner: (state, action) => {
      state.banner = { ...state.banner, ...action.payload };
    },
    setGallery: (state, action) => {
      state.gallery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Landing Content
      .addCase(fetchLandingContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandingContent.fulfilled, (state, action) => {
        state.loading = false;
        const { hero, about, mission, vision, siteTitle, logo } = action.payload;
        if (hero) state.hero = { ...state.hero, ...hero };
        if (about) state.about = { ...state.about, ...about };
        if (mission) state.mission = { ...state.mission, ...mission };
        if (vision) state.vision = { ...state.vision, ...vision };
        if (siteTitle) state.siteTitle = siteTitle;
        if (logo) state.logo = logo;
      })
      .addCase(fetchLandingContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log('Using default landing content');
      })
      // Fetch Banner
      .addCase(fetchEventBanner.pending, (state) => {
        // Don't set loading to true for banner
      })
      .addCase(fetchEventBanner.fulfilled, (state, action) => {
        state.banner = { ...state.banner, ...action.payload, isActive: true };
      })
      .addCase(fetchEventBanner.rejected, (state) => {
        // Keep default banner
        state.banner.isActive = true;
      })
      // Fetch Gallery
      .addCase(fetchGallery.pending, (state) => {
        // Don't set loading for gallery
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.gallery = action.payload;
      })
      .addCase(fetchGallery.rejected, (state) => {
        state.gallery = [];
      });
  },
});

export const {
  updateHero,
  updateAbout,
  updateMission,
  updateVision,
  updateBanner,
  setGallery,
} = landingSlice.actions;

export default landingSlice.reducer;