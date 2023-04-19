import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IPokemon } from 'pokeapi-typescript';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'signals-pokemon-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-search.component.html',
  styleUrls: ['./pokemon-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonSearchComponent {
  searchTerm = signal<string>('');
  pokemon = signal<IPokemon | undefined>(undefined);
  counter1 = signal(0);
  counter2 = signal(0);

  added = computed(() => {
    console.log('computed');
    return this.counter1() + this.counter2();
  });

  private httpClient = inject(HttpClient);

  constructor() {
    effect(async () => {
      console.log('exec effect');
      await this.find();
    });
  }

  incrementCounter1(): void {
    this.counter1.update((counter) => counter + 1);
  }

  incrementCounter2(): void {
    this.counter2.update((counter) => counter + 1);
  }

  async find() {
    const searchTerm = this.searchTerm();

    if (!searchTerm) {
      return;
    }

    const pokemonName = searchTerm.toLowerCase();
    const pokemon = await firstValueFrom(
      this.httpClient.get<IPokemon>(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      )
    );

    this.pokemon.set(pokemon);
  }
}
