const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')

const tasksPath = path.join(__dirname, '..', 'data', 'tasks.json')

async function readTasks() {
    try {
        const data = await fs.readFile(tasksPath, 'utf-8');

        // 파일이 비었거나 공백만 있으면 빈 배열 반환
        if (!data || data.trim() === '') {
            return [];
        }
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // 파일이 없을 때에도 빈 배열을 반환하게 함
            return[];
        }
        throw error;
    }

}

async function writeTasks(tasks) {
    await fs.writeFile(tasksPath, JSON.stringify(tasks, null, 2));
}

async function getAllTasksByCreatedAt() {
    const tasks = await readTasks();
    return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function getTaskById(id) {
    const tasks = await readTasks();
    return tasks.find(task => task.id === id);
}

async function createTask(taskData) {
    const tasks = await readTasks();
    const newTask = {
        id: crypto.randomUUID(),
        title: taskData.title,
        dueDate: taskData.dueDate || null,
        completed: false,
        createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    await writeTasks(tasks);
    return newTask;
}

async function updateTask(id, taskData) {
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        throw new Error('Task not found');
    }
    const updatedTask = {...tasks[taskIndex], ...taskData };
    tasks[taskIndex] = updatedTask;
    await writeTasks(tasks);
    return updatedTask;
}

async function deleteTask(id) {
    let tasks = await readTasks();
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    if (tasks.length === initialLength) {
        return false
    }
    await writeTasks(tasks);
    return true;
}

module.exports = {
    getAllTasksByCreatedAt,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
}