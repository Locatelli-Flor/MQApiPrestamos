import {Job} from 'bullmq';
import {Prestamo, PrestamoInput} from "./models/Prestamo";

let prestamos: Prestamo[] = [
    {
        id: 1,
        monto: 10000,
        interes: 5,
        cuotas: 12,
        fechaInicio: '2023-01-01',
        balance: 9500,
        idCliente: 101,
        pagado: false
    },
    {
        id: 2,
        monto: 20000,
        interes: 4,
        cuotas: 24,
        fechaInicio: '2023-02-01',
        balance: 18000,
        idCliente: 102,
        pagado: false
    },
    {
        id: 3,
        monto: 15000,
        interes: 6,
        cuotas: 18,
        fechaInicio: '2023-03-01',
        balance: 14000,
        idCliente: 103,
        pagado: false
    }
];

export async function obtenerTodos(job: Job): Promise<Prestamo[]> {
    await job.log(`Started processing job with id ${job.id}`);
    console.log(`Job with id ${job.id}`, job.data);

    return prestamos;
}

export async function obtenerPorId(job: Job): Promise<Prestamo | string> {
    await job.log(`Started processing job with id ${job.id}`);
    console.log(`Job with id ${job.id}`, job.data);

    return prestamos.find(prestamo => prestamo.id.toString() === job.data.id) || 'Not found';
}

export async function guardar(job: Job): Promise<number> {
    await job.log(`Started processing job with id ${job.id}`);
    console.log(`Job with id ${job.id}`, job.data);

    const prestamoInput: PrestamoInput = job.data;
    const id = prestamos.length + 1;
    prestamos.push({
        id: id,
        monto: prestamoInput.monto,
        interes: prestamoInput.interes,
        cuotas: prestamoInput.cuotas,
        fechaInicio: prestamoInput.fechaInicio,
        balance: prestamoInput.monto,
        idCliente: prestamoInput.idCliente,
        pagado: false
    });

    return id;
}

export function eliminar(job: Job): Promise<number> {
    prestamos = prestamos.filter(prestamo => prestamo.id.toString() !== job.data.id);
    return job.data.id;
}

export function editar(job: Job): Promise<number> {
    const id = job.data.id;
    const prestamoInput: PrestamoInput = job.data;
    const prestamo = prestamos.find(prestamo => prestamo.id.toString() === id);
    if (prestamo) {
        prestamo.monto = prestamoInput.monto;
        prestamo.interes = prestamoInput.interes;
        prestamo.cuotas = prestamoInput.cuotas;
        prestamo.fechaInicio = prestamoInput.fechaInicio;
        prestamo.balance = prestamoInput.monto;
        prestamo.idCliente = prestamoInput.idCliente;
    }

    return id;
}