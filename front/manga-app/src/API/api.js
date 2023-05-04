import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class MangaApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = {};
    
    if (MangaApi.token) {
      headers.Authorization = `Bearer ${MangaApi.token}`;
    }
    
    const params = (method === "get") ? data : {};

    try {
      const response = await axios({
        url,
        method,
        data,
        params,
        headers
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Individual API routes
  static async getAllTitles(page = 1, limit = 100, order = { rating: "desc" }, searchQuery = '') {
    try {
      const orderStr = `${Object.keys(order)[0]}:${order[Object.keys(order)[0]]}`;
      console.log(`Making request to API with page=${page}, limit=${limit}, order=${orderStr}, searchQuery=${searchQuery}`);
      const response = await axios.get(`${BASE_URL}/manga/titles`, {
        params: {
          page,
          limit,
          order: `${Object.keys(order)[0]}:${order[Object.keys(order)[0]]}`,
          searchQuery,
        },
      });
      console.log("Response:", response);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  static async getMangaById(mangaId) {
    try {
      const response = await axios.get(`${BASE_URL}/manga/${mangaId}`);
  
      const mangaData = response.data;
      console.log('mangaData from API:', mangaData)
      const manga = {
        id: mangaData.id,
        title: mangaData.title,
        description: mangaData.description,
        coverArt: mangaData.coverArt,
        authors: mangaData.authors,
        artists: mangaData.artists,
        genres: mangaData.genres,
        tags: mangaData.tags,
        status: mangaData.status,
        contentRating: mangaData.contentRating,
        lastUpdated: mangaData.updatedAt,
      };
  
      return manga;
    } catch (error) {
      throw error;
    }
  }
  
  static async login(data) {
    try {
      const response = await this.request(`auth/token`, data, "post");
      this.token = response.token;
      return this.token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

    /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

    /** Get token for login from username, password. */


    /** Save user profile page. */

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }
  
// Add a rating
static async addRating(token, mangaId, score, username) {
  try {
    const response = await this.request(`rating/${username}`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { mangaId, score },
    });
    return response.rating;
  } catch (err) {
    console.error('API Error:', err.response);
    let message = err.response.data.error.message;
    throw Array.isArray(message) ? message : [message];
  }
}




// Get all ratings for a manga
static async getRatingsForManga(mangaId) {
  try {
    const response = await this.request(`rating/${mangaId}`, {
      method: 'get',
    });
    return response.ratings;
  } catch (err) {
    console.error('API Error:', err.response);
    let message = err.response.data.error.message;
    throw Array.isArray(message) ? message : [message];
  }
}


// Remove a rating
static async removeRating(ratingId) {
  try {
    const response = await this.request(`rating/${ratingId}`, {
      method: 'delete',
    });
    return response.message;
  } catch (err) {
    console.error('API Error:', err.response);
    let message = err.response.data.error.message;
    throw Array.isArray(message) ? message : [message];
  }
}






};

export default MangaApi;