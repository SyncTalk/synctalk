# Deployment

## Table of Contents

- [Deployment](#deployment)
  - [Table of Contents](#table-of-contents)
    - [Local Machine](#local-machine)
      - [Requirements](#requirements)
      - [Steps](#steps)
    - [Production Server](#production-server)
      - [Requirements](#requirements-1)
      - [Steps](#steps-1)

### Local Machine

#### Requirements

- [Docker](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/downloads)

#### Steps

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

5. Open a browser and navigate to the following URL to view the application

    <http://localhost:3000>

### Production Server

#### Requirements

- [Docker](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/downloads)

#### Steps

1. Open a terminal and SSH into the server

    ```bash
    ssh <username>@<server ip>
    ```

2. Change directory to the desired location for the repository to be cloned into

    ```bash
    cd <desired location>
    ```

3. Clone the repository into the current directory

    ```bash
    git clone https://github.com/SyncTalk/synctalk.git .
    ```

4. Build the Docker images

    ```bash
    docker build -t synctalk-web-server frontend/synctalk
    docker build -t synctalk-backend-server backend
    ```

5. Run the Docker images

    ```bash
    docker run -d -p 80:80 synctalk-web-server
    docker run -d -p 8000:8000 synctalk-backend-server
    ```

6. Open a browser and navigate to the following URL to view the application

    http://\<server ip\>
