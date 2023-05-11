"use strict";
const db = require("../db");
const { NotFoundError,BadRequestError } = require("../expressError");

class Favorites {
    
  static async add({ userId, mangaId }) {
    if (!userId || !mangaId) {
       throw new BadRequestError('Invalid input data');
     }      
    const duplicateCheck = await db.query(
      `SELECT id
       FROM favorites
        WHERE user_id = $1 AND manga_id = $2`,
       [userId, mangaId]
     );  
     if (duplicateCheck.rows[0]) {
       throw new BadRequestError('User has already favorited this manga.');
    }   
    const result = await db.query(
      `INSERT INTO favorites (user_id, manga_id)
       VALUES ($1, $2)
       RETURNING id, user_id AS "userId", manga_id AS "mangaId", created_at AS "createdAt"`,
          [userId, mangaId]
        ); 

        const favorite = result.rows[0];

        return favorite;
      }      
      
  static async remove(userId, mangaId) {
    const result = await db.query(
      `DELETE FROM favorites
       WHERE user_id = $1 AND manga_id = $2
       RETURNING id`,
      [userId, mangaId]
    );

    const favorite = result.rows[0];
    if (!favorite) {
      throw new NotFoundError(`Cannot delete favorite for user ${userId} and manga ${mangaId}. Favorite not found.`);
    }
  }

  static async findAll(userId) {
    const result = await db.query(
      `SELECT f.id, f.user_id AS "userId", f.manga_id AS "mangaId"
       FROM favorites AS f
       WHERE f.user_id = $1`,
      [userId]
    );
  
    return result.rows;
  }
  
}

module.exports = Favorites;
