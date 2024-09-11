export interface Prestamo {
    id: number;
    monto: number;
    interes: number;
    cuotas: number;
    fechaInicio: string;
    balance: number;
    idCliente: number;
    pagado: boolean;
}

export interface PrestamoInput {
    monto: number;
    interes: number;
    cuotas: number;
    fechaInicio: string;
    idCliente: number;
}