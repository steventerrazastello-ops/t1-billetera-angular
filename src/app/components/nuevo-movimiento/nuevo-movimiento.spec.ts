import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoMovimiento } from '../../models/movimiento';
import { NuevoMovimientoComponent } from './nuevo-movimiento';

describe('NuevoMovimientoComponent', () => {
  let fixture: ComponentFixture<NuevoMovimientoComponent>;
  let componente: NuevoMovimientoComponent;
  let vista: HTMLElement;
  let emitidos: NuevoMovimiento[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoMovimientoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevoMovimientoComponent);
    fixture.componentRef.setInput('saldo', 250);
    componente = fixture.componentInstance;
    emitidos = [];
    componente.movimientoCreado.subscribe((movimiento) => emitidos.push(movimiento));
    fixture.detectChanges();
    vista = fixture.nativeElement as HTMLElement;
  });

  function ingresar(tipo: string, monto: string): void {
    const selector = vista.querySelector('#tipo') as HTMLSelectElement;
    const entrada = vista.querySelector('#monto') as HTMLInputElement;

    selector.value = tipo;
    selector.dispatchEvent(new Event('change'));
    entrada.value = monto;
    entrada.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function enviar(): void {
    const formulario = vista.querySelector('form') as HTMLFormElement;
    formulario.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );
    fixture.detectChanges();
  }

  it('emite una recarga válida y limpia el formulario', () => {
    ingresar('recarga', '100');

    const boton = vista.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(boton.disabled).toBe(false);

    enviar();

    expect(emitidos).toEqual([{ tipo: 'recarga', monto: 100 }]);
    expect((vista.querySelector('#tipo') as HTMLSelectElement).value).toBe('');
    expect((vista.querySelector('#monto') as HTMLInputElement).value).toBe('');
  });

  it.each([
    ['', 'Ingrese un monto.'],
    ['A', 'El monto debe ser un número válido.'],
    ['0', 'El monto debe ser mayor que cero.'],
    ['-1', 'El monto debe ser mayor que cero.'],
    ['10.123', 'Use un monto con máximo dos decimales, por ejemplo 10.50.'],
  ])('rechaza el monto inválido "%s"', (monto, mensajeEsperado) => {
    ingresar('recarga', monto);
    enviar();

    expect(emitidos).toHaveLength(0);
    expect(vista.textContent).toContain(mensajeEsperado);
    expect(
      (vista.querySelector('button[type="submit"]') as HTMLButtonElement).disabled
    ).toBe(true);
  });

  it('rechaza un gasto mayor al saldo disponible', () => {
    ingresar('gasto', '400');
    enviar();

    expect(emitidos).toHaveLength(0);
    expect(vista.textContent).toContain(
      'El gasto no puede superar el saldo disponible.'
    );
  });
});
