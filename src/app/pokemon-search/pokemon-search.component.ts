import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IPokemon } from 'pokeapi-typescript';
import { firstValueFrom } from 'rxjs';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'signals-pokemon-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingComponent],
  templateUrl: './pokemon-search.component.html',
  styleUrls: ['./pokemon-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonSearchComponent {
  private httpClient = inject(HttpClient);

  searchTerm = signal<string>('');
  pokemon = signal<IPokemon | undefined>(undefined);

  ratings = signal<Record<string, boolean>>({});

  rate(name: string, like: boolean) {
    this.ratings.mutate((ratings) => (ratings[name] = like));
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
