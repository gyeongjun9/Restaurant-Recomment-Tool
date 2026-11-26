FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0
COPY --chown=node:node package.json server.js engine.js demo.js stations.json index.html ui.js style.css ./
USER node
EXPOSE 3000
CMD ["node", "server.js"]