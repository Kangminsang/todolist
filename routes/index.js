const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');


/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        const tasks = await taskService.getAllTasksByCreatedAt();
        res.render('index', { title: 'TODO List', tasks: tasks });
    } catch (error) {
        next(error);
    }
});

// 새 할 일 작성 페이지
router.get('/tasks/new', function (req, res, next) {
    res.render('task_form', { title: '할 일 작성' });
});

// 할 일 생성 처리
router.post('/tasks', async function (req, res, next) {
    try {
        const { title, dueDate } = req.body;
        await taskService.createTask({ title, dueDate });
        res.redirect('/');
    } catch (error) {
        next(error);
    }
})

router.get('/tasks/:id/edit', async function(req, res, next) {
    try {
        const task = await taskService.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).send('해당 할 일을 찾을 수 없습니다.');
        }
        res.render('task_form', { title: '할 일 수정', task: task });
    } catch (err) {
        next(err);
    }
});

router.post('/tasks/:id/update', async function(req, res, next) {
    try {
        const { title, dueDate, completed } = req.body;
        const updatedTask = {
            title: title,
            dueDate: dueDate || null,
            completed: completed === 'on'
        };
        await taskService.updateTask(req.params.id, updatedTask);
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

router.post('/tasks/:id/toggle', async function(req, res, next) {
    try {
        const task = await taskService.getTaskById(req.params.id);
        if (task) {
            await taskService.updateTask(req.params.id, { completed: !task.completed });
        }
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

router.post('/tasks/:id/delete', async function(req, res, next) {
    try {
        await taskService.deleteTask(req.params.id);
        res.redirect('/');
    } catch (err) {
        next(err);
    }
})

module.exports = router;
