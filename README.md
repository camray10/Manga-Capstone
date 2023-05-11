# Manga-Capstone

Copy code
# Manga Reader App - README

Manga Reader is a user-friendly application that allows users to browse, rate, comment, and manage their favorite manga series.

## Table of Contents

- Features
- Installation and Setup
- Usage
- Components
- API
- Contributing
- License

## Features

- Browse manga titles with search and sorting functionality
- View detailed information about individual manga, including authors, artists, genres, tags, and status
- Rate and comment on your favorite manga
- Manage your favorite manga series in your account
- Responsive design for both desktop and mobile devices

## Installation and Setup

To install and run this application on your local machine, follow the steps below:

1. Clone the repository:
   
2. Navigate to the project directory and install the required dependencies:

bash
Copy code
cd manga
npm install

3. Start the development server:

bash
Copy code
npm start

4. Open your browser and visit http://localhost:3000 to view the application.

## Usage
- To use the Manga Reader application, you can either browse the manga list as a guest or create an account to access the full set of features.

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
MangaCard: Displays detailed information about a specific manga, including ratings and comments from users.
MangaTitles: Displays a list of manga titles with pagination, search, and sorting functionality.
Spinner: Displays a loading spinner when fetching data from the API.
API
This application utilizes the MangaApi to fetch manga data. More information about the API can be found in the API/api.js file.

Contributing
We welcome contributions to improve the Manga Reader app. If you'd like to contribute, please fork the repository, create a new branch with your changes, and submit a pull request.
https://api.mangadex.org/docs/