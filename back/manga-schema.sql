-- Manga table
CREATE TABLE manga (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    synopsis TEXT NOT NULL,
    cover_image_url TEXT NOT NULL,
    publication_date DATE NOT NULL
);

-- Author table
CREATE TABLE author (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

-- Manga-Author table
CREATE TABLE manga_author (
    id INTEGER PRIMARY KEY,
    manga_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    FOREIGN KEY (manga_id) REFERENCES manga(id),
    FOREIGN KEY (author_id) REFERENCES author(id)
);

-- User table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    registration_date DATE NOT NULL
);

-- Rating table
CREATE TABLE rating (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    manga_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (manga_id) REFERENCES manga(id)
);

-- Comment table
CREATE TABLE comment (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    manga_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (manga_id) REFERENCES manga(id)
);
