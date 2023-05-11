# Manga-Capstone

Manga-Capstone is a user-friendly application that allows users to browse, rate, comment, and manage their favorite manga series.

## Table of Contents

- Features
- Installation and Setup
- Usage
- Components
- Disclaimer

## Features

- Browse manga titles with search and sorting functionality
- View detailed information about individual manga, including authors, artists, genres, tags, and status
- Rate and comment on your favorite manga
- Manage your favorite manga series in your account
- Responsive design for both desktop and mobile devices

## Installation and Setup

To install and run this application on your local machine, follow the steps below:

1. Clone the repository:

2. Install the required dependencies for both frontend and backend:

    - Navigate to the frontend directory and run npm install:

*Copy code*
`cd frontend`
`npm install`

    - Navigate to the backend directory and run npm install:

*Copy code*
`cd backend`
`npm install`

3. Set up the database:

    - Run the following commands in your terminal and PostgreSQL will create and configure the manga and manga_test databases:

 `psql < manga.sql`

4. Start the development servers for both frontend and backend:

    - In the frontend directory, run npm start:

*Copy code*
`cd frontend`
`npm start`

    - In the backend directory, run nodemon:

*Copy code*
`cd backend`
`nodemon`

5. Open your browser and visit http://localhost:3000 to view the application.

## Usage

To use the Manga application, you can either browse the manga list as a guest or create an account to access the full set of features.

- Guest Features
    - Browse manga titles
    - Search for specific manga
    - Sort manga titles by title, latest chapter, or rating
    - View detailed information about individual manga
- Registered User Features
    - All guest features
    - Rate and comment on your favorite manga
    - Manage your favorite manga series in your account

## Components

- MangaCard: 
    - Displays detailed information about a specific manga, including ratings and comments from users.
- MangaTitles: 
    - Displays a list of manga titles with pagination, search, and sorting functionality.
- Profile:
    - The Profile component displays the user's profile information, such as username, first name, last name, registration date, and a list of their favorite manga. 
    - Users can also edit their profile by clicking the "Edit Profile" button. 
    - The component fetches the user data and favorite manga data from the MangaApi, and it makes use of the UserContext to access the current user's information.

## *disclaimer*
- This application utilizes the https://api.mangadex.org/ to fetch manga data. More information about the API can be found at their website.
- All credit to MangaDex.
