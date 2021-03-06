CREATE TABLE user (
  user_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  confirmed TINYINT DEFAULT 0 NOT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE task (
  task_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
  description VARCHAR(255) NOT NULL,
  completed TINYINT DEFAULT 0 NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (task_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE habit (
  habit_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
  description VARCHAR(255) NOT NULL,
  schedule SET('MON','TUE','WED','THU','FRI','SAT','SUN') NOT NULL,
  completions INT UNSIGNED DEFAULT 0 NOT NULL,
  daily DATETIME DEFAULT NULL,
  user_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (habit_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE event (
  event_id INT UNSIGNED AUTO_INCREMENT NOT NULL,
  description VARCHAR(255) NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (event_id),
  FOREIGN KEY (user_id) REFERENCES user(user_id)
);