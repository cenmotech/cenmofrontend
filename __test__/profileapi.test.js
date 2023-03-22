import axios from 'axios';
import { addAddress, getUserProfile, editProfile } from '../helpers/profile/api';
jest.mock('axios'); // mock the axios module
const getConfig = () => {
    return {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
  }
const baseUrl = 'http://127.0.0.1/authuser';
const accessToken = 'your-access-token';

describe('getUserProfile', () => {
    afterEach(() => {
      jest.resetAllMocks(); // reset all mock functions after each test
    });

    it('should get user profile successfully', async () => {
      const expectedResponse = { username: 'johndoe', email: 'johndoe@example.com' };
      axios.get.mockResolvedValueOnce({ data: expectedResponse });
  
      const result = await getUserProfile(accessToken);
      expect(axios.get).toHaveBeenCalledTimes(1); // check that axios.get was called once
      expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/get-user-profile`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }); // check that axios.get was called with the correct arguments
      expect(result).toEqual(expectedResponse);
    });
    it('should throw an error if the request fails', async () => {
      const expectedError = new Error('Request failed with status code 500');
      expectedError.response = { data: { error: 'Request failed with status code 500' } };
      axios.get.mockRejectedValueOnce(expectedError);
      await expect(getUserProfile(accessToken)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
});

describe('editProfile', () => {
    const body = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      bio: 'A passionate developer',
      image: 'https://example.com/profile-pic.png',
    };
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it('should edit the user profile', async () => {
      const expectedResponse = { status: 'success' };
      axios.post.mockResolvedValueOnce({ data: expectedResponse });
  
      const result = await editProfile(accessToken, body);
  
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(`${baseUrl}/edit-profile`, body, getConfig());
      expect(result).toEqual(expectedResponse);
    });
  
    it('should throw an error if the API call fails', async () => {
      const expectedError = { response: { data: { error: 'Internal Server Error' } } };
      axios.post.mockRejectedValueOnce(expectedError);
  
      await expect(editProfile(accessToken, body)).rejects.toThrow('Internal Server Error');
    });
});

describe('addAddress', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it('should add an address successfully', async () => {
      const expectedResponse = { message: 'Address added successfully' };
      axios.post.mockResolvedValueOnce({ data: expectedResponse });
  
      const result = await addAddress(accessToken, { street: '123 Main St', city: 'Anytown', state: 'CA' });
  
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(`${baseUrl}/add-address`, { street: '123 Main St', city: 'Anytown', state: 'CA' }, getConfig());
      expect(result).toEqual(expectedResponse);
    });
  
    it('should throw an error if the request fails', async () => {
      const expectedError = new Error('Request failed with status code 500');
      expectedError.response = { data: { error: 'Request failed with status code 500' } };
      axios.post.mockRejectedValueOnce(expectedError);
  
      await expect(addAddress(accessToken, { street: '123 Main St', city: 'Anytown', state: 'CA' })).rejects.toThrow('Request failed with status code 500');
    });
});