/*  media_type table. only have film and tv values so far */
CREATE TABLE media_type(
  media_type_id SERIAL PRIMARY KEY UNIQUE,
  medium TEXT NOT NULL
);

/* insert film and tv into media_type table */
INSERT INTO media_type(medium)
VALUES('film'),('tv');

/* create media_source table */
CREATE TABLE media_source(
    media_source_id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    source_type TEXT NOT NULL
);

/* insert into media_source table*/
INSERT INTO media_source(source_type)
VALUES('imdb'),('user');

/* create user_account table*/
CREATE TABLE user_account(
    user_account_ID SERIAL PRIMARY KEY UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL CHECK(LENGTH(username)>=4),
    password TEXT NOT NULL CHECK(LENGTH(password)>=4)
);

CREATE TABLE user_auth_token(
    user_account_id SERIAL UNIQUE  REFERENCES user_account(user_account_id),
    auth_token TEXT,
    PRIMARY KEY(user_account_id,auth_token)
);

/*create media table*/
CREATE TABLE media(
    media_id TEXT PRIMARY KEY NOT NULL UNIQUE,
    media_source_id SERIAL NOT NULL REFERENCES media_source(media_source_id),
    media_type_id SERIAL NOT NULL REFERENCES media_type(media_type_id),
    user_account_id SERIAL REFERENCES user_account(user_account_id),
    title TEXT NOT NULL,
    release_year SMALLINT,
    rating SMALLINT,
    media_length INT,
    media_tagline TEXT,
    media_language TEXT,
    synopsis TEXT,
    media_image TEXT,
    date_uploaded TIMESTAMPTZ,
    website TEXT,
    imdb TEXT,
    CHECK(NOT(media_source_id=2 AND user_account_id IS NULL)),
    CHECK(NOT(media_source_id=2 AND date_uploaded IS NULL))
);

CREATE TABLE user_favorite(
    user_account_id SERIAL NOT NULL REFERENCES user_account(user_account_id),
    media_id TEXT NOT NULL REFERENCES media(media_id) ON DELETE CASCADE,
    PRIMARY KEY(user_account_id,media_id)
);

CREATE TABLE user_seen(
    user_account_id SERIAL NOT NULL REFERENCES user_account(user_account_id),
    media_id TEXT NOT NULL REFERENCES media(media_id) ON DELETE CASCADE,
    date_seen DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY(user_account_id,media_id)
);

CREATE TABLE user_watch_next(
    user_account_id SERIAL NOT NULL REFERENCES user_account(user_account_id),
    media_id TEXT NOT NULL REFERENCES media(media_id) ON DELETE CASCADE,
    priority_level TEXT CHECK(priority_level IN ('low','medium','high')),
    PRIMARY KEY(user_account_id,media_id)
);

CREATE TABLE user_review(
    user_account_id SERIAL NOT NULL REFERENCES user_account(user_account_id),
    media_id TEXT  NOT NULL REFERENCES media(media_id) ON DELETE CASCADE,
    review TEXT NOT NULL,
    rating SMALLINT NOT NULL,
    PRIMARY KEY(media_id,user_account_id)
);