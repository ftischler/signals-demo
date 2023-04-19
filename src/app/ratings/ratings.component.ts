import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pokemon-ratings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss'],
})
export class RatingsComponent {}
