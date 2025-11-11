export type Language = 'en' | 'ru';

export const translations = {
  // HomeScreen
  minesweeper: { en: 'Minesweeper', ru: 'Сапёр' },
  duels: { en: 'Duels', ru: 'Дуэли' },
  playOnline: { en: 'Play Online', ru: 'Играть Онлайн' },
  playLocal: { en: 'Play Local', ru: 'Играть Локально' },
  homeScreenDescription: { en: 'Challenge a friend online or on the same screen!', ru: 'Бросьте вызов другу онлайн или на одном экране!' },
  onlineMode: { en: 'Online Mode', ru: 'Онлайн Режим' },
  createGame: { en: 'Create Game', ru: 'Создать Игру' },
  joinGame: { en: 'Join Game', ru: 'Присоединиться' },
  settings: { en: 'Settings', ru: 'Настройки' },

  // LobbyScreen
  joinGameRoom: { en: 'Join a Game Room', ru: 'Войти в игровую комнату' },
  enterRoomId: { en: 'Enter Room ID', ru: 'Введите ID Комнаты' },
  join: { en: 'Join', ru: 'Войти' },
  roomNotFound: { en: 'Room not found. Please check the ID and try again.', ru: 'Комната не найдена. Проверьте ID и попробуйте снова.' },
  backToYourRoom: { en: 'Back to your room', ru: 'Вернуться в вашу комнату' },
  yourGameRoom: { en: 'Your Game Room', ru: 'Ваша игровая комната' },
  shareId: { en: 'Share this ID with your friend:', ru: 'Поделитесь этим ID с другом:' },
  startGame: { en: 'Start Game', ru: 'Начать Игру' },
  joinAnotherRoom: { en: 'Want to join another room?', ru: 'Хотите войти в другую комнату?' },
  backToMenu: { en: 'Back to Menu', ru: 'В Главное Меню' },

  // GameScreen
  connecting: { en: 'Connecting to game room...', ru: 'Подключение к игровой комнате...' },
  waitingForOpponent: { en: 'Waiting for opponent to join...', ru: 'Ожидание второго игрока...' },
  youAre: { en: 'You are', ru: 'Вы' },

  // StatusBar
  player: { en: 'Player', ru: 'Игрок' },
  yourTurn: { en: 'Your Turn', ru: 'Ваш Ход' },
  opponentsTurn: { en: "Opponent's Turn", ru: 'Ход Противника' },
  playersTurn: { en: "Player {player}'s Turn", ru: "Ход Игрока {player}" },
  exit: { en: 'Exit', ru: 'Выход' },
  area: { en: 'Area', ru: 'Территория' },
  matchTime: { en: 'Match Time', ru: 'Время Матча' },
  turn: { en: 'Turn', ru: 'Ход' },
  roomId: { en: 'Room ID:', ru: 'ID Комнаты:' },

  // GameOverModal
  gameOver: { en: 'Game Over', ru: 'Игра Окончена' },
  itsADraw: { en: "It's a Draw!", ru: 'Ничья!' },
  playerWins: { en: 'Player {winner} Wins!', ru: 'Игрок {winner} Победил!' },
  backToMainMenu: { en: 'Back to Main Menu', ru: 'В Главное Меню' },

  // GameSettings
  matchSettings: { en: 'Match Settings', ru: 'Настройки Матча' },
  boardSize: { en: 'Board Size', ru: 'Размер Поля' },
  small: { en: 'Small', ru: 'Маленькое' },
  medium: { en: 'Medium', ru: 'Среднее' },
  large: { en: 'Large', ru: 'Большое' },
  difficulty: { en: 'Difficulty (Mines)', ru: 'Сложность (Мины)' },
  easy: { en: 'Easy', ru: 'Легко' },
  hard: { en: 'Hard', ru: 'Сложно' },
  turnTimer: { en: 'Turn Timer', ru: 'Таймер Хода' },
  startLocalGame: { en: 'Start Local Game', ru: 'Начать Локальную Игру' },
  createOnlineRoom: { en: 'Create Online Room', ru: 'Создать Онлайн Комнату' },
  back: { en: 'Back', ru: 'Назад' },

  // RouletteScreen
  decidingFirst: { en: 'Deciding who goes first...', ru: 'Определяем, кто ходит первым...' },

  // SettingsScreen
  language: { en: 'Language', ru: 'Язык' },
  done: { en: 'Done', ru: 'Готово' },
};

export type TranslationKey = keyof typeof translations;