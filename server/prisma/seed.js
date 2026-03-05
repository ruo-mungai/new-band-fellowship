const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('Clearing existing data...');
  await prisma.$transaction([
    prisma.vote.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.playlistItem.deleteMany(),
    prisma.playlist.deleteMany(),
    prisma.session.deleteMany(),
    prisma.event.deleteMany(),
    prisma.songRequest.deleteMany(),
    prisma.song.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.category.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.gallery.deleteMany(),
    prisma.landingContent.deleteMany(),
    prisma.eventBanner.deleteMany(),
    prisma.systemSettings.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('✅ Existing data cleared');

  // Create System Settings
  console.log('Creating system settings...');
  await prisma.systemSettings.createMany({
    data: [
      {
        key: 'siteTitle',
        value: 'New Band Fellowship',
        type: 'string',
        description: 'Website title'
      },
      {
        key: 'siteDescription',
        value: 'Worship fellowship in Ruiru Town',
        type: 'string',
        description: 'Website description'
      },
      {
        key: 'adminEmail',
        value: 'admin@newband.org',
        type: 'string',
        description: 'Admin email for notifications'
      },
      {
        key: 'whatsappNumber',
        value: '+254700000000',
        type: 'string',
        description: 'WhatsApp number for contact'
      },
      {
        key: 'contactEmail',
        value: 'info@newband.org',
        type: 'string',
        description: 'Public contact email'
      },
      {
        key: 'contactPhone',
        value: '+254700000000',
        type: 'string',
        description: 'Public contact phone'
      },
      {
        key: 'contactAddress',
        value: 'Ruiru Town, Kenya',
        type: 'string',
        description: 'Physical address'
      },
      {
        key: 'facebook',
        value: 'https://facebook.com/newbandfellowship',
        type: 'string',
        description: 'Facebook page URL'
      },
      {
        key: 'twitter',
        value: 'https://twitter.com/newband',
        type: 'string',
        description: 'Twitter handle URL'
      },
      {
        key: 'instagram',
        value: 'https://instagram.com/newband',
        type: 'string',
        description: 'Instagram page URL'
      },
      {
        key: 'youtube',
        value: 'https://youtube.com/@newband',
        type: 'string',
        description: 'YouTube channel URL'
      },
      {
        key: 'metaTitle',
        value: 'New Band Fellowship - Worship Together in Ruiru',
        type: 'string',
        description: 'Default meta title for SEO'
      },
      {
        key: 'metaDescription',
        value: 'Join us for worship fellowship in Ruiru Town. Experience Nyimbo cia Agendi and old Kikuyu gospel songs.',
        type: 'string',
        description: 'Default meta description for SEO'
      },
      {
        key: 'metaKeywords',
        value: 'worship, fellowship, gospel, kikuyu, ruiru, church, songs',
        type: 'string',
        description: 'Default meta keywords for SEO'
      },
      {
        key: 'allowRegistration',
        value: 'true',
        type: 'boolean',
        description: 'Allow new user registration'
      },
      {
        key: 'requireApproval',
        value: 'true',
        type: 'boolean',
        description: 'Require admin approval for new users'
      },
      {
        key: 'enableDonations',
        value: 'false',
        type: 'boolean',
        description: 'Enable online donations'
      },
      {
        key: 'enableLiveStreaming',
        value: 'false',
        type: 'boolean',
        description: 'Enable live streaming'
      },
      {
        key: 'enableRSVP',
        value: 'true',
        type: 'boolean',
        description: 'Enable event RSVP'
      },
      {
        key: 'enableComments',
        value: 'true',
        type: 'boolean',
        description: 'Enable blog comments'
      },
      {
        key: 'voteMode',
        value: 'ENABLED',
        type: 'string',
        description: 'Voting mode: ENABLED, DISABLED, HYBRID'
      },
      {
        key: 'galleryAutoSlideInterval',
        value: '5000',
        type: 'number',
        description: 'Gallery auto-slide interval in milliseconds'
      },
    ],
  });

  // Create Users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const users = await prisma.user.createMany({
    data: [
      {
        email: 'superadmin@newband.org',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        isApproved: true,
        isEmailVerified: true,
        authProvider: 'local',
        bio: 'Super Administrator of New Band Fellowship',
      },
      {
        email: 'admin@newband.org',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isApproved: true,
        isEmailVerified: true,
        authProvider: 'local',
        bio: 'Administrator of New Band Fellowship',
      },
      {
        email: 'user1@example.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        phone: '+254700000001',
        role: 'USER',
        isApproved: true,
        isEmailVerified: true,
        authProvider: 'local',
        bio: 'Active member since 2023',
      },
      {
        email: 'user2@example.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+254700000002',
        role: 'USER',
        isApproved: true,
        isEmailVerified: true,
        authProvider: 'local',
        bio: 'Worship team member',
      },
      {
        email: 'user3@example.com',
        password: hashedPassword,
        firstName: 'Peter',
        lastName: 'Kamau',
        phone: '+254700000003',
        role: 'USER',
        isApproved: false,
        isEmailVerified: false,
        authProvider: 'local',
        bio: 'New member waiting approval',
      },
    ],
  });

  // Add this to server.js temporarily
app.post('/api/seed/songs', async (req, res) => {
  try {
    const songs = await prisma.song.createMany({
      data: [
        {
          title: 'Njambi Ya Thengo',
          artist: 'Traditional',
          lyrics: `Njambi ya thengo, njambi ya thengo\nTwendee twendee twendee\nNjambi ya thengo, njambi ya thengo\nTwendee twendee twendee`,
          isOriginal: false,
        },
        {
          title: 'Wendo Wi Mwega',
          artist: 'Kikuyu Gospel',
          lyrics: `Wendo wi mwega, wendo wi mwega\nNjambi ahendire andu othe\nWendo wi mwega, wendo wi mwega\nTwendane o ta uria Njambi atwendete`,
          isOriginal: false,
        },
        {
          title: 'Ndi Mukenya',
          artist: 'Agendi',
          lyrics: `Ndi mukenya, ndi mukenya\nNĩ ũndũ wa Njambi wakwa\nNdi mukenya, ndi mukenya\nNĩ wendo wake uhunjagia`,
          isOriginal: true,
        },
      ],
    });
    
    res.json({ message: `Created ${songs.count} sample songs` });
  } catch (error) {
    console.error('Error seeding songs:', error);
    res.status(500).json({ message: 'Failed to seed songs' });
  }
});

  // Get created users for relationships
  const superAdmin = await prisma.user.findUnique({ where: { email: 'superadmin@newband.org' } });
  const admin = await prisma.user.findUnique({ where: { email: 'admin@newband.org' } });
  const user1 = await prisma.user.findUnique({ where: { email: 'user1@example.com' } });
  const user2 = await prisma.user.findUnique({ where: { email: 'user2@example.com' } });

  // Create Songs
  console.log('Creating songs...');
  const songs = await prisma.song.createMany({
    data: [
      {
        title: 'Njambi Ya Thengo',
        artist: 'Traditional',
        lyrics: `Njambi Ya Thengo ni muthemba\nWendo wake ni mwega\nTukamwogothe muno\nNiguo witwo mwathani`,
        requestCount: 5,
      },
      {
        title: 'Wendo Wi Mwega',
        artist: 'Kikuyu Gospel',
        lyrics: `Wendo wi mwega\nWendo wi mwega\nWitwo ni Yesu\nMwonjoria witũ`,
        requestCount: 3,
      },
      {
        title: 'Ndi Mukenya',
        artist: 'Agendi',
        lyrics: `Ndi mukenya nĩ ũndũ wa Jesu\nNĩandĩkire ngaiĩ\nNĩandĩkire ngakinya\nMwaki-inĩ wa ithe`,
        requestCount: 2,
      },
      {
        title: 'Ningũthamakio',
        artist: 'Kikuyu Gospel',
        lyrics: `Ningũthamakio nĩ wega waku\nNingũinĩra nĩ wendo waku\nJesu Mwathani\nNingũkũgoocaga`,
        requestCount: 4,
      },
      {
        title: 'Twendete Jesu',
        artist: 'Traditional',
        lyrics: `Twendete Jesu nĩwe mũhonokia\nTwendete Jesu nĩwe mũthithia\nTũkũmũgoocaga\nMatukũ mothe ma muoyo witũ`,
        requestCount: 1,
      },
    ],
  });

  // Get created songs
  const song1 = await prisma.song.findFirst({ where: { title: 'Njambi Ya Thengo' } });
  const song2 = await prisma.song.findFirst({ where: { title: 'Wendo Wi Mwega' } });
  const song3 = await prisma.song.findFirst({ where: { title: 'Ndi Mukenya' } });
  const song4 = await prisma.song.findFirst({ where: { title: 'Ningũthamakio' } });

  // Create Events
  console.log('Creating events...');
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7));
  nextSunday.setHours(9, 0, 0, 0);

  const nextWednesday = new Date(now);
  nextWednesday.setDate(now.getDate() + ((3 - now.getDay() + 7) % 7));
  nextWednesday.setHours(17, 0, 0, 0);

  const event1 = await prisma.event.create({
    data: {
      title: 'Sunday Worship Service',
      description: 'Join us for a powerful time of worship and fellowship. We will be singing traditional Kikuyu gospel songs and sharing testimonies.',
      eventDate: nextSunday,
      location: 'Ruiru Town Hall',
      theme: 'Worship and Praise',
      guestSpeaker: 'Pastor John Kamau',
      bannerImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      maxAttendees: 100,
    }
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Wednesday Prayer Meeting',
      description: 'Mid-week prayer and bible study session. Come pray with us and study God\'s word.',
      eventDate: nextWednesday,
      location: 'Fellowship Center',
      theme: 'Prayer and Intercession',
      guestSpeaker: 'Elder Mary Wanjiku',
      bannerImage: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
      maxAttendees: 50,
    }
  });

  // Create Sessions for Event 1
  console.log('Creating sessions...');
  const session1 = await prisma.session.create({
    data: {
      type: 'FIRST_SESSION',
      title: 'Opening Worship',
      startTime: new Date(nextSunday.setHours(9, 0, 0)),
      endTime: new Date(nextSunday.setHours(10, 0, 0)),
      worshipLeader: 'Brother Peter Mwangi',
      notes: 'Open with traditional hymns. Focus on praise and thanksgiving.',
      order: 1,
      eventId: event1.id,
    }
  });

  const session2 = await prisma.session.create({
    data: {
      type: 'SECOND_SESSION',
      title: 'Main Worship',
      startTime: new Date(nextSunday.setHours(10, 15, 0)),
      endTime: new Date(nextSunday.setHours(11, 30, 0)),
      worshipLeader: 'Elder Mary Wanjiku',
      notes: 'Main worship session with choir. Include song requests.',
      order: 2,
      eventId: event1.id,
    }
  });

  const session3 = await prisma.session.create({
    data: {
      type: 'TESTIMONY_TIME',
      title: 'Testimonies',
      startTime: new Date(nextSunday.setHours(11, 30, 0)),
      endTime: new Date(nextSunday.setHours(12, 0, 0)),
      worshipLeader: 'Pastor John Kamau',
      notes: 'Time for members to share testimonies.',
      order: 3,
      eventId: event1.id,
    }
  });

  // Create Playlist for Event 1
  console.log('Creating playlist...');
  const playlist = await prisma.playlist.create({
    data: {
      eventId: event1.id,
      flowNotes: 'Start with upbeat songs, transition to worship, end with testimonies',
    }
  });

  // Create Playlist Items
  await prisma.playlistItem.createMany({
    data: [
      {
        playlistId: playlist.id,
        sessionId: session1.id,
        songId: song1.id,
        order: 1,
        backgroundColor: '#f97316',
        notes: 'Opening song - all congregation',
      },
      {
        playlistId: playlist.id,
        sessionId: session1.id,
        songId: song2.id,
        order: 2,
        backgroundColor: '#ea580c',
        notes: 'Second song - choir leads',
      },
      {
        playlistId: playlist.id,
        sessionId: session2.id,
        songId: song3.id,
        order: 3,
        backgroundColor: '#c2410c',
        notes: 'Main worship song',
      },
      {
        playlistId: playlist.id,
        sessionId: session2.id,
        songId: song4.id,
        order: 4,
        backgroundColor: '#9a3412',
        notes: 'Closing worship song',
      },
    ],
  });

  // Create Song Requests
  console.log('Creating song requests...');
  const request1 = await prisma.songRequest.create({
    data: {
      songTitle: 'Njambi Ya Thengo',
      stanzaNumber: 'Verse 1 and Chorus',
      testimony: 'This song has been a blessing to my family for generations. It reminds us of God\'s faithfulness.',
      status: 'PENDING',
      voteCount: 3,
      userId: user1.id,
      songId: song1.id,
    }
  });

  const request2 = await prisma.songRequest.create({
    data: {
      songTitle: 'Wendo Wi Mwega',
      testimony: 'I experienced God\'s love through this song during a difficult time.',
      status: 'SCHEDULED',
      scheduledDate: nextSunday,
      voteCount: 5,
      userId: user2.id,
      songId: song2.id,
    }
  });

  const request3 = await prisma.songRequest.create({
    data: {
      songTitle: 'Ndi Mukenya',
      stanzaNumber: 'All verses',
      testimony: 'This song brings so much joy to my heart.',
      status: 'SUNG',
      voteCount: 2,
      userId: user1.id,
      songId: song3.id,
    }
  });

  // Create Votes
  console.log('Creating votes...');
  await prisma.vote.createMany({
    data: [
      {
        userId: user1.id,
        requestId: request2.id,
        eventId: event1.id,
      },
      {
        userId: user2.id,
        requestId: request2.id,
        eventId: event1.id,
      },
      {
        userId: user1.id,
        requestId: request1.id,
        eventId: event1.id,
      },
    ],
  });

  // Create Blog Categories
  console.log('Creating blog categories...');
  const category1 = await prisma.category.create({
    data: {
      name: 'Worship',
      slug: 'worship',
      description: 'Posts about worship and music',
    }
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Testimonies',
      slug: 'testimonies',
      description: 'Personal testimonies from members',
    }
  });

  const category3 = await prisma.category.create({
    data: {
      name: 'Teaching',
      slug: 'teaching',
      description: 'Biblical teachings and sermons',
    }
  });

  // Create Blog Tags
  console.log('Creating blog tags...');
  const tag1 = await prisma.tag.create({
    data: {
      name: 'gospel',
      slug: 'gospel',
    }
  });

  const tag2 = await prisma.tag.create({
    data: {
      name: 'kikuyu',
      slug: 'kikuyu',
    }
  });

  const tag3 = await prisma.tag.create({
    data: {
      name: 'worship',
      slug: 'worship',
    }
  });

  // Create Blog Posts
  console.log('Creating blog posts...');
  const blog1 = await prisma.blogPost.create({
    data: {
      title: 'The Power of Traditional Gospel Music',
      slug: 'power-of-traditional-gospel-music',
      content: '<p>Traditional Kikuyu gospel music has a unique way of touching the soul. The melodies passed down through generations carry the faith of our ancestors.</p><p>When we sing these songs, we connect not just with God, but with our heritage. The lyrics speak of God\'s faithfulness, His provision, and His love for His people.</p><p>In our fellowship, we\'ve seen how these songs bring people together. Young and old alike are moved by the familiar tunes and powerful messages.</p>',
      excerpt: 'Discover how traditional Kikuyu gospel music connects generations and deepens worship.',
      featuredImage: 'https://images.unsplash.com/photo-1507692049790-de58290c433e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      metaTitle: 'The Power of Traditional Gospel Music - New Band Fellowship',
      metaDescription: 'Explore the rich heritage of Kikuyu gospel music and how it brings generations together in worship.',
      metaKeywords: 'gospel music, traditional, kikuyu, worship',
      views: 45,
      isPublished: true,
      publishedAt: new Date(),
      authorId: admin.id,
    }
  });

  // Connect categories and tags to blog post
  await prisma.blogPostCategory.create({
    data: {
      postId: blog1.id,
      categoryId: category1.id,
    }
  });

  await prisma.blogPostCategory.create({
    data: {
      postId: blog1.id,
      categoryId: category3.id,
    }
  });

  await prisma.blogPostTag.create({
    data: {
      postId: blog1.id,
      tagId: tag1.id,
    }
  });

  await prisma.blogPostTag.create({
    data: {
      postId: blog1.id,
      tagId: tag2.id,
    }
  });

  // Create Comments
  console.log('Creating comments...');
  await prisma.comment.create({
    data: {
      content: 'This is so true! I grew up singing these songs with my grandmother.',
      isApproved: true,
      userId: user1.id,
      postId: blog1.id,
    }
  });

  await prisma.comment.create({
    data: {
      content: 'Thank you for sharing. These songs are a treasure.',
      isApproved: true,
      userId: user2.id,
      postId: blog1.id,
    }
  });

  // Create Gallery Images
  console.log('Creating gallery...');
  await prisma.gallery.createMany({
    data: [
      {
        title: 'Sunday Worship',
        description: 'Worship service at Ruiru Town Hall',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        order: 1,
        isActive: true,
      },
      {
        title: 'Choir Practice',
        description: 'Choir preparing for Sunday',
        imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290c433e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        order: 2,
        isActive: true,
      },
      {
        title: 'Fellowship',
        description: 'Community gathering after service',
        imageUrl: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
        order: 3,
        isActive: true,
      },
      {
        title: 'Prayer Meeting',
        description: 'Wednesday prayer session',
        imageUrl: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        order: 4,
        isActive: true,
      },
    ],
  });

  // Create Landing Content
  console.log('Creating landing content...');
  await prisma.landingContent.createMany({
    data: [
      {
        section: 'hero',
        title: 'Welcome to New Band Fellowship',
        subtitle: 'Experience the beauty of worship through Nyimbo cia Agendi and old Kikuyu gospel songs',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        buttonText: 'Join Us This Sunday',
        buttonLink: '/events',
        order: 1,
        isActive: true,
      },
      {
        section: 'about',
        title: 'About New Band Fellowship',
        content: 'We are a community of believers dedicated to preserving and celebrating the rich heritage of Kikuyu gospel music while creating a welcoming space for worship and fellowship in Ruiru Town.',
        imageUrl: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
        order: 2,
        isActive: true,
      },
      {
        section: 'mission',
        title: 'Our Mission',
        content: 'To preserve and promote the rich heritage of Kikuyu gospel music while creating an inclusive community where people can experience God\'s love through worship.',
        order: 3,
        isActive: true,
      },
      {
        section: 'vision',
        title: 'Our Vision',
        content: 'A community where traditional gospel music bridges generations, bringing people together in worship and fellowship.',
        order: 4,
        isActive: true,
      },
    ],
  });

  // Create Active Banner
  console.log('Creating event banner...');
  await prisma.eventBanner.create({
    data: {
      message: '🎵 Special Worship Night this Saturday at 5PM! Join us for an evening of traditional gospel songs.',
      linkUrl: '/events',
      linkText: 'Learn More',
      backgroundColor: '#f97316',
      textColor: '#ffffff',
      isActive: true,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    }
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });