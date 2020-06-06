---
layout: base
tags: [post, 2020]
title: Vuex + Jest.mock
description: Jest.mock вместе с Vuex - пример тестирования
---

# Как я тестировал класс зависящий от vuex-store используя jest.mock

Или как можно сделать мок рабочего vuex стора.

## Задача:

Есть класс, который выдает статусы относительно состояния данных в нашем сторе.

Нужно протестировать варианты работы методов, с проверкой разных данных в сторе


> При создании моков vuex-стора, когда его используют другие классы приложения, могут возникать проблемы.

### Как все это можно написать продемонстрирую на примере

По пунктам:

- 1: сначала будет написан не работающий код, что бы понять базовую структуру.
- 2: добавим в написанный бойлерплейт, код, который создает и заполняет мок нашего стора

### Пишем код стора, класса и тесты (пока не работающие)

> пример на TypeScript поэтому в файлах `@` алиас для `src/`

```ts
// @/store.ts

import Vuex from 'vuex'

export default new Vuex.Store({
  state: {
    // свойство стора в котором находится массив документов
    docs: [{
      title: 'Важный документ',
      isSigned: false
    }]
  },
  mutations: {
    // метод для изменения списка документов
    setDocs(state, docs) {
      state.docs = docs;
    }
  }
});
```


```ts
// @/lib/status.ts

import store from '@/store'; // грузим стор для получения данных из него
import { IDoc } from '@/types'

class Status {
  /**
   * Геттер для загрузки данных из стора
   */
  get data(): IDoc[] {
    return store.state.docs;
  }

  // далее идут методы, которые на основе данных возвращают статусы
  // они нам не важны, поэтому простой пример, что бы был

  /**
   * метод, который говорит, что хотябы один документ подписан
   */
  hasSignedDocument(): boolean {
    return this.data.some(doc => doc.isSigned);
  }
}
```

```ts/1,6
// @/lib/status.spec.ts
// ... Тут будет мок стора

import { Status } from './status';

const factory = (mockData) => {
  // ... тут позже будет код для обработки мока
  return new Status();
}

// Два теста вызвающих метод тестируемого клсса
it.each([
  // [methodName, expectResult, mockData]
  [ 'hasSignedDocument', false, [] ],
  [ 'hasSignedDocument', true,  [{ isSigned: true }] ],
])('statusTest', (methodName, expectResult, mockData) => {
  const wrapper = factory(mockData);
  const result = wrapper[methodName];
  expect(result).toBe(expectResult);
})
```

## Создание моков на Jest

В Jest есть несколько способов создавать моки.

Для того что бы это сделать в нашем тесте мы для начала, еще до написания первого `import ...` напишем мок стора. Но нужно учесть. При создании мока, Jest все конечные значения массивов - делает пустыми.

```ts/2
// @/lib/status.spec.ts

let originalStoreModule; // - это наш стор, запомни его

jest.mock('@/store', () => {
  // загружаем оригинальный стор
  originalStoreModule = jest.requireActual('@/store');

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalStoreModule,
  };
});

import { Status } from './status';
// ...
```

Теперь осталось дописать нашу функцию `factory` - которая создает экземпляр тестируемого класса с нужными нам данными.

```ts
// @/lib/status.spec.ts

// ...
const factory = (mockData) => {
  // сбрасываем все данные на дефолтные значения
  originalStoreModule.default.commit('setDocs', []);
  // наполняем мок стора данными
  originalStoreModule.default.commit('setDocs', mockData);

  return new Status();
}
// ...
```

### Итог

в итоге тест должен выглядеть примерно так:

```ts/3-10,15,16
// @/lib/status.spec.ts
let originalStoreModule;

jest.mock('@/store', () => {
  originalStoreModule = jest.requireActual('@/store');

  return {
    __esModule: true,
    ...originalStoreModule,
  };
});

import { Status } from './status';

const factory = (mockData) => {
  originalStoreModule.default.commit('setDocs', []);
  originalStoreModule.default.commit('setDocs', mockData);
  return new Status();
}


it.each([
  // [methodName, expectResult, mockData]
  [ 'hasSignedDocument', false, [] ],
  [ 'hasSignedDocument', true, [{ isSigned: true }] ],
])('statusTest', (methodName, expectResult, mockData) => {
  const wrapper = factory(mockData);
  const result = wrapper[methodName];
  expect(result).toBe(expectResult);
})
```