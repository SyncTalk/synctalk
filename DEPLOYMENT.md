# Deployment

## Table of Contents

- [Deployment](#deployment)
  - [Table of Contents](#table-of-contents)
    - [Requirements](#requirements)
    - [Steps](#steps)

### Requirements

- [Docker](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/downloads)

### Steps

1. Open a terminal and change directory to the desired location for the repository to be cloned into

    ```bash
    cd <desired location>
    ```

2. Clone the repository into the current directory

    ```bash
    git clone https://github.com/SyncTalk/synctalk.git .
    ```

3. Build the Docker images

    ```bash
    docker build -t synctalk-web-server frontend/synctalk
    docker build -t synctalk-backend-server backend
    ```

4. Run the Docker images

    ```bash
    docker run -d -p 3000:80 synctalk-web-server
    docker run -d -p 8000:8000 synctalk-backend-server
    ```

5. Open the application in your browser

    ```bash
        http://localhost:3000
    ```
