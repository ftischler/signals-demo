import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IPokemon } from 'pokeapi-typescript';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { RatingsComponent } from '../ratings/ratings.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RatingsComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  searchTerm = signal('');
  searchTerm$ = toObservable(this.searchTerm);

  pokemon = toSignal(
    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm) => this.getPokemon(searchTerm))
    )
  );

  ratings = signal<Record<string, boolean>>({});

  private httpClient = inject(HttpClient);

  rate(name: string, like: boolean) {
    this.ratings.update((ratings) => ({
      ...ratings,
      [name]: like,
    }));
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
