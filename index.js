const express = require("express");

const server = express();
server.use(express.json());

const projects = [
  {
    id: "1",
    title: "Novo projeto",
    tasks: ["Nova tarefa"]
  }
];

//middlewares
function checkProjectExists(req, res, next) {
  if (!req.body.id) {
    return res.status(400).json({ error: "Project ID required" });
  }

  return next();
}

function checkProjectInArray(req, res, next) {
  const project = projects[req.params.id];

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  req.project = project;

  return next();
}

var count = 0;
function countRequires(req, res, next) {
  console.log("Número de requisiçoes feitas: "+ ++count);
  return next();
}

server.use(countRequires);

//lista projetos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//lista 1 projeto
server.get("/projects/:id", checkProjectInArray, (req, res) => {
  return res.json(req.project); //project vem do middleware checkProjectInArray
});

//criar projeto
server.post("/projects", checkProjectExists, (req, res) => {
  //const {id,title,tasks} = req.body;
  const project = ({ id, title, tasks } = req.body);

  projects.push(project);
  return res.json(projects);
});

//criar tarefa
server.post("/projects/:id/tasks", checkProjectInArray, (req, res) => {
  const { id } = req.params;

  projects[id].tasks.push(req.body.title);

  return res.json(projects);
});

//deletar tarefa
server.delete("/projects/:id/tasks/:index", checkProjectInArray, (req, res) => {
  const { id, index } = req.params;

  projects[id].tasks.splice(index, 1);
  return res.send();
});

//edita projeto
server.put(
  "/projects/:id",
  checkProjectExists,
  checkProjectInArray,
  (req, res) => {
    const { id } = req.params;
    const { title, tasks } = req.body;

    projects[id] = { id, title, tasks };

    return res.json(projects);
  }
);

//deletar projeto
server.delete(
  "/projects/:id",
  checkProjectInArray,
  (req, res) => {
    const { id } = req.params;
    projects.splice(id, 1);
    return res.send();
  }
);

server.listen(3000);
