import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'search',
    loadComponent: () =>
      import('./search/search.component').then((m) => m.SearchComponent),
  },
  {
    path: 'game-search',
    loadComponent: () =>
      import('./game-search/game-search.component').then(
        (m) => m.GameSearchComponent
      ),
  },
];
