// Sample database "starport", used by SQL Module 1.
// It's plain SQL: CREATE TABLE makes an empty table, INSERT INTO adds rows.
// A FRESH copy is built every time you press Run, so you can never break it.

CodeLab.addDatabase("starport", `
-- Movies (SQLBolt also uses a movies table, so the lessons match nicely)
CREATE TABLE movies (
  id INTEGER PRIMARY KEY,
  title TEXT,
  director TEXT,
  year INTEGER,
  length_minutes INTEGER,
  genre TEXT
);
INSERT INTO movies VALUES
  (1,  'Star Wars: A New Hope',   'George Lucas',      1977, 121, 'Sci-Fi'),
  (2,  'The Empire Strikes Back', 'Irvin Kershner',    1980, 124, 'Sci-Fi'),
  (3,  'Tron',                    'Steven Lisberger',  1982,  96, 'Sci-Fi'),
  (4,  'Return of the Jedi',      'Richard Marquand',  1983, 131, 'Sci-Fi'),
  (5,  'Back to the Future',      'Robert Zemeckis',   1985, 116, 'Adventure'),
  (6,  'Jurassic Park',           'Steven Spielberg',  1993, 127, 'Adventure'),
  (7,  'Toy Story',               'John Lasseter',     1995,  81, 'Animation'),
  (8,  'The Matrix',              'The Wachowskis',    1999, 136, 'Action'),
  (9,  'Spirited Away',           'Hayao Miyazaki',    2001, 125, 'Animation'),
  (10, 'Inception',               'Christopher Nolan', 2010, 148, 'Action'),
  (11, 'Wreck-It Ralph',          'Rich Moore',        2012, 101, 'Animation'),
  (12, 'Interstellar',            'Christopher Nolan', 2014, 169, 'Sci-Fi'),
  (13, 'Rogue One',               'Gareth Edwards',    2016, 133, 'Sci-Fi'),
  (14, 'Ready Player One',        'Steven Spielberg',  2018, 140, 'Adventure'),
  (15, 'Dune',                    'Denis Villeneuve',  2021, 155, 'Sci-Fi');

-- Galaxy Travel Co. bookings (made-up customers, real cities)
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY,
  traveler TEXT,
  destination TEXT,
  country TEXT,
  nights INTEGER,
  price_usd INTEGER,
  booked_on TEXT
);
INSERT INTO bookings VALUES
  (1,  'Ana Souza',   'Lisbon',         'Portugal',     4,  780, '2026-01-14'),
  (2,  'Leo Park',    'Tokyo',          'Japan',        7, 2150, '2026-02-03'),
  (3,  'Mia Chen',    'Reykjavik',      'Iceland',      3,  990, '2026-02-20'),
  (4,  'Omar Haddad', 'Cairo',          'Egypt',        5,  640, '2026-03-08'),
  (5,  'Sofia Rossi', 'New York',       'USA',          6, 1890, '2026-03-15'),
  (6,  'Jack Miller', 'Rio de Janeiro', 'Brazil',       8, 1320, '2026-04-02'),
  (7,  'Yuki Tanaka', 'Paris',          'France',       4, 1100, '2026-04-21'),
  (8,  'Lucas Silva', 'Cape Town',      'South Africa', 10, 1750, '2026-05-09'),
  (9,  'Emma Brown',  'Kyoto',          'Japan',        3,  870, '2026-05-30'),
  (10, 'Noah Kim',    'Lisbon',         'Portugal',     2,  410, '2026-06-11');
`);
