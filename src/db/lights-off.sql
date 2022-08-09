/*  media_type table. only have film and tv values so far */
CREATE TABLE media_type(
  media_type_id SERIAL PRIMARY KEY UNIQUE,
  medium TEXT NOT NULL
);

/* insert film and tv into media_type table */
INSERT INTO media_type(medium)
VALUES('film'),('tv');

/* how to add a constraint to a table */
ALTER TABLE user_account
ADD CONSTRAINT unique_user_account_id UNIQUE (user_account_id)

/*user upload table */
CREATE TABLE upload(
    upload_id SERIAL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES user_account(user_account_id),
    media_type_id SMALLINT NOT NULL REFERENCES media_type(media_type_id),
    title TEXT NOT NULL,
    rating SMALLINT,
    media_length REAL,
    media_language TEXT,
    synopsis TEXT,
    release_year SMALLINT NOT NULL,
    image TEXT,
    date_added TIMESTAMP,
    website TEXT,
    imdb TEXT
)

/* imdb content table */
CREATE TABLE imdb (
    imdb_id TEXT PRIMARY KEY UNIQUE NOT NULL,
    media_type SMALLINT REFERENCES media_type(media_type_id) NOT NULL,
    release_year SMALLINT,
    title TEXT NOT NULL,
    rating REAL,
    image TEXT
)

/* imdb content that user has added to their favorite list*/
CREATE TABLE user_imdbfavorite(
    user_id SERIAL REFERENCES user_account(user_account_id) NOT NULL,
    imdb_id TEXT REFERENCES imdb(imdb_id) NOT NULL
)

/* imdb content that user has added to their seen list*/
CREATE TABLE user_imdbseen(
    user_id SERIAL REFERENCES user_account(user_account_id) NOT NULL,
    imdb_id TEXT REFERENCES imdb(imdb_id) NOT NULL,
    date_seen DATE NOT NULL DEFAULT CURRENT_DATE
)

/* user upload's that they have added to their favorite list*/
CREATE TABLE user_uploadfavorite(
    user_id SERIAL REFERENCES user_account(user_account_id) NOT NULL,
    upload_id SERIAL REFERENCES upload(upload_id) NOT NULL
)

/* user upload's that they have added to their seen list*/
CREATE TABLE user_uploadseen(
    user_id SERIAL REFERENCES user_account(user_account_id) NOT NULL,
    upload_id SERIAL REFERENCES upload(upload_id) NOT NULL,
    date_seen DATE NOT NULL DEFAULT CURRENT_DATE
)

/*media from imdb user has added to their watch next list*/
CREATE TABLE user_imdb_next(
    user_id SERIAL REFERENCES user_account(user_account_id) NOT NULL,
    imdb_id TEXT REFERENCES imdb(imdb_id) NOT NULL,
    priority TEXT CHECK(priority IN ('low','medium','high'))
)
/*media from user's upload that they have added to their watch next list*/
CREATE TABLE user_upload_next(
    user_id SERIAL REFERENCES user_account(user_account_id) NOT NULL,
    upload_id SERIAL REFERENCES upload(upload_id) NOT NULL,
    priority TEXT CHECK(priority IN ('low','medium','high'))
)