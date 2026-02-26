import fs from 'fs';
import path from 'path';

export enum LogMode {
  CONSOLE = "console",
  FILE = "file",
  BOTH = "both",
}

// Кольори для консолі
enum COLORS {
  INFO = "\x1b[36m",    // Cyan
  ERROR = "\x1b[31m",   // Red
  SUCCESS = "\x1b[32m", // Green
  RESET = "\x1b[0m",    // Reset
}

// Інтерфейс логера
export interface ILogger {
  info(message: string): void;
  error(message: string): void;
  success(message: string): void;
}

// Шлях до файлу логів
const LOG_FILE_PATH = path.join(__dirname, '../../logs.log');

class Logger implements ILogger {
  private mode: LogMode;

  constructor(mode: LogMode) {
    this.mode = mode;
    if (this.mode === LogMode.FILE || this.mode === LogMode.BOTH) {
        this.writeToFile(`\n--- NEW SESSION [${new Date().toISOString()}] ---\n`);
    }
  }

  private log(type: string, message: string, color: COLORS) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${type}]: [${timestamp}] - ${message}`;

    // Логування в консоль
    if (this.mode === LogMode.CONSOLE || this.mode === LogMode.BOTH) {
      console.log(`${color}${formattedMessage}${COLORS.RESET}`);
    }

    // Логування у файл
    if (this.mode === LogMode.FILE || this.mode === LogMode.BOTH) {
      this.writeToFile(formattedMessage + '\n');
    }
  }

  private writeToFile(text: string) {
    fs.appendFile(LOG_FILE_PATH, text, { encoding: 'utf-8' }, (err) => {
      if (err) console.error('Failed to write to log file:', err);
    });
  }

  public info(message: string): void {
    this.log('INFO', message, COLORS.INFO);
  }

  public error(message: string): void {
    this.log('ERROR', message, COLORS.ERROR);
  }

  public success(message: string): void {
    this.log('SUCCESS', message, COLORS.SUCCESS);
  }
}

// Отримання режиму з аргументів командного рядка
function getLogMode(): LogMode {
  const args = process.argv;
  
  // Шукаємо прапор log-to=
  const logArg = args.find(arg => arg.startsWith('--log-to='));
  
  if (!logArg) {
      // Перевіримо варіант з пробілом (npm start -- --log-to console)
      const logToIndex = args.indexOf('--log-to');
      if (logToIndex !== -1 && args[logToIndex + 1]) {
          const val = args[logToIndex + 1].toLowerCase();
          if (Object.values(LogMode).includes(val as LogMode)) {
              return val as LogMode;
          }
      }
      return LogMode.CONSOLE; // За замовчуванням
  }

  const value = logArg.split('=')[1].toLowerCase();

  if (Object.values(LogMode).includes(value as LogMode)) {
    return value as LogMode;
  }

  return LogMode.CONSOLE;
}

// Створення та експорт екземпляру логера
const currentMode = getLogMode();
export const logger = new Logger(currentMode);

// Логування режиму при старті
console.log(`[LOGGER INIT] Logging mode set to: ${currentMode.toUpperCase()}`);