// After successful login/signup
const userData = {
  name: 'User Name',  // Replace with actual user name from form/response
  email: 'user@example.com'  // Replace with actual email
};

localStorage.setItem('user', JSON.stringify(userData));
