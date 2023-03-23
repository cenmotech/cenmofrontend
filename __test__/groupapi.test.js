import axios from 'axios';
import { createGroup, createCategory, createPost, createListing, 
getAllCategories, getPostbyLoggedUser, getListingbyLoggedUser, 
getPostOnGroup, getListingBySeller, getListingBySellerOnGroup,
getListingOnGroup, searchPostByDesc, searchPostOnGroup,
searchListingByName, searchListingOnGroup, joinGroup, searchGroup,
seeGroup, getAllCategoriesContains } from '../helpers/group/api';

jest.mock('axios'); // mock the axios module
const baseUrl = 'http://127.0.0.1:8000/group';
const accessToken = 'ranodomaosmdhalwe';
describe('createGroup', () => {
  afterEach(() => {
    jest.resetAllMocks(); // reset all mock functions after each test
  });

  it('should create a group successfully', async () => {
    const body = {name: 'Group 1', category: 'Category A', desc: 'gaming', user:{email: 'dicky123.com'} };
    const expectedResponse = 'Group created successfully' ;
    axios.post.mockResolvedValueOnce({ data: expectedResponse }); // mock a successful response from axios

    const result = await createGroup(accessToken, body);

    expect(axios.post).toHaveBeenCalledTimes(1); // check that axios.post was called once
    expect(axios.post).toHaveBeenCalledWith(`${baseUrl}/create_group`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }); // check that axios.post was called with the correct arguments
    expect(result).toEqual(expectedResponse); // check that the function returns the expected result
  });

  it('should throw an error if the request fails', async () => {
    const body = { name: 'Group 1', category: 'Category A' };
    const expectedError = new Error('Request failed with status code 500');
    expectedError.response = { data: { error: 'Request failed with status code 500' } }; // set the response data to include an error message
    axios.post.mockRejectedValueOnce(expectedError); // mock a failed response from axios
  
    await expect(createGroup(accessToken, body)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
  });
});

describe('createCategory', () => {
  
    afterEach(() => {
      jest.resetAllMocks(); // reset all mock functions after each test
    });
  
    it('should create a category successfully', async () => {
      const body = { name: 'Category 1', description: 'Some description' };
      const expectedResponse = 'Category created successfully';
      axios.post.mockResolvedValueOnce({ data: expectedResponse }); // mock a successful response from axios
  
      const result = await createCategory(accessToken, body);
  
      expect(axios.post).toHaveBeenCalledTimes(1); // check that axios.post was called once
      expect(axios.post).toHaveBeenCalledWith(`${baseUrl}/create_category`, body, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }); // check that axios.post was called with the correct arguments
      expect(result).toEqual(expectedResponse); // check that the function returns the expected result
    });
  
    it('should throw an error if the request fails', async () => {
      const body = { name: 'Category 1', description: 'Some description' };
      const expectedError = new Error('Request failed with status code 500');
      expectedError.response = { data: { error: 'Request failed with status code 500' } }; // set the response data to include an error message
      axios.post.mockRejectedValueOnce(expectedError); // mock a failed response from axios
  
      await expect(createCategory(accessToken, body)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
  });

describe('createPost', () => {
  
    afterEach(() => {
      jest.resetAllMocks(); // reset all mock functions after each test
    });
  
    it('should create a post successfully', async () => {
      const body = {title: 'New Post', content: 'This is a new post content', groupId: 'group-123'};
      const expectedResponse = 'Post created successfully' ;
      axios.post.mockResolvedValueOnce({ data: expectedResponse }); // mock a successful response from axios
  
      const result = await createPost(accessToken, body);
  
      expect(axios.post).toHaveBeenCalledTimes(1); // check that axios.post was called once
      expect(axios.post).toHaveBeenCalledWith(`${baseUrl}/create_post`, body, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }); // check that axios.post was called with the correct arguments
      expect(result).toEqual(expectedResponse); // check that the function returns the expected result
    });
  
    it('should throw an error if the request fails', async () => {
      const body = { title: 'New Post', content: 'This is a new post content', groupId: 'group-123' };
      const expectedError = new Error('Request failed with status code 500');
      expectedError.response = { data: { error: 'Request failed with status code 500' } };
      axios.post.mockRejectedValueOnce(expectedError); // mock a failed response from axios
  
      await expect(createPost(accessToken, body)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
});

describe('createListing', () => {
    afterEach(() => {
        jest.resetAllMocks(); // reset all mock functions after each test
    });

    it('should create a listing successfully', async () => {
        const body = { title: 'New Listing', content: 'This is a new listing content', groupId: 'group-123' };
        const expectedResponse = 'Listing created successfully';
        axios.post.mockResolvedValueOnce({ data: expectedResponse }); // mock a successful response from axios

        const result = await createListing(accessToken, body);

        expect(axios.post).toHaveBeenCalledTimes(1); // check that axios.post was called once
        expect(axios.post).toHaveBeenCalledWith(`${baseUrl}/create_listing`, body, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        }); // check that axios.post was called with the correct arguments
        expect(result).toEqual(expectedResponse); // check that the function returns the expected result
    });

    it('should throw an error if the request fails', async () => {
        const body = { title: 'New Listing', content: 'This is a new listing content', groupId: 'group-123' };
        const expectedError = new Error('Request failed with status code 500');
        expectedError.response = { data: { error: 'Request failed with status code 500' } };
        axios.post.mockRejectedValueOnce(expectedError); // mock a failed response from axios

        await expect(createListing(accessToken, body)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });

});

describe('getAllCategories', () => {
    const accessToken = 'your-access-token';
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it('should retrieve all categories successfully', async () => {
      const expectedResponse = ['Category A', 'Category B'];
      axios.get.mockResolvedValueOnce({ data: expectedResponse });
  
      const result = await getAllCategories(accessToken);
  
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/get_all_categories`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(result).toEqual(expectedResponse);
    });
  
    it('should throw an error if the request fails', async () => {
      const expectedError = new Error('Request failed with status code 500');
      expectedError.response = { data: { error: 'Request failed with status code 500' } };
      axios.get.mockRejectedValueOnce(expectedError);
  
      await expect(getAllCategories(accessToken)).rejects.toThrow('Request failed with status code 500');
    });
});

describe('getPostbyLoggedUser', () => {
    const accessToken = 'your-access-token';
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it('should get posts successfully', async () => {
      const expectedResponse = ['post1', 'post2', 'post3'];
      axios.get.mockResolvedValueOnce({ data: expectedResponse });
  
      const result = await getPostbyLoggedUser(accessToken);
  
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/get_post_by_logged_user`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      expect(result).toEqual(expectedResponse);
    });
  
    it('should throw an error if the request fails', async () => {
      const expectedError = new Error('Request failed with status code 500');
      expectedError.response = { data: { error: 'Request failed with status code 500' } };
      axios.get.mockRejectedValueOnce(expectedError);
  
      await expect(getPostbyLoggedUser(accessToken)).rejects.toThrow('Request failed with status code 500');
    });
});

describe('getListingbyLoggedUser', () => {
    const accessToken = 'your-access-token';
  
    afterEach(() => {
      jest.resetAllMocks(); // reset all mock functions after each test
    });
  
    it('should get listing by logged user successfully', async () => {
      const expectedResponse = ['listing1', 'listing2'];
      axios.get.mockResolvedValueOnce({ data: expectedResponse }); // mock a successful response from axios
  
      const result = await getListingbyLoggedUser(accessToken);
  
      expect(axios.get).toHaveBeenCalledTimes(1); // check that axios.get was called once
      expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/get_listing_by_logged_user`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }); // check that axios.get was called with the correct arguments
      expect(result).toEqual(expectedResponse); // check that the function returns the expected result
    });
  
    it('should throw an error if the request fails', async () => {
        const expectedError = new Error('Request failed with status code 500');
        expectedError.response = { data: { error: 'Request failed with status code 500' } };
        axios.get.mockRejectedValueOnce(expectedError);
  
      await expect(getListingbyLoggedUser(accessToken)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
});

describe('getPostOnGroup', () => {
    const accessToken = 'your-access-token';
    const groupId = 'group-123';
    afterEach(() => {
        jest.resetAllMocks(); // reset all mock functions after each test
      });
    it('should get post on group successfully', async () => {
        const expectedResponse = ['post1', 'post2'];
        axios.get.mockResolvedValueOnce({ data: expectedResponse });

        const result = await getPostOnGroup(accessToken, groupId);
        expect(axios.get).toHaveBeenCalledTimes(1); // check that axios.get was called once
        expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/get_post_on_group/group-123`, {
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
        await expect(getPostOnGroup(accessToken, groupId)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
});

describe('getListingBySeller', () => {
    const accessToken = 'your-access-token';
    const sellerEmail = 'seller@example.com';
    afterEach(() => {
        jest.resetAllMocks(); // reset all mock functions after each test
    });
    it('should get listings by seller successfully', async () => {
        const expectedResponse = ['listing1', 'listing2'];
        axios.get.mockResolvedValueOnce({ data: expectedResponse });

        const result = await getListingBySeller(accessToken, sellerEmail);
        expect(axios.get).toHaveBeenCalledTimes(1); // check that axios.get was called once
        expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/get_listing_by_seller/seller@example.com`, {
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
        await expect(getListingBySeller(accessToken, sellerEmail)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
});

describe('getListingBySellerOnGroup', () => {
    const accessToken = 'your-access-token';
    const sellerEmail = 'seller@example.com';
    const groupId = 'group-123';
    
    afterEach(() => {
        jest.resetAllMocks(); // reset all mock functions after each test
    });

    it('should get listing by seller on group successfully', async () => {
        const expectedResponse = ['listing1', 'listing2'];
        axios.get.mockResolvedValueOnce({ data: expectedResponse });

        const result = await getListingBySellerOnGroup(accessToken, sellerEmail, groupId);
        expect(axios.get).toHaveBeenCalledTimes(1); // check that axios.get was called once
        expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/get_listing_by_seller_on_group/group-123/seller@example.com`, {
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
        await expect(getListingBySellerOnGroup(accessToken, sellerEmail, groupId)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
});

describe('getListingOnGroup', () => {
    const accessToken = 'your-access-token';
    const groupId = 'group-123';
  
    afterEach(() => {
      jest.resetAllMocks(); // reset all mock functions after each test
    });
  
    it('should get listing on group successfully', async () => {
      const expectedResponse = ['listing1', 'listing2'];
      axios.get.mockResolvedValueOnce({ data: expectedResponse });
  
      const result = await getListingOnGroup(accessToken, groupId);
      expect(axios.get).toHaveBeenCalledTimes(1); // check that axios.get was called once
      expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/get_listing_on_group/group-123`, {
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
  
      await expect(getListingOnGroup(accessToken, groupId)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
});
describe('searchPostByDesc', () => {
    const accessToken = 'your-access-token';
    const urlbody = 'test-search';
    afterEach(() => {
      jest.resetAllMocks(); // reset all mock functions after each test
    });
  
    it('should return search results successfully', async () => {
      const expectedResponse = ['post1', 'post2'];
      axios.get.mockResolvedValueOnce({ data: expectedResponse });
  
      const result = await searchPostByDesc(accessToken, urlbody);
      expect(axios.get).toHaveBeenCalledTimes(1); // check that axios.get was called once
      expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/search_post_by_desc/test-search/`, {
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
      await expect(searchPostByDesc(accessToken, urlbody)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
});

describe('searchPostOnGroup', () => {
    const accessToken = 'your-access-token';
    const groupId = 'group-123';
    const urlbody = 'search-term';
    
    afterEach(() => {
      jest.resetAllMocks(); // reset all mock functions after each test
    });
    
    it('should search post on group successfully', async () => {
      const expectedResponse = ['post1', 'post2'];
      axios.get.mockResolvedValueOnce({ data: expectedResponse });
  
      const result = await searchPostOnGroup(accessToken, groupId, urlbody);
      
      expect(axios.get).toHaveBeenCalledTimes(1); // check that axios.get was called once
      expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/search_post_on_group/group-123/search-term/`, {
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
  
      await expect(searchPostOnGroup(accessToken, groupId, urlbody)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
});

describe('searchListingByName', () => {
    const accessToken = 'your-access-token';
    const urlbody = 'listing-123';
    afterEach(() => {
        jest.resetAllMocks(); // reset all mock functions after each test
      });
    it('should search listing by name successfully', async () => {
        const expectedResponse = ['listing1', 'listing2'];
        axios.get.mockResolvedValueOnce({ data: expectedResponse });

        const result = await searchListingByName(accessToken, urlbody);
        expect(axios.get).toHaveBeenCalledTimes(1); // check that axios.get was called once
        expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/search_listing_by_name/listing-123/`, {
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
        await expect(searchListingByName(accessToken, urlbody)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
});

describe('searchListingOnGroup', () => {
    const accessToken = 'your-access-token';
    const groupId = 'group-123';
    const urlBody = 'query';
  
    afterEach(() => {
      jest.resetAllMocks(); // reset all mock functions after each test
    });
  
    it('should search listing on group successfully', async () => {
      const expectedResponse = ['listing1', 'listing2'];
      axios.get.mockResolvedValueOnce({ data: expectedResponse });
  
      const result = await searchListingOnGroup(accessToken, groupId, urlBody);
      expect(axios.get).toHaveBeenCalledTimes(1); // check that axios.get was called once
      expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/search_listing_on_group/group-123/query/`, {
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
  
      await expect(searchListingOnGroup(accessToken, groupId, urlBody)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
});

describe('joinGroup', () => {
  const accessToken = 'your-access-token';

  afterEach(() => {
    jest.resetAllMocks(); // reset all mock functions after each test
  })

  it('should join group successfully', async () => {
    const expectedResponse = { message: 'Group joined'};
    axios.post.mockResolvedValueOnce({ data: expectedResponse });
    const body = {user: 'dickytest@test.com', id:'123'};
    const result = await joinGroup(accessToken, body);
    expect(axios.post).toHaveBeenCalledTimes(1); // check that axios.post was called once
    expect(axios.post).toHaveBeenCalledWith(`${baseUrl}/join_group`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }); // check that axios.post was called with the correct arguments
    expect(result).toEqual(expectedResponse);
  })

  it('should throw an error if the request fails', async () => {
    const expectedError = new Error('Request failed with status code 500');
    const body = {user: 'dickytest@test.com', id:'123'};
    expectedError.response = { data: { error: 'Request failed with status code 500' } };
    axios.post.mockRejectedValueOnce(expectedError);

    await expect(joinGroup(accessToken, body)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
  })
})

describe('searchGroup', () => {
    const accessToken = 'your-access-token';
    const urlbody = 'search-term';
    afterEach(() => {
        jest.resetAllMocks(); // reset all mock functions after each test
      });
    it('should search group successfully', async () => {
        const expectedResponse = ['group1', 'group2'];
        axios.get.mockResolvedValueOnce({ data: expectedResponse });

        const result = await searchGroup(accessToken, urlbody);
        expect(axios.get).toHaveBeenCalledTimes(1); // check that axios.get was called once
        expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/search_group/search-term`, {
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
        await expect(searchGroup(accessToken, urlbody)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
});

describe('seeGroup', () => {
    const accessToken = 'your-access-token';
    const groupId = 'group-123';
    afterEach(() => {
        jest.resetAllMocks(); // reset all mock functions after each test
      });
    it('should see group successfully', async () => {
        const expectedResponse = {group: 'group1'};
        axios.get.mockResolvedValueOnce({ data: expectedResponse });

        const result = await seeGroup(accessToken, groupId);
        expect(axios.get).toHaveBeenCalledTimes(1); // check that axios.get was called once
        expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/see_group/group-123`, {
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
        await expect(seeGroup(accessToken, groupId)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
});

describe('getAllCategoriesContains', () => {
    const accessToken = 'your-access-token';
    afterEach(() => {
        jest.resetAllMocks(); // reset all mock functions after each test
      });

    it('should get all categories successfully', async () => {
        const expectedResponse = ['category1', 'category2'];
        const urlBody = 'search-term';
        axios.get.mockResolvedValueOnce({ data: expectedResponse });

        const result = await getAllCategoriesContains(accessToken, urlBody);
        expect(axios.get).toHaveBeenCalledTimes(1); // check that axios.get was called once
        expect(axios.get).toHaveBeenCalledWith(`${baseUrl}/get_all_categories_contains/${urlBody}`, {
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
        await expect(getAllCategoriesContains(accessToken)).rejects.toThrow('Request failed with status code 500'); // check that the function throws the expected error
    });
})