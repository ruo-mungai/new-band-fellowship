import { api } from './api';

export const publicService = {
  getLanding: async () => {
    try {
      const response = await api.public.getLanding();
      return response.data;
    } catch (error) {
      console.log('Using fallback landing data');
      return {
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
        siteTitle: 'New Band Fellowship',
        logo: '',
      };
    }
  },

  getEvents: async (params) => {
    try {
      const response = await api.public.getEvents(params);
      return response.data;
    } catch (error) {
      console.log('Using fallback events data');
      return {
        items: [
          {
            id: '1',
            title: 'Sunday Worship Service',
            description: 'Join us for a powerful time of worship and fellowship. Experience the richness of traditional Kikuyu gospel music.',
            eventDate: new Date().toISOString(),
            location: 'Ruiru Town Hall',
            bannerImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            attendees: 45,
          },
          {
            id: '2',
            title: 'Wednesday Prayer Meeting',
            description: 'Mid-week prayer and bible study session. Come together for fellowship and prayer.',
            eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Fellowship Center',
            bannerImage: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
            attendees: 30,
          },
          {
            id: '3',
            title: 'Friday Choir Practice',
            description: 'Preparation for Sunday worship service. Learn new songs and harmonies.',
            eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Music Room',
            bannerImage: 'https://images.unsplash.com/photo-1507692049790-de58290c433e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            attendees: 25,
          },
        ],
        pagination: { page: 1, limit: 10, total: 3, pages: 1 }
      };
    }
  },

  // Add this to your publicService.js
getTeam: async () => {
  try {
    console.log('📡 Fetching team members...');
    const response = await api.public.getTeam();
    console.log('📡 Team response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching team:', error);
    // Return empty array on error
    return [];
  }
},

  getGallery: async () => {
    try {
      const response = await api.public.getGallery();
      return response.data;
    } catch (error) {
      console.log('Using fallback gallery data');
      return [
        {
          id: '1',
          title: 'Worship Night',
          description: 'Special worship session under the stars',
          imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        },
        {
          id: '2',
          title: 'Fellowship Gathering',
          description: 'Community coming together in fellowship',
          imageUrl: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
        },
        {
          id: '3',
          title: 'Choir Practice',
          description: 'Preparing for Sunday worship',
          imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290c433e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        },
        {
          id: '4',
          title: 'Youth Ministry',
          description: 'Engaging the next generation',
          imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        },
      ];
    }
  },

  getBlogs: async (params) => {
    try {
      const response = await api.public.getBlogs(params);
      return response.data;
    } catch (error) {
      console.log('Using fallback blogs data');
      return {
        items: [
          {
            id: '1',
            title: 'The Power of Traditional Gospel Music',
            slug: 'power-of-traditional-gospel-music',
            excerpt: 'Discover how traditional Kikuyu gospel music continues to inspire and unite generations through its timeless messages of faith and hope.',
            content: `<h2>The Rich Heritage of Kikuyu Gospel Music</h2>
<p>Traditional gospel music, particularly Nyimbo cia Agendi, holds a special place in our hearts. These songs carry the stories, faith, and experiences of our forefathers, preserving a spiritual legacy that continues to inspire worship today.</p>

<h3>Why Traditional Music Matters</h3>
<p>In today's fast-paced world, traditional gospel music serves as a bridge connecting us to our spiritual heritage. The melodies and lyrics carry deep meaning that transcends generations, reminding us of God's faithfulness throughout history.</p>

<blockquote>"Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom, singing psalms and hymns and spiritual songs, with thankfulness in your hearts to God." - Colossians 3:16</blockquote>

<h3>Preserving Our Heritage</h3>
<p>At New Band Fellowship, we're committed to preserving these precious songs. We encourage our members to learn and share these timeless worship pieces, ensuring that future generations can experience the same spiritual nourishment.</p>

<h3>The Impact on Worship</h3>
<p>Traditional Kikuyu gospel music creates a unique atmosphere of worship. The familiar melodies and meaningful lyrics help worshippers connect deeply with God, often bringing emotional responses and spiritual breakthroughs.</p>`,
            featuredImage: 'https://images.unsplash.com/photo-1507692049790-de58290c433e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            author: { 
              firstName: 'John', 
              lastName: 'Kamau',
              bio: 'Senior Pastor at New Band Fellowship with over 20 years of ministry experience. Passionate about preserving traditional worship music.'
            },
            publishedAt: new Date().toISOString(),
            views: 128,
            categories: [{ id: '1', name: 'Worship', slug: 'worship' }],
            tags: [
              { id: '1', name: 'traditional', slug: 'traditional' },
              { id: '2', name: 'gospel', slug: 'gospel' }
            ],
            comments: [],
          },
          {
            id: '2',
            title: 'Upcoming Fellowship Events',
            slug: 'upcoming-fellowship-events',
            excerpt: 'Join us for our upcoming worship sessions and community gatherings. There\'s something for everyone in the family.',
            content: `<h2>Exciting Events Ahead</h2>
<p>We have an exciting lineup of events planned for the coming months. From special worship services to community outreach programs, there are many opportunities to get involved and grow in faith.</p>

<h3>Sunday Worship Services</h3>
<p>Every Sunday at 9:00 AM, we gather for worship at Ruiru Town Hall. Join us for powerful praise and worship, followed by relevant teaching from God's Word.</p>

<h3>Wednesday Prayer Meetings</h3>
<p>Mid-week prayer meetings are held every Wednesday at 5:00 PM. This is a time to come together, share prayer requests, and intercede for our community.</p>

<h3>Friday Choir Practice</h3>
<p>Choir practice takes place on Fridays at 4:00 PM. Whether you're a experienced singer or just love to praise through song, you're welcome to join.</p>`,
            featuredImage: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
            author: { 
              firstName: 'Mary', 
              lastName: 'Wanjiku',
              bio: 'Worship Director at New Band Fellowship, passionate about traditional gospel music.'
            },
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            views: 85,
            categories: [{ id: '2', name: 'Events', slug: 'events' }],
            tags: [
              { id: '3', name: 'events', slug: 'events' },
              { id: '4', name: 'fellowship', slug: 'fellowship' }
            ],
            comments: [],
          },
        ],
        pagination: { page: 1, limit: 10, total: 2, pages: 1 }
      };
    }
  },

  getBlogBySlug: async (slug) => {
    try {
      const response = await api.public.getBlogBySlug(slug);
      return response.data;
    } catch (error) {
      console.log('Using fallback blog detail data for slug:', slug);
      
      // Return different content based on slug
      if (slug === 'power-of-traditional-gospel-music') {
        return {
          id: '1',
          title: 'The Power of Traditional Gospel Music',
          slug: 'power-of-traditional-gospel-music',
          excerpt: 'Discover how traditional Kikuyu gospel music continues to inspire and unite generations.',
          content: `<h2>The Rich Heritage of Kikuyu Gospel Music</h2>
<p>Traditional gospel music, particularly Nyimbo cia Agendi, holds a special place in our hearts. These songs carry the stories, faith, and experiences of our forefathers, preserving a spiritual legacy that continues to inspire worship today.</p>

<h3>Why Traditional Music Matters</h3>
<p>In today's fast-paced world, traditional gospel music serves as a bridge connecting us to our spiritual heritage. The melodies and lyrics carry deep meaning that transcends generations, reminding us of God's faithfulness throughout history.</p>

<blockquote style="border-left: 4px solid #f97316; padding-left: 1rem; font-style: italic; margin: 1.5rem 0;">
  "Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom, singing psalms and hymns and spiritual songs, with thankfulness in your hearts to God." - Colossians 3:16
</blockquote>

<h3>Preserving Our Heritage</h3>
<p>At New Band Fellowship, we're committed to preserving these precious songs. We encourage our members to learn and share these timeless worship pieces, ensuring that future generations can experience the same spiritual nourishment.</p>

<h3>The Impact on Worship</h3>
<p>Traditional Kikuyu gospel music creates a unique atmosphere of worship. The familiar melodies and meaningful lyrics help worshippers connect deeply with God, often bringing emotional responses and spiritual breakthroughs.</p>

<p>Come join us this Sunday as we lift our voices in traditional praise!</p>`,
          featuredImage: 'https://images.unsplash.com/photo-1507692049790-de58290c433e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
          author: { 
            firstName: 'John', 
            lastName: 'Kamau',
            bio: 'Senior Pastor at New Band Fellowship with over 20 years of ministry experience. Passionate about preserving traditional worship music.',
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
          },
          publishedAt: new Date().toISOString(),
          views: 128,
          categories: [{ id: '1', name: 'Worship', slug: 'worship' }],
          tags: [
            { id: '1', name: 'traditional', slug: 'traditional' },
            { id: '2', name: 'gospel', slug: 'gospel' }
          ],
          comments: [],
        };
      } else {
        return {
          id: '2',
          title: 'Upcoming Fellowship Events',
          slug: 'upcoming-fellowship-events',
          excerpt: 'Join us for our upcoming worship sessions and community gatherings.',
          content: `<h2>Exciting Events Ahead</h2>
<p>We have an exciting lineup of events planned for the coming months. From special worship services to community outreach programs, there are many opportunities to get involved and grow in faith.</p>

<h3>Sunday Worship Services</h3>
<p>Every Sunday at 9:00 AM, we gather for worship at Ruiru Town Hall. Join us for powerful praise and worship, followed by relevant teaching from God's Word.</p>

<h3>Wednesday Prayer Meetings</h3>
<p>Mid-week prayer meetings are held every Wednesday at 5:00 PM. This is a time to come together, share prayer requests, and intercede for our community.</p>

<h3>Friday Choir Practice</h3>
<p>Choir practice takes place on Fridays at 4:00 PM. Whether you're a experienced singer or just love to praise through song, you're welcome to join.</p>

<h3>Special Events</h3>
<p>Keep an eye on our events page for special worship nights, gospel concerts, and community outreach programs. We'd love to see you there!</p>`,
          featuredImage: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
          author: { 
            firstName: 'Mary', 
            lastName: 'Wanjiku',
            bio: 'Worship Director at New Band Fellowship, passionate about traditional gospel music.',
            profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
          },
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          views: 85,
          categories: [{ id: '2', name: 'Events', slug: 'events' }],
          tags: [
            { id: '3', name: 'events', slug: 'events' },
            { id: '4', name: 'fellowship', slug: 'fellowship' }
          ],
          comments: [],
        };
      }
    }
  },

  getUpcomingPlaylist: async () => {
    try {
      const response = await api.public.getUpcomingPlaylist();
      return response.data;
    } catch (error) {
      console.log('Using fallback playlist data');
      return {
        id: '1',
        title: 'Sunday Worship Playlist',
        eventDate: new Date().toISOString(),
        items: [
          {
            id: '1',
            order: 1,
            song: { 
              title: 'Njambi Ya Thengo', 
              artist: 'Traditional',
              youtubeUrl: 'https://www.youtube.com/watch?v=example1'
            },
            session: { title: 'Opening Worship', type: 'FIRST_SESSION' },
            backgroundColor: '#f97316',
            notes: 'Opening praise song',
          },
          {
            id: '2',
            order: 2,
            song: { 
              title: 'Wendo Wi Mwega', 
              artist: 'Kikuyu Gospel',
              youtubeUrl: 'https://www.youtube.com/watch?v=example2'
            },
            session: { title: 'Main Worship', type: 'SECOND_SESSION' },
            backgroundColor: '#ea580c',
            notes: 'Main worship set',
          },
          {
            id: '3',
            order: 3,
            song: { 
              title: 'Ndi Mukenya', 
              artist: 'Agendi',
              youtubeUrl: 'https://www.youtube.com/watch?v=example3'
            },
            session: { title: 'Song Requests', type: 'REQUEST_TIME' },
            backgroundColor: '#c2410c',
          },
        ],
        sessions: [
          { id: '1', title: 'Opening Worship', type: 'FIRST_SESSION' },
          { id: '2', title: 'Main Worship', type: 'SECOND_SESSION' },
          { id: '3', title: 'Song Requests', type: 'REQUEST_TIME' },
        ],
        flowNotes: 'Start with upbeat praise songs, transition to worship, then open for testimonies and song requests.',
      };
    }
  },

  getCategories: async () => {
    try {
      const response = await api.public.getCategories();
      return response.data;
    } catch (error) {
      return [
        { id: '1', name: 'Worship', slug: 'worship' },
        { id: '2', name: 'Testimonies', slug: 'testimonies' },
        { id: '3', name: 'Teaching', slug: 'teaching' },
        { id: '4', name: 'Events', slug: 'events' },
        { id: '5', name: 'Music', slug: 'music' },
      ];
    }
  },

  getTags: async () => {
    try {
      const response = await api.public.getTags();
      return response.data;
    } catch (error) {
      return [
        { id: '1', name: 'traditional', slug: 'traditional' },
        { id: '2', name: 'worship', slug: 'worship' },
        { id: '3', name: 'fellowship', slug: 'fellowship' },
        { id: '4', name: 'gospel', slug: 'gospel' },
        { id: '5', name: 'kikuyu', slug: 'kikuyu' },
        { id: '6', name: 'praise', slug: 'praise' },
      ];
    }
  },
};