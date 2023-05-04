const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


class Comment {
  /** Create a comment */
  static async create(comment) {
    const result = await db.query(
      `INSERT INTO comment (user_id, manga_id, text, created_at)
           VALUES ($1, $2, $3, NOW())
           RETURNING id, user_id AS "userId", manga_id AS "mangaId", text, created_at AS "createdAt"`,
      [comment.userId, comment.mangaId, comment.text]
    );
    return result.rows[0];
  }

  /** Get all comments */
  static async getAll() {
    const result = await db.query(
      `SELECT id, user_id AS "userId", manga_id AS "mangaId", text, created_at AS "createdAt"
           FROM comment
           ORDER BY created_at DESC`
    );
    return result.rows;
  }

  /** Get a comment by id */
  static async getById(id) {
    const result = await db.query(
      `SELECT id, user_id AS "userId", manga_id AS "mangaId", text, created_at AS "createdAt"
           FROM comment
           WHERE id = $1`,
      [id]
    );
    const comment = result.rows[0];
    if (!comment) throw new NotFoundError(`No comment with id ${id}`);
    return comment;
  }

  /** Update a comment */
  static async update(id, updates) {
    const { setCols, values } = sqlForPartialUpdate(updates, {});
    const idIdx = "$" + (values.length + 1);

    const querySql = `UPDATE comment
                          SET ${setCols}
                          WHERE id = ${idIdx}
                          RETURNING id, user_id AS "userId", manga_id AS "mangaId", text, created_at AS "createdAt"`;
    const result = await db.query(querySql, [...values, id]);
    const comment = result.rows[0];
    if (!comment) throw new NotFoundError(`No comment with id ${id}`);
    return comment;
  }

  /** Delete a comment */
  static async delete(id) {
    const result = await db.query(
      `DELETE FROM comment WHERE id = $1 RETURNING id`,
      [id]
    );
    const comment = result.rows[0];
    if (!comment) throw new NotFoundError(`No comment with id ${id}`);
  }
}

module.exports = Comment;
