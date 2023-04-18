-- Manga table
CREATE TABLE manga (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    synopsis TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    publication_date DATE NOT NULL
);

-- Author table
CREATE TABLE author (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- Manga-Author table
CREATE TABLE manga_author (
    id SERIAL PRIMARY KEY,
    manga_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    FOREIGN KEY (manga_id) REFERENCES manga(id),
    FOREIGN KEY (author_id) REFERENCES author(id)
);

-- User table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    registration_date DATE NOT NULL
);

-- Rating table
CREATE TABLE rating (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    manga_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (manga_id) REFERENCES manga(id)
);

-- Comment table
CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    manga_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (manga_id) REFERENCES manga(id)
);
