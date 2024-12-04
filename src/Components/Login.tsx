// After successful login/signup
const userData = {
  name: 'User Name',
  email: 'user@example.com'
};

localStorage.setItem('user', JSON.stringify(userData));
