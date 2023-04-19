import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IPokemon } from 'pokeapi-typescript';
import { delay } from 'rxjs';

@Component({
  selector: 'signals-pokemon-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-search.component.html',
  styleUrls: ['./pokemon-search.component.scss'],
})
export class PokemonSearchComponent {
  searchTerm: string;
  pokemon: IPokemon;

  private httpClient = inject(HttpClient);

  find() {
    const pokemonName = this.searchTerm.toLowerCase();
    this.httpClient
      .get<IPokemon>(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .pipe(delay(5000))
      .subscribe((pokemon) => {
        this.pokemon = pokemon;
        console.log(`Successfully resolved Pokémon ${pokemonName}`);
      });
  }
}
