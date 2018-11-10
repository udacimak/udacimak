FROM debian:latest

LABEL maintainer="udacimak <udacimak@tutanota.com>"

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# update the repository sources list
# and install dependencies
RUN apt-get update \
    && apt-get install -y curl python \
    && apt-get install -y git \
    && apt-get -y autoclean


# nvm environment variables
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 11.1.0

# install nvm
# https://github.com/creationix/nvm#install-script
RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash

# install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# hack to avoid mkdir permission denied with youtube-dl
# https://github.com/creationix/nvm/issues/1407
RUN npm config set user 0
RUN npm config set unsafe-perm true
# confirm installation
RUN node -v
RUN npm -v

# install Udacimak
RUN npm i -g udacimak
# confirm install
RUN udacimak --help

ENTRYPOINT [ "udacimak" ]
