const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function repositoryExists(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }
  request.repository = repository;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", repositoryExists, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body

  title? repository.title = title : null;
  url? repository.url = url : null;
  techs? repository.techs = techs : null;
  
  
  repositories.push(repository);

  return response.status(201).json(repository);
});

app.delete("/repositories/:id",repositoryExists,  (request, response) => {
  const { repository } = request;

  const index = repositories.indexOf(repository);
  repositories.splice(index, 1);
  
  return response.status(204).json(repository);
});

app.post("/repositories/:id/like",repositoryExists, (request, response) => {
  const {repository} = request;

  repository.likes = repository.likes + 1;
  repositories.push(repository);

  return response.json(repository);
});

module.exports = app;
