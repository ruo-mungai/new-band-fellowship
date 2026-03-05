import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import EventBanner from '@/components/landing/EventBanner';
import { fetchEventBanner } from '@/store/slices/landingSlice';

const MainLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const fetchedRef = useRef(false);
  const { banner } = useSelector((state) => state.landing);

  useEffect(() => {
    // Only fetch banner once
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      dispatch(fetchEventBanner());
    }
  }, [dispatch]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-church-cream dark:bg-church-charcoal transition-colors duration-300">
      {banner?.isActive && <EventBanner banner={banner} />}
      <Navbar />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-grow"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default MainLayout;