export type TipoMovimiento = 'recarga' | 'gasto';

export interface NuevoMovimiento {
  tipo: TipoMovimiento;
  monto: number;
}

export interface Movimiento extends NuevoMovimiento {
  id: number;
  fecha: Date;
}
