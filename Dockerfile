# Base image
FROM node:20-alpine as base

# Set the working directory inside the container
WORKDIR /home/node/app

# Set Workdir
RUN chown -R node:node /home/node/app

# Install dependencies as the node user
USER node


# Copy all (exclude by .dockerignore) to /home/node/app
COPY . .

# Install all dependencies
RUN npm install

# * 
# * ============= Dev Image Setup =============
# * 
FROM base as development
RUN npm install -g nodemon

# # Set Non Root User
# USER node

# Set permissions to node:node
COPY --chown=node:node . .

# * 
# * ============= Prod Image Setup =============
# * 
FROM base as production
RUN npm install -g pm2


# # Set Non Root User
# USER node

# Set permissions to node:node
COPY --chown=node:node . .

# Start single instances using pm2
CMD ["pm2-runtime", "./server.js"]