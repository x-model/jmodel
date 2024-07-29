import {
  ExecutionContext,
  build,
  from,
  mergeWith,
  methods,
} from '@web-fragments/ng-fragments';
import { cardModel } from '../base/card.model';
import {
  starshipRepositoryFactory,
  starshipRepositoryToken,
} from '../../repositories/starships/starship.repository';
import { compareStarships } from './services/starship-comparer';
import { mapStarship } from './services/starship-mapper';

const cardRepositoryToken = Symbol('cardRepository');
const starshipModelToken = Symbol('cardModel');

const dependencies = providers({
  cardRepository: asScoped(
    cardRepositoryToken,
    fromFactory(starshipRepositoryFactory)
  ),
  authModel: provideStarshipModel(),
});

const deps = new Map([[starshipRepositoryToken, starshipRepositoryFactory]]);

const starshipModelFactory = (context: ExecutionContext) =>
  build(
    from(context),
    mergeWith(cardModel()),
    dependencies(),
    methods(() => ({
      compare: compareStarships,
      map: mapStarship,
    }))
  );

// w interface starshipModel powinien mieć wszystkie dependencies,
// wtedy mamy pewność że wszystkie dependencies są w providers
// pytanie gdzie powinno się definiować providers? w parent
// czy np. tutaj w modelu?
// w sumie chcemy mieć separację warstw,
// więc powinno się rejestrować w każdej warstwie
// context nie powinien wiedzieć, że używamy repository
// co jak użyjemy tego samego tokenu dla dwóch różnych source
// i ustawimy je jako singleton?
// będą w innym scope, ale jak potem takiego czegoś wyszukać
// musiałaby zostać wprowadzona jakaś relacja
// przemyśli się później, na razie przyjmujemy,
// że nie da się tworzyć aliasów dla singletona

export const provideStarshipModel = (/* 'singleInstance' */) =>
  singleton(cardModelToken, fromFactory(starshipModelFactory));

// co jeżeli dla jakiegoś repository, albo modelu będziemy potrzebowali więcej opcji? użyjemy tokenu z bazowym typem i co potem?
// w sumie to w modelu jest ukryta abstrakcja, więc on może mieć swój token dla repository,
// token informuje o publicznym api, a nie to co jest wewnątrz

// gdzie wrzucać metodki provideStarshipModel, provideStarshipRepository, czy metodkę dla repository w modelu?
// czy w repository metodka repository i to jest traktowane jako taki defaultowy provider?
// a jak trzeba nadpisać to wtedy metodka repository w modelu? Jak wprowadzimy typy to się wszystko okaże
