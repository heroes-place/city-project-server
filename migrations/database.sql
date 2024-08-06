CREATE TABLE accounts (
    id SERIAL PRIMARY KEY NOT NULL,
    name varchar(50) NOT NULL UNIQUE,
    email_address varchar(50) NOT NULL UNIQUE,
    password varchar(60) NOT NULL,
    verification_code INTEGER DEFAULT 0,
    admin BOOLEAN DEFAULT FALSE,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE characters (
    id SERIAL PRIMARY KEY NOT NULL,
    name varchar(50) NOT NULL UNIQUE,
    account_id INTEGER,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE
);

CREATE TABLE invites (
    id SERIAL PRIMARY KEY NOT NULL,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    status INTEGER DEFAULT 0,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES characters (id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES characters (id) ON DELETE CASCADE
);

CREATE TABLE channels_categories (
	id SERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(255) NOT NULL,
	is_persistent BOOLEAN DEFAULT FALSE,
	min_members INTEGER DEFAULT 1,
	max_members INTEGER,
	creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE channels (
    id SERIAL PRIMARY KEY NOT NULL,
    category INTEGER NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category) REFERENCES channels_categories (id)
);

CREATE TABLE channels_members (
    id SERIAL PRIMARY KEY NOT NULL,
    channel_id INTEGER NOT NULL,
    character_id INTEGER NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES channels (id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE
);

CREATE TABLE villages (
    id SERIAL PRIMARY KEY NOT NULL,
    name varchar(20) NOT NULL UNIQUE,
    founder_id INTEGER NOT NULL,
    channel_id INTEGER NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (founder_id) REFERENCES characters (id),
    FOREIGN KEY (channel_id) REFERENCES channels (id)
);

CREATE TABLE villages_members (
    id SERIAL PRIMARY KEY NOT NULL,
    village_id INTEGER NOT NULL,
    character_id INTEGER NOT NULL,
    role INTEGER DEFAULT 0,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (village_id) REFERENCES villages (id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY NOT NULL,
    channel_id INTEGER NOT NULL,
    author INTEGER NOT NULL,
    content varchar(255) NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES channels (id),
    FOREIGN KEY (author) REFERENCES characters (id)
);

CREATE TABLE channels_whisper  (
    id SERIAL PRIMARY KEY NOT NULL,
    channel_id INTEGER NOT NULL,
    character_1 INTEGER NOT NULL,
    character_2 INTEGER NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES channels (id) ON DELETE CASCADE,
    FOREIGN KEY (character_1) REFERENCES characters (id) ON DELETE CASCADE,
    FOREIGN KEY (character_2) REFERENCES characters (id) ON DELETE CASCADE
);


/* Add some default data */
INSERT INTO channels_categories (name, is_persistent, min_members, max_members) VALUES ('world', TRUE, NULL, NULL);
INSERT INTO channels_categories (name, is_persistent, min_members, max_members) VALUES ('whisper', TRUE, 2, 2);
INSERT INTO channels_categories (name, is_persistent, min_members, max_members) VALUES ('party', FALSE, 2, 10);
INSERT INTO channels_categories (name, is_persistent, min_members, max_members) VALUES ('village', TRUE, 1, NULL);