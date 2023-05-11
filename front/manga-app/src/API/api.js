import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class MangaApi {
    static token;

    static async request(endpoint, data = {}, method = "get", token = null) {
        console.debug("API Call:", endpoint, data, method);

        const url = `${BASE_URL}/${endpoint}`;
        const headers = {};

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        } else if (MangaApi.token) {
            headers.Authorization = `Bearer ${MangaApi.token}`;
        }

        const params = (method === "get") ? data : {};

        try {
            const response = await axios({
                url,
                method: method,
                data: (method === "get") ? {} : data,
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

    // Get all manga titles
    static async getAllTitles(page = 1, limit = 100, order = {
        rating: "desc"
    }, searchQuery = '') {
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

    // Get manga information based on mangaId
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

    // Get token for login from username, password
    static async login(data) {
        try {
            const response = await this.request(`auth/token`, data, "post");
            this.token = response.token;
            const user = await this.getCurrentUser(data.username);
            console.log("Logged-in user:", user);
            return {
                token: this.token,
                user
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // Signup for site
    static async signup(data) {
        try {
            const res = await this.request(`auth/register`, data, "post");
            this.token = res.token;
            const user = await this.getCurrentUser(data.username);
            return {
                token: this.token,
                user
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // Get current user info
    static async getCurrentUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    // Save user profile page
    static async saveProfile(username, data) {
        let res = await this.request(`users/${username}`, data, "patch");
        return res.user;
    }

    // Add a rating
    static async addRating(token, userId, mangaId, score) {
        try {
            console.log('Token:', token); // Add this line
            console.log('UserId:', userId); // Add this line
            const response = await this.request(
                `rating`, {
                    userId: userId,
                    mangaId: mangaId,
                    score: score
                },
                "post",
                token // Pass the token to the request method
            );
            return response.rating;
        } catch (err) {
            console.error('API Errorrr:', err.response);
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
    static async removeRating(userId, mangaId) {
        try {
            console.log('Before request');
            console.log('userId:', userId);
            console.log('mangaId:', mangaId);
            const response = await this.request(`rating/user/${userId}/manga/${mangaId}`, {}, 'delete');
            console.log('After request');
            return response.message;
        } catch (err) {
            console.error('API Error:', err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Create a comment
    static async createComment(token, userId, mangaId, text) {
        try {
            const response = await this.request(
                `comment`, {
                    userId: userId,
                    mangaId: mangaId,
                    text: text
                },
                "post",
                token
            );
            return response;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Update a comment
    static async updateComment(token, commentId, userId, text) {
        try {
            const response = await this.request(
                `comment/${commentId}`, {
                    userId: userId,
                    text: text
                },
                "patch",
                token
            );
            return response;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Delete a comment
    static async deleteComment(token, commentId, userId) {
        try {
            const response = await this.request(
                `comment/${commentId}`, {
                    userId: userId
                },
                "delete",
                token
            );
            return response.message;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Get comments for a specific manga
    static async getCommentsForManga(mangaId) {
        try {
            const response = await axios.get(`${BASE_URL}/comment/${mangaId}/comments`);
            // Include the username in the comment object
            const comments = response.data.map(comment => {
                return {
                    ...comment,
                    username: comment.username
                };
            });
            return comments;
        } catch (error) {
            console.error(`Failed to get comments for manga with id ${mangaId}:`, error);
            throw error;
        }
    }

    // Add a favorite
    static async addFavorite(userId, mangaId) {
        try {
            const response = await this.request('favorites', { userId, mangaId }, 'POST');
                return response.data;
                    } catch (error) {
            let message = error.response?.data?.error?.message || 'Failed to add to favorites.';
                throw Array.isArray(message) ? message : [message];
        }
    }

    // Remove a favorite
    static async removeFavorite(token, userId, mangaId) {
        try {
            const response = await this.request(
            `favorites/${userId}/${mangaId}`,
            {}, "delete",token);
        return response.message;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Get all favorites for a specific user
    static async getFavoritesForUser(userId) {
        try {
            const response = await this.request(`favorites/${userId}/favorites`);
        return response;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }
};

export default MangaApi;