# Auth Testing Playbook (Emergent Google Auth + Email/Password)

## Step 1: Create Test User & Session via MongoDB

```bash
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  role: 'merchant',
  auth_provider: 'google',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Test Backend Endpoints

```bash
# Auth me (Google session cookie or Bearer)
curl -X GET "$REACT_APP_BACKEND_URL/api/auth/me" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# Email/password signup
curl -X POST "$REACT_APP_BACKEND_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"merchant@test.gr","password":"Test1234!","name":"Test Merchant","role":"merchant"}'

# Email/password login
curl -X POST "$REACT_APP_BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"merchant@test.gr","password":"Test1234!"}'

# Merchant protected endpoint
curl -X GET "$REACT_APP_BACKEND_URL/api/merchant/stats" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Step 3: Browser Auth Cookie Set

```python
await page.context.add_cookies([{
    "name": "session_token",
    "value": "YOUR_SESSION_TOKEN",
    "domain": "your-app.preview.emergentagent.com",
    "path": "/",
    "httpOnly": True,
    "secure": True,
    "sameSite": "None"
}])
```

## Quick Debug

```bash
mongosh --eval "
use('test_database');
db.users.find().limit(2).pretty();
db.user_sessions.find().limit(2).pretty();
"
```

## Success Indicators
- /api/auth/me returns user data with role
- Merchant-only endpoints return 403 for customers
- Email/password login works with bcrypt hash
- Brute-force protection blocks after 5 failures
