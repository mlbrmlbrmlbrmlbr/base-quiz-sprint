# Base Quiz Sprint — Summary

## Что было сделано

### Ревью и исправление багов

Проведён полный code review всего проекта (~2400 строк кода). Найдены и исправлены следующие проблемы:

#### 1. Баг: `pendingConnector` не существует в wagmi v2
- **Файл**: `app/src/components/WalletPanel.jsx`
- **Проблема**: Использовался `pendingConnector` из wagmi v1, которого нет в wagmi v2. Кнопка подключения кошелька никогда не показывала состояние "Connecting…"
- **Исправление**: Заменён на `variables?.connector?.id` (wagmi v2 API)

#### 2. Баг: Сортировка коннекторов
- **Файл**: `app/src/components/WalletPanel.jsx`
- **Проблема**: `Array.indexOf()` возвращает `-1` для неизвестных коннекторов, из-за чего они сортировались перед `baseAccount` вместо после него
- **Исправление**: Неизвестные коннекторы теперь уходят в конец списка

#### 3. Дизайн-баг: Однообразные позиции ответов
- **Файл**: `app/src/questions.js`
- **Проблема**: 15 из 18 вопросов имели правильный ответ на позиции 0. Игрок, всегда выбирающий первый вариант, получал ~83% правильных ответов
- **Исправление**: Варианты перемешаны, распределение ответов: 7×позиция 1, 6×позиция 2, 5×позиция 3

#### 4. og:image не работал на subpath
- **Файл**: `app/index.html`
- **Проблема**: Абсолютный путь `/social-card.svg` не работал при деплое на GitHub Pages (`/base-quiz-sprint/`)
- **Исправление**: Заменён на относительный путь `social-card.svg`

#### 5. package-lock.json в .gitignore
- **Файл**: `.gitignore`
- **Проблема**: Lock-файл был в .gitignore, что делало сборки невоспроизводимыми и ломало CI-кеш
- **Исправление**: Убран из .gitignore, lock-файл теперь коммитится

#### 6. CI workflow ссылался на неверный файл для кеша
- **Файл**: `.github/workflows/deploy-pages.yml`
- **Проблема**: `cache-dependency-path` указывал на `package.json` вместо `package-lock.json`
- **Исправление**: Исправлен путь

### Совместимость с Node.js v24

- **Проблема**: Vite 5.4 не поддерживает Node.js v24 — dev-сервер не запускался
- **Исправление**: Обновлён Vite до v8 и `@vitejs/plugin-react` до последней версии

### Проверка соответствия документации Base

Проект сверен с официальной документацией https://docs.base.org/mini-apps/quickstart/migrate-to-standard-web-app:

| Требование из docs | Статус |
|---|---|
| `wagmi` + `viem` + `@tanstack/react-query` | ✅ |
| `@base-org/account` | ✅ |
| `baseAccount` из `wagmi/connectors` | ✅ |
| `injected()` коннектор | ✅ |
| `WagmiProvider` + `QueryClientProvider` | ✅ |
| `base` chain + транспорт | ✅ (+ baseSepolia для тестнета) |
| `ssr: true` + `cookieStorage` | Не нужно (SPA, не SSR) |

### Деплой

#### GitHub
- Создан отдельный git-репозиторий (ранее проект был подпапкой в большом репо `VS Code/`)
- Все файлы запушены в `github.com:mlbrmlbrmlbrmlbr/base-quiz-sprint`
- GitHub Actions workflow для автодеплоя на GitHub Pages

#### Vercel
- Добавлен `vercel.json` с настройками для монорепо (install → build → output из `app/dist`)
- Проект задеплоен на https://base-quiz-sprint.vercel.app
- SPA rewrites настроены

#### Регистрация на Base
- Добавлен мета-тег `<meta name="base:app_id" content="69b8605df4e3ea969015e77a" />` в `index.html`
- Создан `.well-known/farcaster.json` с `accountAssociation` credentials
- Верификация на base.dev требует аккаунт Farcaster — станет необязательной после 9 апреля 2026

### Что проверено и работает корректно (без изменений)

- **Смарт-контракт** `BaseQuizHighScores.sol` — логика, custom errors, обновление nickname
- **Тесты** контракта — 5 тестов, все сценарии покрыты
- **Deploy-скрипт** и **Hardhat-конфиг**
- **ABI** в `quizContract.js` — полностью соответствует контракту
- **Fisher-Yates shuffle** в `utils.js`
- **Игровой цикл** `QuizGame.jsx` — таймер, подсчёт очков, фазы игры
- **SubmitScorePanel** и **LeaderboardPanel** — отправка и чтение onchain данных
- **CSS** — responsive верстка, dark theme

## Что осталось сделать

1. **Задеплоить контракт** на Base Sepolia (нужен кошелёк с тестовыми ETH):
   ```bash
   cd contracts
   cp .env.example .env
   # заполнить PRIVATE_KEY
   npx hardhat run scripts/deploy.js --network baseSepolia
   ```
   Затем добавить адрес и блок в Vercel Environment Variables:
   ```
   VITE_QUIZ_CONTRACT_ADDRESS=0x...
   VITE_QUIZ_START_BLOCK=...
   VITE_QUIZ_CHAIN_ID=84532
   ```

2. **Верификация на base.dev** — после 9 апреля 2026 (или раньше, если появится аккаунт Farcaster)

3. **GitHub Pages** — включить в Settings → Pages → Source: GitHub Actions

## Структура проекта

```
base-quiz-sprint/
├── app/                          React + Vite фронтенд
│   ├── src/
│   │   ├── components/           QuizGame, WalletPanel, SubmitScorePanel, LeaderboardPanel
│   │   ├── lib/                  wagmi config, contract ABI
│   │   ├── App.jsx               Главный layout
│   │   ├── main.jsx              Entry point + providers
│   │   ├── questions.js          18 вопросов (10 за раунд)
│   │   ├── utils.js              Helpers
│   │   └── styles.css            Dark theme
│   └── public/
│       ├── .well-known/farcaster.json
│       ├── icon.svg
│       └── social-card.svg
├── contracts/                    Hardhat + Solidity
│   ├── contracts/BaseQuizHighScores.sol
│   ├── scripts/deploy.js
│   └── test/BaseQuizHighScores.js
├── .github/workflows/deploy-pages.yml
├── vercel.json
├── package.json                  Monorepo (npm workspaces)
└── package-lock.json
```

## Ссылки

- **Vercel**: https://base-quiz-sprint.vercel.app
- **GitHub**: https://github.com/mlbrmlbrmlbrmlbr/base-quiz-sprint
- **Base docs**: https://docs.base.org/mini-apps/quickstart/migrate-to-standard-web-app
- **Base.dev**: https://www.base.dev
