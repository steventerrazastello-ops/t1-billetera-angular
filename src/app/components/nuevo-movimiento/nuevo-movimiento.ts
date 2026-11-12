import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { NuevoMovimiento, TipoMovimiento } from '../../models/movimiento';

@Component({
  selector: 'app-nuevo-movimiento',
  standalone: true,
  templateUrl: './nuevo-movimiento.html',
  styleUrl: './nuevo-movimiento.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevoMovimientoComponent {
  readonly saldo = input.required<number>();
  readonly movimientoCreado = output<NuevoMovimiento>();

  protected readonly tipo = signal<TipoMovimiento | ''>('');
  protected readonly montoTexto = signal('');
  protected readonly tipoTocado = signal(false);
  protected readonly montoTocado = signal(false);

  protected readonly mensajeTipo = computed(() => {
    if (!this.tipoTocado()) {
      return '';
    }
    return this.tipo() === '' ? 'Seleccione un tipo de movimiento.' : '';
  });

  protected readonly mensajeMonto = computed(() => {
    if (!this.montoTocado()) {
      return '';
    }
    return this.validarMonto() ?? '';
  });

  protected readonly formularioValido = computed(() =>
    this.tipo() !== '' && this.validarMonto() === null
  );

  protected actualizarTipo(evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value;
    this.tipo.set(valor === 'recarga' || valor === 'gasto' ? valor : '');
    this.tipoTocado.set(true);
  }

  protected actualizarMonto(evento: Event): void {
    this.montoTexto.set((evento.target as HTMLInputElement).value);
    this.montoTocado.set(true);
  }

  protected registrar(evento: Event): void {
    evento.preventDefault();
    this.tipoTocado.set(true);
    this.montoTocado.set(true);

    if (!this.formularioValido()) {
      return;
    }

    this.movimientoCreado.emit({
      tipo: this.tipo() as TipoMovimiento,
      monto: Number(this.montoTexto()),
    });

    this.tipo.set('');
    this.montoTexto.set('');
    this.tipoTocado.set(false);
    this.montoTocado.set(false);
  }

  private validarMonto(): string | null {
    const texto = this.montoTexto().trim();

    if (texto === '') {
      return 'Ingrese un monto.';
    }

    const monto = Number(texto);
    if (!Number.isFinite(monto)) {
      return 'El monto debe ser un número válido.';
    }

    if (monto <= 0) {
      return 'El monto debe ser mayor que cero.';
    }

    if (!/^\d+(?:\.\d{1,2})?$/.test(texto)) {
      return 'Use un monto con máximo dos decimales, por ejemplo 10.50.';
    }

    if (this.tipo() === 'gasto' && monto > this.saldo()) {
      return 'El gasto no puede superar el saldo disponible.';
    }

    return null;
  }
}
