import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BilleteraComponent } from './billetera';
import { NuevoMovimientoComponent } from '../nuevo-movimiento/nuevo-movimiento';

describe('BilleteraComponent', () => {
  let fixture: ComponentFixture<BilleteraComponent>;
  let vista: HTMLElement;
  let formulario: NuevoMovimientoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BilleteraComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BilleteraComponent);
    fixture.detectChanges();
    vista = fixture.nativeElement as HTMLElement;
    formulario = fixture.debugElement.query(
      By.directive(NuevoMovimientoComponent)
    ).componentInstance as NuevoMovimientoComponent;
  });

  it('inicia con S/ 250.00 y sin movimientos', () => {
    expect(vista.querySelector('.amount')?.textContent).toContain('250.00');
    expect(vista.querySelector('tbody')?.textContent).toContain(
      'Todavía no hay movimientos registrados.'
    );
  });

  it('ejecuta la secuencia mínima de recarga y gasto en orden reciente', () => {
    formulario.movimientoCreado.emit({ tipo: 'recarga', monto: 100 });
    fixture.detectChanges();
    expect(vista.querySelector('.amount')?.textContent).toContain('350.00');

    formulario.movimientoCreado.emit({ tipo: 'gasto', monto: 50 });
    fixture.detectChanges();

    expect(vista.querySelector('.amount')?.textContent).toContain('300.00');

    const filas = Array.from(vista.querySelectorAll('tbody tr'));
    expect(filas).toHaveLength(2);
    expect(filas[0].textContent).toContain('Gasto');
    expect(filas[0].textContent).toContain('50.00');
    expect(filas[1].textContent).toContain('Recarga');
    expect(filas[1].textContent).toContain('100.00');
  });

  it('rechaza un gasto mayor al saldo sin cambiar el estado', () => {
    formulario.movimientoCreado.emit({ tipo: 'gasto', monto: 400 });
    fixture.detectChanges();

    expect(vista.querySelector('.amount')?.textContent).toContain('250.00');
    expect(vista.querySelector('tbody')?.textContent).toContain(
      'Todavía no hay movimientos registrados.'
    );
  });

  it('rechaza montos no finitos, cero y negativos aunque lleguen al padre', () => {
    formulario.movimientoCreado.emit({ tipo: 'recarga', monto: Number.NaN });
    formulario.movimientoCreado.emit({ tipo: 'recarga', monto: 0 });
    formulario.movimientoCreado.emit({ tipo: 'recarga', monto: -1 });
    fixture.detectChanges();

    expect(vista.querySelector('.amount')?.textContent).toContain('250.00');
    expect(vista.querySelectorAll('tbody tr')).toHaveLength(1);
  });
});
