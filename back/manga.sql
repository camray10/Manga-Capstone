\echo 'Delete and recreate manga db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE manga;
CREATE DATABASE manga;
\connect manga

\i manga-schema.sql

\echo 'Delete and recreate manga_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE manga_test;
CREATE DATABASE manga_test;
\connect manga_test

\i manga-schema.sql