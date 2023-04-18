const axios = require('axios');
const { NotFoundError} = require("../expressError");



class Manga {
static async getAllTitles(page = 1, limit = 20) {
    try {
      const response = await axios.get('https://api.mangadex.org/manga', {
        params: {
          includes: ['cover_art'],
          limit,
          offset: (page - 1) * limit
        }
      });

      const totalResults = response.data.total;
      const totalPages = Math.ceil(totalResults / limit);

      const mangaList = response.data.data.map(manga => ({
        id: manga.id,
        title: manga.attributes.title.en,
        coverArt: manga.attributes.coverArt,
      }));

      return {
        page,
        limit,
        totalPages,
        totalResults,
        data: mangaList
      };
    } catch (error) {
      throw error;
    }
}


 static async getMangaById(mangaId) {
    try {
      const response = await axios.get(`https://api.mangadex.org/manga/${mangaId}`, {
        params: {
          includes: ['cover_art', 'authors', 'artists', 'genres', 'tags'],
        }
      });

      const mangaData = response.data.data;
      if (!mangaData) throw new NotFoundError(`Manga with ID '${mangaId}' not found`);

      const manga = {
        id: mangaData.id,
        title: mangaData.attributes.title.en,
        description: mangaData.attributes.description.en,
        coverArt: mangaData.attributes.coverArt,
        authors: mangaData.relationships.authors.data.map(author => author.attributes.name),
        artists: mangaData.relationships.artists.data.map(artist => artist.attributes.name),
        genres: mangaData.relationships.genres.data.map(genre => genre.attributes.name.en),
        tags: mangaData.relationships.tags.data.map(tag => tag.attributes.name.en),
      };

      return manga;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Manga;
