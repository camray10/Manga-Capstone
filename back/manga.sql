\echo 'Delete and recreate manga db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE manga;
CREATE DATABASE manga;
\connect manga

\i manga-schema.sql
