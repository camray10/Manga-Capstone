const axios = require('axios');
const { NotFoundError} = require("../expressError");



/**
 * Class representing a manga and methods for interacting with the MangaDex API.
 */
class Manga {

  /**
   * Retrieves a list of manga titles from the MangaDex API.
   * @param {number} [page=1] - The page number to retrieve (default is 1).
   * @param {number} [limit=100] - The number of results to retrieve per page (default is 100).
   * @param {Object} [order={ rating: "desc" }] - The order in which to sort the results (default is by rating in descending order).
   * @param {Object} [searchQuery=''] - The search query to filter the results by (default is an empty string).
   * @returns {Object} An object containing the list of manga titles, along with pagination information.
   * @throws {Error} If there's an error retrieving data from the API.
   */
  static async getAllTitles(page = 1, limit = 100, order = { rating: "desc" }, searchQuery = '') {
    try {
      const orderStr = `${Object.keys(order)[0]}:${order[Object.keys(order)[0]]}`;
      console.log(`Making request to API with page=${page}, limit=${limit}, order=${orderStr}, searchQuery=${searchQuery}`);

      // Calculate the offset value based on the page number and limit
      const offset = (page - 1) * limit;
      console.log(`Offset value: ${offset}`);
      
      // Define the API request parameters
      const params = {
        includes: ['cover_art'],
        limit,
        offset,
        order,
      };

      // Add the search query to the request parameters if it's not empty
      if (searchQuery) {
        params['title'] = searchQuery;
      }

      // Make the API request to retrieve the list of manga titles
      const response = await axios.get('https://api.mangadex.org/manga', {
        params
      });

      console.log('Response received from API:', response.data);

      const totalResults = response.data.total;
      const totalPages = Math.ceil(totalResults / limit);
      console.log(`Total pages: ${totalPages}`);

      // Process the API response data to create a list of manga titles
      const mangaList = response.data.data.map(manga => ({
        id: manga.id,
        title: manga.attributes.title.en || '',
        coverArt: `https://uploads.mangadex.org/covers/${manga.id}/${manga.relationships.find(rel => rel.type === 'cover_art').attributes.fileName}`,
        updatedAt: manga.attributes.updatedAt,
        followedCount: manga.attributes.followedCount,
        relevance: manga.attributes.relevance,
        rating: manga.attributes.rating,
        latestUploadedChapter: manga.attributes.latestChapter ? manga.attributes.latestChapter.chapter : null,
        createdAt: manga.attributes.createdAt
      }));

      return {
        page,
        limit,
        totalPages,
        totalResults,
        data: mangaList
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


    

  static async getMangaById(mangaId) {
    try {
      console.log(`Fetching manga with ID: ${mangaId}`);
      const response = await axios.get(`https://api.mangadex.org/manga/${mangaId}`, {
        params: {
          includes: ['cover_art', 'author', 'artist', 'genre', 'tag'],
        },
      });
  
      const mangaData = response.data.data;
      console.log("Manga data received:", mangaData);
  
      const relationships = mangaData.relationships.reduce((acc, rel) => {
        if (!acc[rel.type]) {
          acc[rel.type] = [];
        }
        acc[rel.type].push(rel);
        return acc;
      }, {});
  
      console.log("Processed relationships:", relationships);
  
      if (!mangaData) throw new NotFoundError(`Manga with ID '${mangaId}' not found`);
  
      console.log("Manga attributes:", mangaData.attributes);

      const manga = {
        id: mangaData.id,
        title: mangaData.attributes.title,
        description: mangaData.attributes.description,
        coverArt: `https://uploads.mangadex.org/covers/${mangaData.id}/${relationships['cover_art'][0].attributes.fileName}`,
        authors: relationships['author'] ? relationships['author'].map((author) => author.attributes.name) : [],
        artists: relationships['artist'] ? relationships['artist'].map((artist) => artist.attributes.name) : [],
        genres: relationships['genre'] ? relationships['genre'].map((genre) => genre.attributes.name) : [],
        tags: relationships['tag'] ? relationships['tag'].map((tag) => tag.attributes.name) : [],
        status: mangaData.attributes.status,
        contentRating: mangaData.attributes.contentRating,
        lastUpdated: mangaData.attributes.updatedAt,
      };
  
      return manga;
    } catch (error) {
      throw error;
    }
  }
  
  
}

module.exports = Manga;