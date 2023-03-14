const axios = require('axios');
const app = require('../pages/api/register.js');

describe('POST /authuser/register', () => {
  it('should create a user and return status code 200 with message "User has been created"', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      phone: '08123456789'
    };

    const response = await axios.post('http://localhost:8000/authuser/register', userData);

    expect(response.status).toEqual(200);
    expect(response.data.message).toEqual('User has been created');
  });

  it('should return status code 401 with error message when invalid data is sent', async () => {
    const userData = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'password123',
      phone: '08123456789'
    };

    try {
        await axios.post('http://localhost:8000/authuser/register', userData, {
          timeout: 5000
        });
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Connection refused. Please make sure the server is running.');
        } else if (error.response) {
          expect(error.response.status).toEqual(401);
          expect(error.response.data.message).toEqual('Invalid email format');
        } else {
          throw new Error(`Error in sending request: ${error.message}`);
        }
      }
  });
});
