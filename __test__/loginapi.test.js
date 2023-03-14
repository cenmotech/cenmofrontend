const axios = require('axios')
describe('POST /api/login', () => {
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
    it('Failed Login due to unregistered email', async () => {
        try {
            await axios.post('http://localhost:3001/api/login', body, config, {
              timeout: 5000
            });
            } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Connection refused. Please make sure the server is running.');
            } else if (error.response) {
                expect(error.response.status).toEqual(401);
                expect(error.response.data.message).toEqual('Invalid email format');
            } else {
                expect(error.message).toEqual('Network Error');
              
            }
          }
    });
});