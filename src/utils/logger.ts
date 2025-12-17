export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export class Logger {
  private static logLevel: LogLevel = LogLevel.INFO;

  static setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  static error(message: string, ...args: any[]): void {
    if (this.logLevel >= LogLevel.ERROR) {
      console.error(`[${new Date().toISOString()}] ERROR: ${message}`, ...args);
    }
  }

  static warn(message: string, ...args: any[]): void {
    if (this.logLevel >= LogLevel.WARN) {
      console.warn(`[${new Date().toISOString()}] WARN: ${message}`, ...args);
    }
  }

  static info(message: string, ...args: any[]): void {
    if (this.logLevel >= LogLevel.INFO) {
      console.log(`[${new Date().toISOString()}] INFO: ${message}`, ...args);
    }
  }

  static debug(message: string, ...args: any[]): void {
    if (this.logLevel >= LogLevel.DEBUG) {
      console.log(`[${new Date().toISOString()}] DEBUG: ${message}`, ...args);
    }
  }
}
