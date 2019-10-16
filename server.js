const express = require('express');
const server = express();

server.use(express.json());
server.use(express.urlencoded({extended: true}));

const projectObj = { id: "0", title: "Conceitos NodeJS", tasks: ['Aprender a utilização dos middlewares', 'Criar noções básicas sobre Rest APIs'] };

const projects = [projectObj];

server.post('/projects', checkProjectIsValid, (req, res) => {
    const project = req.body;

    projects.push(project);
    return res.status(200).json(projects);
});

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, checkTitleIsValid, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const proj = projects.find(proj => proj.id == id);
    proj.title = title;

    return res.status(200).json({message: 'Project updated'});
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;

    projects.splice(id, 1);

    return res.status(200).send({message: "Project deleted"});
});

server.post('/projects/:id/tasks', checkProjectExists ,checkTitleIsValid, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    const proj = projects.find(proj => proj.tasks.push(title));
    return res.status(200).json({message: "Task added"});
});

function checkTitleIsValid(req, res, next) {
    if (!(req.body.title)) {
        return res.status(400).json({error: "You must declare a Title"});
    }

    next();
};

function checkProjectIsValid(req, res, next) {
    if (!(req.body.id && req.body.title)) {
        return res.status(400).json({error: "Invalid project format"});
    }
    // console.log(req.body);
    next();
};

function checkProjectExists(req, res, next) {
    const checkProject = projects.find(checkProject => checkProject.id == req.params.id);
    if (!(checkProject)) {
        return res.status(400).json({message: "Project does not exist"});
    }
    next();
};

server.listen(3000, function(){
    console.log('\n[Server] Running on localhost:3000')
});