const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFullSchema() {
  console.log('🔍 Testing full schema...\n');

  try {
    // Count records in each table
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.song.count(),
      prisma.songRequest.count(),
      prisma.vote.count(),
      prisma.event.count(),
      prisma.session.count(),
      prisma.playlist.count(),
      prisma.playlistItem.count(),
      prisma.blogPost.count(),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.comment.count(),
      prisma.gallery.count(),
      prisma.landingContent.count(),
      prisma.eventBanner.count(),
      prisma.systemSettings.count()
    ]);

    console.log('📊 Table counts:');
    console.log(`   Users: ${counts[0]}`);
    console.log(`   Songs: ${counts[1]}`);
    console.log(`   Song Requests: ${counts[2]}`);
    console.log(`   Votes: ${counts[3]}`);
    console.log(`   Events: ${counts[4]}`);
    console.log(`   Sessions: ${counts[5]}`);
    console.log(`   Playlists: ${counts[6]}`);
    console.log(`   Playlist Items: ${counts[7]}`);
    console.log(`   Blog Posts: ${counts[8]}`);
    console.log(`   Categories: ${counts[9]}`);
    console.log(`   Tags: ${counts[10]}`);
    console.log(`   Comments: ${counts[11]}`);
    console.log(`   Gallery: ${counts[12]}`);
    console.log(`   Landing Content: ${counts[13]}`);
    console.log(`   Event Banners: ${counts[14]}`);
    console.log(`   System Settings: ${counts[15]}`);

    // Test a complex query with relations
    console.log('\n🔗 Testing relations...');
    
    const userWithRequests = await prisma.user.findFirst({
      include: {
        songRequests: {
          include: {
            song: true,
            votes: true
          }
        }
      }
    });
    console.log(`   ✅ User ${userWithRequests?.firstName} has ${userWithRequests?.songRequests.length} song requests`);

    const eventWithSessions = await prisma.event.findFirst({
      include: {
        sessions: true,
        playlist: {
          include: {
            items: true
          }
        }
      }
    });
    console.log(`   ✅ Event "${eventWithSessions?.title}" has ${eventWithSessions?.sessions.length} sessions`);

    const blogWithComments = await prisma.blogPost.findFirst({
      include: {
        comments: true,
        categories: true,
        tags: true
      }
    });
    console.log(`   ✅ Blog post "${blogWithComments?.title}" has ${blogWithComments?.comments.length} comments`);

    console.log('\n✅ Full schema test passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFullSchema();