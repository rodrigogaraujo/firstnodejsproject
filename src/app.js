const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // List all repositories
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // Create a new repository
  const {title, url, techs} = request.body;
  
  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // Update repository by ID
  const {id} = request.params;
 
  const repository = repositories.findIndex(repository => repository.id === id);

  const {title, url, techs} = request.body;

  if(repository < 0)
    return response.status(400).json({error: "Não encontramos " +
      "o repositório para o ID informado :/"});
  
  const newRepo = {
    id: repositories[repository].id,
    title: title,
    url: url,
    techs: techs,
    likes: repositories[repository].likes
  }

  repositories[repository] = newRepo;

  return response.json(newRepo);
});

app.delete("/repositories/:id", (request, response) => {
  // Remove repository by ID
  const id = request.params.id;
  const repository = repositories.findIndex(repository => repository.id === id);

  if(repository < 0)
    return response.status(400).json({error: "Não encontramos " +
      "o repositório para o ID informado :/"});
  
  repositories.splice(repository, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // Update like by ID
  const id = request.params.id;
  const repository = repositories.findIndex(repository => repository.id === id);

  if(repository < 0)
    return response.status(400).json({error: "Não encontramos " +
      "o repositório para o ID informado :/"});
      
  repositories[repository].likes += 1;

  return response.json(repositories[repository]);
});

module.exports = app;
