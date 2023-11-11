# SyncTalk

## Table of Contents

- [SyncTalk](#synctalk)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
  - [Features](#features)
  - [Deployment Instructions](#deployment-instructions)
    - [Local Machines](#local-machines)
      - [Prerequisites](#prerequisites)
      - [Installation](#installation)
    - [Server](#server)
    - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## About

SyncTalk is a web application that allows users to upload audio, original text, and translations. It automatically aligns these components and presents the aligned content to help users learn a new language.

## Features

- **Audio and Text Upload**: Users can upload audio files, original text, and translations.

- **Automatic Alignment**: The platform automatically aligns audio with the corresponding text and translations.

- **Language Learning**: Users can listen to the audio while reading the original text and its translation, facilitating language learning.

## Deployment Instructions

### Local Machines

#### Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) installed
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) package manager

#### Installation

1. Clone the repository to your local machine:
   `git clone https://github.com/username/synctalk.git`
2. Navigate to the project directory:
   Unix: `cd frontend/synctalk`
   Windows: `cd frontend\synctalk`
3. Install dependencies:
   `npm install` or `yarn install`
4. Start the application:
   `npm start` or `yarn start`
5. Access the application in your web browser at http://localhost:3000.

### Server

The server is hosted on DigitalOcean at http://synctalk.tech.

### Usage

1. Go to the Upload page by clicking on the "Get Started" Button.
2. Upload an audio file, original text, and an optional translation.
3. Click on the "Generate" button.
4. Browse the aligned content, by scrolling through the page and clicking on the "Play" button and Speaker Icon to listen to the audio.

## Contributing

If you would like to contribute to this project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your fork.
5. Submit a pull request to the original repository.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
