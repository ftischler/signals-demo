import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IPokemon } from 'pokeapi-typescript';
import { catchError, Observable, of } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchTerm: string;
  pokemon?: IPokemon;

  private httpClient = inject(HttpClient);

  find(): void {
    this.getPokemon(this.searchTerm).subscribe(
      (pokemon) => (this.pokemon = pokemon)
    );
  }

  getPokemon(searchTerm?: string): Observable<IPokemon | undefined> {
    if (!searchTerm) {
      return of(undefined);
    }

    return this.httpClient
      .get<IPokemon>(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
      )
      .pipe(
        catchError(() => {
          console.error(`Error fetching data for ${searchTerm}`);
          return of(undefined);
        })
      );
  }
}
