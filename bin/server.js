const express = require('express');

const app = express();

app.use(express.json());

let projects = [];
let count = 0;

app.use((req, res, next) => {
  count += 1;
  console.log('Requisição de número: ', count);
  next();
});

app.post('/projects', (req, res) => {
  try {
    const { id, title } = req.body;
    if (id && title) {
      projects.push({
        id,
        title,
        tasks: []
      });
      res.json(projects);
    }
  } catch (error) {
    res.send('Não cadastrado, ocorreu um erro -> ', error);
  }
});

app.get('/projects', (req, res) => {
  try {
    if (projects && projects.length) {
      res.send(projects);
    } else {
      res.send('Não há projetos a serem exibidos no momento!');
    }
  } catch (error) {
    res.send('Ocorreu um erro -> ', error);
  }
});

function preventWithoutReqId(req, res, next) {
  const { id } = req.params;
  if (id && projects.findIndex(project => project.id === id) >= 0) {
    next();
  } else {
    res.send('Não foi possível encontrar um projeto com o id respectivo!');
  }
}

app.put('/projects/:id', preventWithoutReqId, (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (title) {
      const index = projects.findIndex(project => project.id === id);
      projects[index].title = title;
      res.json(projects);
    } else {
      res.send('Não foi possível encontrar um projeto com o id respectivo!');
    }
  } catch (error) {
    res.send('Ocorreu um erro -> ', error);
  }
});

app.delete('/projects/:id', preventWithoutReqId, (req, res) => {
  try {
    const { id } = req.params;
    const index = projects.findIndex(project => project.id === id);
    projects.splice(index, 1);
    res.send('Deletado com sucesso!');
  } catch (error) {
    res.send('Ocorreu um erro -> ', error);
  }
});

app.post('/projects/:id/tasks', preventWithoutReqId, (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (title) {
      const index = projects.findIndex(project => project.id === id);
      projects[index].tasks.push(title);
      res.send('Tarefa adicionada com sucesso!');
    }
  } catch (error) {
    res.send('Ocorreu um erro -> ', error);
  }
});

app.listen(3100);
