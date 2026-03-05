Write-Host "=== SIMPLE LOGIN TEST ==="

$body = '{
    "email": "admin@newband.org",
    "password": "Password123!"
}'

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "SUCCESS! Logged in as: $($response.data.user.email)"
    Write-Host "Role: $($response.data.user.role)"
    Write-Host "Token: $($response.data.accessToken)"
    
    # Save token
    $response.data.accessToken | Out-File -FilePath "token.txt"
    Write-Host "Token saved to token.txt"
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}