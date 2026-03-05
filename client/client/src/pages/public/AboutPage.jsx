import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  UsersIcon,
  MusicalNoteIcon,
  CalendarIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { fetchLandingContent } from '@/store/slices/landingSlice';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input'; // ADD THIS IMPORT
import { publicService } from '@/services/publicService';
import Loader from '@/components/common/Loader';

const AboutPage = () => {
  const dispatch = useDispatch();
  const { about, mission, vision } = useSelector((state) => state.landing);
  const [team, setTeam] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    dispatch(fetchLandingContent());
    fetchTeam();
  }, [dispatch]);

  const fetchTeam = async () => {
    setLoadingTeam(true);
    try {
      const data = await publicService.getTeam();
      console.log('Team data:', data);
      setTeam(data || []);
    } catch (error) {
      console.error('Error fetching team:', error);
      setTeam([]);
    } finally {
      setLoadingTeam(false);
    }
  };

  const values = [
    {
      icon: HeartIcon,
      title: 'Faith',
      description: 'We are grounded in Christian faith and biblical teachings.',
    },
    {
      icon: UsersIcon,
      title: 'Community',
      description: 'Building lasting relationships through fellowship.',
    },
    {
      icon: MusicalNoteIcon,
      title: 'Worship',
      description: 'Preserving and celebrating Kikuyu gospel music.',
    },
    {
      icon: CalendarIcon,
      title: 'Tradition',
      description: 'Honoring our spiritual heritage through song.',
    },
  ];

  // Default leadership in case no team members are added yet
  const defaultLeadership = [
    {
      name: 'Pastor John Kamau',
      role: 'Senior Pastor',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Leading the fellowship with over 20 years of ministry experience.',
    },
    {
      name: 'Elder Mary Wanjiku',
      role: 'Worship Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Passionate about preserving traditional Kikuyu gospel music.',
    },
    {
      name: 'Brother Peter Mwangi',
      role: 'Music Coordinator',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Leading the choir and organizing worship sessions.',
    },
  ];

  // Use team from API if available, otherwise use default
  const leadership = team.length > 0 ? team : defaultLeadership;

  return (
    <>
      <Helmet>
        <title>About Us - New Band Fellowship</title>
        <meta 
          name="description" 
          content="Learn about New Band Fellowship, our mission, vision, and the community of believers in Ruiru Town." 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
            alt="Fellowship"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-6"
          >
            About New Band Fellowship
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            {about?.content || 'A community of believers dedicated to worship, fellowship, and preserving the rich heritage of Kikuyu gospel music.'}
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {mission?.title || 'Our Mission'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {mission?.content || 'To preserve and promote the rich heritage of Kikuyu gospel music while creating an inclusive community where people can experience God\'s love through worship.'}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {vision?.title || 'Our Vision'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {vision?.content || 'A community where traditional gospel music bridges generations, bringing people together in worship and fellowship.'}
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-church-cream dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              The principles that guide our fellowship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center h-full">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
                      <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership - DYNAMIC FROM TEAM MANAGEMENT */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Our Leadership
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Meet the team guiding our fellowship
            </p>
          </div>

          {loadingTeam ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" text="Loading team..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leadership.map((leader, index) => (
                <motion.div
                  key={leader.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center p-6">
                    {leader.imageUrl || leader.image ? (
                      <img
                        src={leader.imageUrl || leader.image}
                        alt={leader.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <UserIcon className="h-16 w-16 text-primary-600 dark:text-primary-400" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {leader.name}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                      {leader.role}
                    </p>
                    {leader.bio && (
                      <p className="text-gray-600 dark:text-gray-400">
                        {leader.bio}
                      </p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-church-cream dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                We'd love to hear from you! Whether you have questions, prayer requests, or want to join our fellowship.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-6 w-6 text-primary-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Ruiru Town, Kenya
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-6 w-6 text-primary-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    +254 700 000 000
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-6 w-6 text-primary-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    info@newband.org
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Service Times
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>Sunday Worship: 9:00 AM - 12:00 PM</p>
                  <p>Wednesday Prayer: 5:00 PM - 7:00 PM</p>
                  <p>Friday Choir Practice: 4:00 PM - 6:00 PM</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Send us a Message
                </h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                  </div>
                  <Input type="email" placeholder="Email Address" />
                  <Input placeholder="Subject" />
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Your message..."
                  />
                  <Button type="submit" variant="primary" fullWidth>
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-gray-300">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8462962765316!2d36.958968!3d-1.149793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f3f3f3f3f3f3f%3A0x3f3f3f3f3f3f3f3f!2sRuiru!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Fellowship Location"
        />
      </section>
    </>
  );
};

export default AboutPage;