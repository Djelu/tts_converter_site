FROM node:19-alpine

COPY package.json /app/package.json
COPY .. ./
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

#COPY app/package.json /app/package.json
#COPY app/package-lock.json /app/package-lock.json
RUN cd /app && npm install --silent
RUN cd /app && npm install react-scripts@3.4.1 -g --silent
#COPY . /app/

CMD ["npm", "start", "-p", "0.0.0.0:3000"]