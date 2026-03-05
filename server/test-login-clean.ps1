# Simple Login Test Script
Write-Host "====================================="
Write-Host "LOGIN TEST" 
Write-Host "====================================="

$body = @{
    email = "admin@newband.org"
    password = "Password123!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "`n✅ LOGIN SUCCESSFUL!" -ForegroundColor Green
    Write-Host "------------------------"
    Write-Host "User: $($response.data.user.firstName) $($response.data.user.lastName)"
    Write-Host "Email: $($response.data.user.email)"
    Write-Host "Role: $($response.data.user.role)"
    Write-Host "Approved: $($response.data.user.isApproved)"
    Write-Host "------------------------"
    Write-Host "Access Token: $($response.data.accessToken)"
    Write-Host "------------------------"
    
    # Save token to file
    $response.data.accessToken | Out-File -FilePath "token.txt"
    Write-Host "Token saved to token.txt"
    
} catch {
    Write-Host "`n❌ LOGIN FAILED!" -ForegroundColor Red
    Write-Host "------------------------"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody"
    } else {
        Write-Host "Error: $($_.Exception.Message)"
    }
}

Write-Host "`n====================================="