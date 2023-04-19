import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IPokemon } from 'pokeapi-typescript';
import { RatingsComponent } from '../ratings/ratings.component';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  switchMap,
  timer,
} from 'rxjs';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RatingsComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private httpClient = inject(HttpClient);
  private injector = inject(Injector);

  searchTerm = signal('');
  pokemon = signal<IPokemon | undefined>(undefined);
  ratings = signal<Record<string, boolean>>({});
  durationSeconds = toSignal(timer(0, 1000), { initialValue: 0 });
  amountSearched = signal(0);
  durationMinutes = computed(() => (this.durationSeconds() / 60).toFixed(2));

  searchTerm$ = toObservable(this.searchTerm);

  constructor() {
    effect(() =>
      runInInjectionContext(this.injector, () => this.findDebounced())
    );
  }

  rate(name: string, like: boolean): void {
    this.ratings.update((ratings) => ({ ...ratings, [name]: like }));
  }

  findDebounced(): void {
    this.searchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm) => this.getPokemon(searchTerm)),
        takeUntilDestroyed()
      )
      .subscribe((pokemon) => {
        this.pokemon.set(pokemon);

        if (pokemon) {
          this.amountSearched.update((amount) => amount + 1);
        }
      });
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
