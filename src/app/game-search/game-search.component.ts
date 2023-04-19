import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameSearchComponent {}
