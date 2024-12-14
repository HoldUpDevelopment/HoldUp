# HoldUp: Empowering Climbing Gyms and Communities

Welcome to **HoldUp**, a full-stack platform designed to revolutionize the online community experience for commercial rock climbing gyms. HoldUp offers a range of tools that enable gyms to foster engaging and supportive online environments. Features include route management, route feedback, route archival, and community engagement, all designed to elevate the gym-to-climber connection.

## Table of Contents

- [HoldUp: Empowering Climbing Gyms and Communities](#holdup-empowering-climbing-gyms-and-communities)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Usage](#usage)
  - [Database Structure](#database-structure)
    - [User Table](#user-table)
    - [Route Table](#route-table)
    - [Forum Table](#forum-table)
    - [Example Data](#example-data)
  - [License](#license)

## Overview

HoldUp connects climbers with their local gyms by providing a robust online platform. Climbers can offer feedback on routes, discuss climbing techniques in forums, and stay informed about new challenges. Gym owners and route setters can manage and archive routes, ensuring the gym remains dynamic and challenging for everyone.

## Features

- **Route Feedback**: Users can rate and leave comments on routes they've climbed.
- **Route Management**: Gyms can create, update, and manage climbing routes with ease.
- **Route Archival**: Archive older routes and retain them for future reference or bring them back with ease.
- **Community Engagement**: A forum system to foster discussions, provide feedback, and share experiences among climbers and staff.
- **Notifications**: Keep the community updated with new routes, events, or changes in gym operations.

## Tech Stack

HoldUp is built using the following technologies: (*Not Accurate ATM*)

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT-based authentication with Passport.js
- **Deployment**: Docker, Kubernetes, Nginx

## Installation

To run this project locally, follow these steps:

### Prerequisites

- Node.js (>=16.x)
- Docker (optional but recommended for containerized deployment)
- MySQL

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/HoldUpDevelopment/HoldUp.git
    cd HoldUp
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Setup environment variables:
    - Duplicate `.env.example` and rename it to `.env`
    - Fill in the necessary environment variables (e.g., database credentials, JWT secret)

4. Initialize the database:
    ```bash
    npx sequelize db:migrate
    ```

5. Start the development server:
    ```bash
    npm run dev
    ```

6. Optionally, build and run with Docker:
    ```bash
    docker-compose up --build
    ```

## Usage

Once the development server is up and running, you can access the app at `http://localhost:3000`. This will take you to the HoldUp platform, where you can explore the following functionalities:

- **Climber Dashboard**: Track routes, provide feedback, and engage with the gym community.
- **Route Management**: Gym owners can create, update, and archive routes via an intuitive admin dashboard.
- **Forum**: Participate in discussions and share experiences with fellow climbers.

## Database Structure

The database for HoldUp is based on **MySQL**, with multiple interconnected tables to handle various aspects of user interactions, route data, and forum posts.

### User Table

The `users` table stores essential data about gym users and staff.

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role ENUM('climber', 'admin', 'setter') DEFAULT 'climber',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Route Table

The `routes` table tracks all the climbing routes available in the gym, including metadata like difficulty, type, and setters.

```sql
CREATE TABLE routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(10),  -- Example: '5.12a', 'V5'
    type ENUM('boulder', 'sport', 'toprope'),
    setter_id INT,
    feedback_score FLOAT DEFAULT 0,  -- Average user feedback score
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (setter_id) REFERENCES users(id)
);
```

### Forum Table

The `forum_posts` table stores user interactions within the forums, allowing community discussions.

```sql
CREATE TABLE forum_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    route_id INT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);
```

### Example Data

```sql
-- Example User
INSERT INTO users (username, email, password_hash, role) 
VALUES ('johndoe', 'johndoe@example.com', 'hashed_password', 'climber');

-- Example Route
INSERT INTO routes (name, grade, type, setter_id, feedback_score) 
VALUES ('Skyfall', '5.11b', 'sport', 1, 4.8);

-- Example Forum Post
INSERT INTO forum_posts (user_id, route_id, content) 
VALUES (1, 1, 'Skyfall was a fantastic challenge! The crux was intense.');
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
