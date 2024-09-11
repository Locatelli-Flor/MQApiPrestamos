import {Job, Worker} from 'bullmq';
import redisConnection from "./redisConnection";
import {editar, eliminar, guardar, obtenerPorId, obtenerTodos} from './jobProcessor';

let worker: Worker

export function setUpWorker(): void {
    worker = new Worker('prestamos', async (job: Job) => {
        switch (job.name) {
            case 'obtenerTodos':
                return obtenerTodos(job);
            case 'obtenerPorId':
                return obtenerPorId(job);
            case 'guardar':
                return guardar(job);
            case 'eliminar':
                return eliminar(job);
            case 'editar':
                return editar(job);
            default:
                throw new Error(`Unknown job name ${job.name}`);
        }
    }, {
        connection: redisConnection,
        autorun: true,
    });

    worker.on('completed', (job: Job, returnvalue: any) => {
        console.debug(`Completed job with id ${job.id}`, returnvalue);
    });

    worker.on('active', (job: Job<unknown>) => {
        console.debug(`Completed job with id ${job.id}`);
    });

    worker.on('error', (failedReason: Error) => {
        console.error(`Job encountered an error`, failedReason);
    });
}