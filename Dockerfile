FROM node:4.4.7


# Install bower
RUN npm install -g bower


# Add an user.
RUN adduser --disabled-password --gecos '' store


# Copy source code.
ADD . /home/store/store/


# Copied code belongs to root, change owner as store.
RUN chown store:store -R /home/store/store/


# Switch user
USER store


# Install dependencies.
RUN cd /home/store/store/ && git clean -fdx && npm install --production && bower install


# Setup workign directory.
WORKDIR /home/store/store/
