"use strict";
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

  /** Get all comments for a specific manga */
  static async getCommentsForManga(mangaId) {
    const result = await db.query(
      `SELECT c.id, c.user_id AS "userId", c.manga_id AS "mangaId", c.text, c.created_at AS "createdAt", u.username
           FROM comment c
          JOIN users u ON c.user_id = u.id
          WHERE c.manga_id = $1
          ORDER BY c.created_at DESC`,
      [mangaId]
    );
    return result.rows;
  }

  /** Update a comment */
  static async update(id, userId, updates) {
    const comment = await Comment.getById(id);
    if (comment.userId !== userId) {
      throw new NotFoundError(`User with id ${userId} has no permission to edit comment with id ${id}`);
    }
  
    // Modify the updates object to use the correct key "user_id" instead of "userId"
    if (updates.userId) {
      updates.user_id = updates.userId;
      delete updates.userId;
    }
  
    const { setCols, values } = sqlForPartialUpdate(updates, {});
    const idIdx = "$" + (values.length + 1);
  
    const querySql = `UPDATE comment
                          SET ${setCols}
                          WHERE id = ${idIdx}
                          RETURNING id, user_id AS "userId", manga_id AS "mangaId", text, created_at AS "createdAt"`;
    const result = await db.query(querySql, [...values, id]);
    const updatedComment = result.rows[0];
    if (!updatedComment) throw new NotFoundError(`No comment with id ${id}`);
    return updatedComment;
  }

  /** Delete a comment */
  static async delete(id, userId) {
    const comment = await Comment.getById(id);
    if (comment.userId !== userId) {
      throw new NotFoundError(`User with id ${userId} has no permission to delete comment with id ${id}`);
    }
  
    const result = await db.query(
      `DELETE FROM comment WHERE id = $1 RETURNING id`,
      [id]
    );
    const deletedComment = result.rows[0];
    if (!deletedComment) throw new NotFoundError(`No comment with id ${id}`);
  }
  
}

module.exports = Comment;
