"use strict";

const db = require("../db");
const {NotFoundError, BadRequestError } = require("../expressError");

/** Related functions for rating. */

class Rating {

  /** Add a rating.
   *
   * data should be { userId, mangaId, score }
   *
   * Returns { id, userId, mangaId, score }
   *
   * Throws BadRequestError if the user has already rated the manga.
   **/

  static async add({ userId, mangaId, score }) {
    if (
      typeof userId !== 'number' ||
      isNaN(parseInt(score)) ||
      userId === undefined ||
      mangaId === undefined
    ) {
      throw new BadRequestError("Invalid input data");
    }
  
    const duplicateCheck = await db.query(
      `SELECT id
       FROM rating
       WHERE user_id = $1 AND manga_id = $2`,
      [userId, mangaId]
    );
  
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`User has already rated this manga.`);
    }
  
    const result = await db.query(
      `INSERT INTO rating (user_id, manga_id, score)
       VALUES ($1, $2, $3)
       RETURNING id, user_id AS "userId", manga_id AS "mangaId", score`,
      [userId, mangaId, score]
    );
  
    const rating = result.rows[0];
  
    return rating;
  }
  
  /** Get all ratings for a manga.
   *
   * Returns [{ id, userId, mangaId, score }, ...]
   **/

  static async findAll(mangaId) {
    const result = await db.query(
      `SELECT rating.id, rating.user_id AS "userId", rating.manga_id AS "mangaId", rating.score, users.username
       FROM rating
       JOIN users ON rating.user_id = users.id
       WHERE rating.manga_id = $1::uuid`,
      [mangaId]
    );
  
    return result.rows;
  }
  
/** Delete given rating from database.*/
static async remove(user_id, manga_id) {
  console.log('Inside remove function');
  const result = await db.query(
    `DELETE FROM rating
     WHERE user_id = $1 AND manga_id = $2
     RETURNING id`,
    [user_id, manga_id]
  );
  const rating = result.rows[0];
  if (!rating) {
    throw new Error(`Cannot delete rating for user ${user_id} and manga ${manga_id}. Rating not found.`);
  }
}
}

module.exports = Rating;