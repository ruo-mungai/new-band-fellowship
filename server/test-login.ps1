Write-Host "🔐 Testing Login and Token Generation" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

$body = @{
    email = "admin@newband.org"
    password = "Password123!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "`n✅ Login Successful!" -ForegroundColor Green
    Write-Host "👤 User: $($response.data.user.firstName) $($response.data.user.lastName)" -ForegroundColor Cyan
    Write-Host "🎭 Role: $($response.data.user.role)" -ForegroundColor Cyan
    Write-Host "🔑 Access Token: $($response.data.accessToken.Substring(0, 20))..." -ForegroundColor Yellow
    
    # Save token to file for other tests
    $response.data.accessToken | Out-File -FilePath "token.txt"
    $response.data.refreshToken | Out-File -FilePath "refreshtoken.txt"
    
    Write-Host "`n✅ Token saved to token.txt" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Login Failed:" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody -ForegroundColor Red
    } else {
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}