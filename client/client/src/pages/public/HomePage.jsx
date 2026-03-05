import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import MissionVision from '@/components/landing/MissionVision';
import GallerySlider from '@/components/landing/GallerySlider';
import UpcomingEvents from '@/components/landing/UpcomingEvents';
import CallToAction from '@/components/landing/CallToAction';
import { fetchLandingContent, fetchGallery } from '@/store/slices/landingSlice';
import { fetchUpcomingEvents } from '@/store/slices/eventSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const fetchedRef = useRef(false);
  
  // Get data from Redux store
  const landing = useSelector((state) => state.landing) || {};
  const events = useSelector((state) => state.events) || {};
  const gallery = useSelector((state) => state.gallery) || {};
  const { settings } = useSelector((state) => state.settings) || {};

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      dispatch(fetchLandingContent());
      dispatch(fetchGallery());
      dispatch(fetchUpcomingEvents());
    }
  }, [dispatch]);

  // Log the data to see what we have
  console.log('Landing data:', landing);
  console.log('Events data:', events);
  console.log('Gallery data:', gallery);

  return (
    <>
      <Helmet>
        <title>{settings?.siteTitle || 'New Band Fellowship'} - Worship Together in Ruiru</title>
        <meta 
          name="description" 
          content={settings?.metaDescription || 'Join us for worship fellowship in Ruiru Town. Experience Nyimbo cia Agendi and old Kikuyu gospel songs.'} 
        />
      </Helmet>

      <div className="animate-fade-in">
        <Hero />
        <About />
        <MissionVision />
        <UpcomingEvents />
        <GallerySlider />
        <CallToAction />
      </div>
    </>
  );
};

export default HomePage;