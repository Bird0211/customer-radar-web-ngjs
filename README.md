# customer-radar-web-ngjs
## web project for customer radar by angularjs + bootstrap
### Methods:
- Add user
- List users
- Search user by phone
- Edit user
- remove user

## Get start
1. Edit config.js
   change localhost uri to production environment uri
   ```
    var searchUserUrl = 'http://localhost:8080/api/user/phone';
    var searchUserUrl = 'http://localhost:8080/api/user/phone';
    var addUserUrl = 'http://localhost:8080/api/user/add';
    var delUserUrl = 'http://localhost:8080/api/user/del';
    var updateUrl = 'http://localhost:8080/api/user/update';
    var getUsersUrl = 'http://localhost:8080/api/user/all';
   ```
2. Run web server
