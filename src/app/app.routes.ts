import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'pokemon-search',
    loadComponent: () =>
      import('./pokemon-search/pokemon-search.component').then(
        (m) => m.PokemonSearchComponent
      ),
  },
  {
    path: 'pokemon-game-search',
    loadComponent: () =>
      import('./pokemon-game-search/pokemon-game-search.component').then(
        (m) => m.PokemonGameSearchComponent
      ),
  },
];
