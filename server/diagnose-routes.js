const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSING ROUTE ISSUES\n');

// Check if server is running
const http = require('http');
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/test',
  method: 'GET',
  timeout: 2000
};

const req = http.request(options, (res) => {
  console.log(`✅ Server is running on port 5000 (status: ${res.statusCode})`);
  checkFiles();
});

req.on('error', (e) => {
  console.error('❌ Server is NOT running on port 5000');
  console.error('   Please start the server with: npm run dev');
  process.exit(1);
});

req.end();

function checkFiles() {
  console.log('\n📁 CHECKING FILES:\n');

  // Check if app.js exists
  const appJsPath = path.join(__dirname, 'src', 'app.js');
  if (fs.existsSync(appJsPath)) {
    console.log('✅ src/app.js exists');
    
    // Read app.js content
    const appContent = fs.readFileSync(appJsPath, 'utf8');
    
    // Check for route mounting
    if (appContent.includes('app.use(\'/api/public\'')) {
      console.log('✅ Found app.use(\'/api/public\') in app.js');
    } else {
      console.log('❌ MISSING: app.use(\'/api/public\') in app.js');
    }
    
    // Check for public routes import
    if (appContent.includes('require(\'./routes/public.routes\')')) {
      console.log('✅ Found public routes import');
    } else {
      console.log('❌ MISSING: public routes import');
    }
  } else {
    console.log('❌ src/app.js NOT FOUND');
  }

  // Check if public.routes.js exists
  const publicRoutesPath = path.join(__dirname, 'src', 'routes', 'public.routes.js');
  if (fs.existsSync(publicRoutesPath)) {
    console.log('✅ src/routes/public.routes.js exists');
    
    // Read public routes content
    const publicContent = fs.readFileSync(publicRoutesPath, 'utf8');
    
    // Check for router export
    if (publicContent.includes('module.exports = router')) {
      console.log('✅ Found module.exports in public.routes.js');
    } else {
      console.log('❌ MISSING: module.exports in public.routes.js');
    }
    
    // Check for test route
    if (publicContent.includes('router.get(\'/test\'')) {
      console.log('✅ Found test route in public.routes.js');
    } else {
      console.log('❌ MISSING: test route in public.routes.js');
    }
  } else {
    console.log('❌ src/routes/public.routes.js NOT FOUND');
  }

  // Check if server.js exists
  const serverJsPath = path.join(__dirname, 'server.js');
  if (fs.existsSync(serverJsPath)) {
    console.log('✅ server.js exists');
  } else {
    console.log('❌ server.js NOT FOUND');
  }

  console.log('\n🔧 NEXT STEPS:');
  console.log('1. Make sure your app.js has the route mounting');
  console.log('2. Make sure your public.routes.js exports the router');
  console.log('3. Restart the server after making changes');
}