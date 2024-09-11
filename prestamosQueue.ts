import {Job} from "bullmq";
import redisConnection from './redisConnection';
import {NextFunction, Request, Response} from 'express';
import {setUpWorker} from './worker';

const express = require('express');
const {Queue} = require('bullmq');

const app = express();
const port = 3000;

app.use(express.json());

const prestamosQueue = new Queue('prestamos', {connection: redisConnection});

setUpWorker();

const DEFAULT_REMOVE_CONFIG = {
    removeOnComplete: {
        age: 3600,
    },
    removeOnFail: {
        age: 24 * 3600,
    },
};

export async function addJobToQueue<T>(name: string, data: T): Promise<Job<T>> {
    return prestamosQueue.add(name, data, DEFAULT_REMOVE_CONFIG);
}

app.get('/obtenerTodos', async (req: Request, res: Response, next: NextFunction) => {
    const job = await addJobToQueue('obtenerTodos', {});
    res.json({jobId: job.id});
    return next();
});

app.get('/obtenerPorId/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const {id} = req.params;
    const job = await addJobToQueue('obtenerPorId', {id});
    res.json({jobId: job.id});
    return next();
});

app.post('/guardar', async (req: Request, res: Response, next: NextFunction) => {
    const job = await addJobToQueue('guardar', req.body);
    res.json({jobId: job.id});
    return next();
});

app.delete('/eliminar/:id', async (req: Request, res: Response, next: NextFunction) => {
    const job = await addJobToQueue('eliminar', {id: req.params.id});
    res.json({jobId: job.id});
    return next();
});

app.put('/editar/:id', async (req: Request, res: Response, next: NextFunction) => {
    const job = await addJobToQueue('editar', {id: req.params.id, ...req.body});
    res.json({jobId: job.id});
    return next();
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
