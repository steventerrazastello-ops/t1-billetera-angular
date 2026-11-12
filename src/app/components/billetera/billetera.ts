import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Movimiento, NuevoMovimiento } from '../../models/movimiento';
import { NuevoMovimientoComponent } from '../nuevo-movimiento/nuevo-movimiento';

@Component({
  selector: 'app-billetera',
  standalone: true,
  imports: [DatePipe, DecimalPipe, NuevoMovimientoComponent],
  templateUrl: './billetera.html',
  styleUrl: './billetera.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BilleteraComponent {
  protected readonly saldo = signal(250);
  protected readonly movimientos = signal<Movimiento[]>([]);

  private siguienteId = 1;

  protected registrarMovimiento(nuevoMovimiento: NuevoMovimiento): void {
    const { tipo, monto } = nuevoMovimiento;
    const saldoActual = this.saldo();

    if (!Number.isFinite(monto) || monto <= 0) {
      return;
    }

    if (tipo === 'gasto' && monto > saldoActual) {
      return;
    }

    const nuevoSaldo = tipo === 'recarga'
      ? saldoActual + monto
      : saldoActual - monto;

    this.saldo.set(this.redondearMoneda(nuevoSaldo));
    this.movimientos.update((actuales) => [
      {
        id: this.siguienteId++,
        tipo,
        monto: this.redondearMoneda(monto),
        fecha: new Date(),
      },
      ...actuales,
    ]);
  }

  private redondearMoneda(valor: number): number {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
  }
}
