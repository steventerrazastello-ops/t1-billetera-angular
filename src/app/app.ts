import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BilleteraComponent } from './components/billetera/billetera';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BilleteraComponent],
  styleUrl: './app.css',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
