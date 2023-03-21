const axios = require('axios');
jest.mock('axios');

describe('POST /api/login', () => {
    const baseURL = 'http://localhost:3001/api/login';
    const loginResponse = [
        {
            token:'userToken',
        },
    ]
    
    beforeEach(() => {
        axios.post.mockReset();
        body = {
          email: 'unregistered@cenmo.com',
          password: '123'
        };
      });

    let body= {
        "email": "unregistered@cenmo.com",
        "password": "123"
    }
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    it('Should Success Logging in', async () => {
        axios.post.mockResolvedValue({ data: loginResponse });
        const { data : access } = await axios.post(baseURL, body, config)
        expect(access).toEqual(loginResponse);
        expect(axios.post).toHaveBeenCalledWith(baseURL, body, config);
        expect(axios.post).toHaveBeenCalledTimes(1);
        });

    it('Should fail to log in due to an incorrect password', async () => {
        axios.post.mockRejectedValue({ response: { status: 401, data: { message: 'Invalid password' } } });
        try {
            await axios.post(baseURL, body, config);
        } catch (error) {
            expect(error.response.status).toEqual(401);
            expect(error.response.data.message).toEqual('Invalid password');
            expect(axios.post).toHaveBeenCalledWith(baseURL, body, config);
            expect(axios.post).toHaveBeenCalledTimes(1);
        }
        });
});