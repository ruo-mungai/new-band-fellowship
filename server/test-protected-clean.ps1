# Protected Endpoints Test Script
Write-Host "====================================="
Write-Host "PROTECTED ENDPOINTS TEST"
Write-Host "====================================="

# Read token from file
if (Test-Path "token.txt") {
    $token = Get-Content "token.txt" -Raw
    $token = $token.Trim()
    Write-Host "`nToken loaded successfully"
} else {
    Write-Host "`nNo token found. Run test-login-clean.ps1 first."
    exit
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test 1: Get Current User
Write-Host "`n1. Testing /api/auth/me" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers
    Write-Host "   ✅ Success" -ForegroundColor Green
    Write-Host "   User: $($response.data.user.firstName) $($response.data.user.lastName)"
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get User Profile
Write-Host "`n2. Testing /api/users/profile" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/users/profile" -Method Get -Headers $headers
    Write-Host "   ✅ Success" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Song Requests
Write-Host "`n3. Testing /api/songs/requests" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/songs/requests" -Method Get -Headers $headers
    Write-Host "   ✅ Success - Found $($response.data.requests.Count) requests" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Create Song Request
Write-Host "`n4. Testing POST /api/songs/requests" -ForegroundColor Yellow
$songBody = @{
    songTitle = "Test Song"
    stanzaNumber = "1"
    testimony = "This is a test request"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/songs/requests" -Method Post -Body $songBody -Headers $headers
    Write-Host "   ✅ Success - Request created" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n====================================="