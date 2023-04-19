import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IPokemon } from 'pokeapi-typescript';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchTerm = signal('');
  pokemon = signal<IPokemon | undefined>(undefined);

  private httpClient = inject(HttpClient);

  find(): void {
    const pokemonName = this.searchTerm().toLowerCase();
    this.httpClient
      .get<IPokemon>(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .subscribe((pokemon) => {
        this.pokemon.set(pokemon);
        console.log(`Successfully resolved Pokémon ${pokemonName}`);
      });
  }
}
