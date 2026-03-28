# Base Quiz Sprint

Готовый мини-проект для Base / CTBase: статическая викторина без бэкенда, которую можно развернуть как обычный web app и открыть внутри Base App.

## Что внутри

- **Статический фронтенд** на React + Vite
- **Кошелёк и Base-ready web stack** через `wagmi`, `viem` и `baseAccount`
- **Мини-игра-викторина**: 10 случайных вопросов за раунд
- **Опциональная ончейн-таблица рекордов** через смарт-контракт `BaseQuizHighScores`
- **Без сервера**: игра работает целиком на фронтенде, ончейн нужен только для отправки результатов
- **GitHub Pages workflow** для бесплатного деплоя

## Архитектура

### 1) `app/`
Фронтенд мини-игры:
- `src/questions.js` — банк вопросов
- `src/components/QuizGame.jsx` — игровой цикл
- `src/components/WalletPanel.jsx` — подключение Base Account / browser wallet
- `src/components/SubmitScorePanel.jsx` — отправка результата в контракт
- `src/components/LeaderboardPanel.jsx` — чтение лидерборда из event logs

### 2) `contracts/`
Смарт-контракт для рекордов:
- `BaseQuizHighScores.sol`
- `scripts/deploy.js`
- `test/BaseQuizHighScores.js`

## Игровая механика

- За один запуск выбирается **10 случайных вопросов**
- Каждый правильный ответ = **100 очков**
- Итоговый счёт = **0–1000**
- После завершения можно:
  - начать заново
  - поделиться результатом
  - отправить лучший результат onchain

## Важное ограничение

Лидерборд **не античитовый**. Это осознанный компромисс ради архитектуры **без сервера**. Для казуальной викторины, демо, комьюнити-активации и публикации в CTBase этого обычно достаточно. Если нужен честный соревновательный режим, понадобится серверная валидация или более сложная криптографическая схема.

## Быстрый запуск локально

Установите зависимости только для фронтенда:

```bash
cd app
npm install
npm run dev
```

Это поднимет локальный dev-сервер с игрой.

## Настройка фронтенда

Скопируйте пример env:

```bash
cd app
cp .env.example .env.local
```

Основные переменные:

```env
VITE_APP_URL=https://your-username.github.io/base-quiz-sprint/
VITE_BASE_PATH=/base-quiz-sprint/
VITE_QUIZ_NAME=Base Quiz Sprint
VITE_QUIZ_CONTRACT_ADDRESS=
VITE_QUIZ_START_BLOCK=
VITE_QUIZ_CHAIN_ID=84532
```

### Что означают поля

- `VITE_APP_URL` — публичный URL приложения
- `VITE_BASE_PATH` — base path для GitHub Pages
- `VITE_QUIZ_CONTRACT_ADDRESS` — адрес контракта лидерборда
- `VITE_QUIZ_START_BLOCK` — блок, с которого читать `HighScoreSet` события
- `VITE_QUIZ_CHAIN_ID`:
  - `84532` — Base Sepolia
  - `8453` — Base mainnet

Если контракт ещё не развернут, игра всё равно работает — просто без ончейн-лидерборда.

## Деплой контракта

Скопируйте env для контрактов:

```bash
cd contracts
npm install
cp .env.example .env
```

Заполните:

```env
PRIVATE_KEY=0xyour_private_key
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_RPC_URL=https://mainnet.base.org
ETHERSCAN_API_KEY=
MAX_SCORE=1000
```

### Base Sepolia

```bash
cd contracts
npx hardhat run scripts/deploy.js --network baseSepolia
```

### Base Mainnet

```bash
cd contracts
npx hardhat run scripts/deploy.js --network base
```

После деплоя скрипт выведет:
- адрес контракта
- стартовый блок
- готовые строки для `app/.env.local`

## Тесты контракта

```bash
cd contracts
npx hardhat test
```

## Сборка фронтенда

```bash
cd app
npm run build
```

Готовая статика окажется в `app/dist`.

## Бесплатный деплой на GitHub Pages

В архив уже включён workflow:

```text
.github/workflows/deploy-pages.yml
```

Что сделать:

1. Создать GitHub-репозиторий
2. Залить туда проект
3. Запушить в `main`
4. Включить GitHub Pages в репозитории
5. Дождаться выполнения workflow

Workflow сам собирает `app/dist` и публикует его в GitHub Pages.

## Публикация для Base App

Текущий проект собран как **standard web app** для Base-совместимого сценария:

- фронтенд открывается как обычный web app
- кошелёк работает через `wagmi` / `viem`
- Base Account используется как предпочтительный коннектор внутри Base App

После хостинга:

1. Откройте проект по публичному URL
2. Проверьте подключение кошелька и отправку счёта
3. Зарегистрируйте приложение в **Base.dev**
4. Заполните metadata:
   - name
   - icon
   - tagline
   - description
   - screenshots
   - category
   - primary URL

## Что можно быстро улучшить

Если захотите прокачать версию после MVP:

- NFT-награда за счёт 800+
- ежедневные/еженедельные question packs
- мультиязычность
- сезонный лидерборд
- категории вопросов
- sound / haptics
- builder code attribution
- Zora collectible за участие

## Рекомендуемый порядок запуска

1. Прогнать фронтенд локально
2. Деплоить контракт в **Base Sepolia**
3. Подставить адрес и стартовый блок в `app/.env.local`
4. Проверить отправку результатов
5. Затем при необходимости деплоить тот же контракт в **Base mainnet**
6. Опубликовать фронтенд на GitHub Pages / Cloudflare Pages
7. Добавить приложение в Base.dev

## Лицензия

MIT
