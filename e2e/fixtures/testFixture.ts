import { Page, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface for error data captured from window events
 */
interface ErrorData {
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
}

/**
 * Interface for console log entries
 */
interface ConsoleLog {
  type: string;
  text: string;
}

/**
 * Test Fixture class for common test operations
 */
export class TestFixture {
  private page: Page;
  private logFile: string;
  private errors: string[] = [];
  private consoleLogs: ConsoleLog[] = [];

  /**
   * Constructor
   * @param page Playwright page object
   * @param logFileName Name of the log file (without path)
   */
  constructor(page: Page, logFileName: string) {
    this.page = page;
    const OUT_LOG_PATH = path.join(process.cwd(), 'out.log');
    this.logFile = OUT_LOG_PATH;
    fs.writeFileSync(this.logFile, `=== Starting test at ${new Date().toISOString()} ===\n`);
  }

  /**
   * Generate a random ID for test data
   * @returns Random ID string
   */
  generateRandomId(): string {
    return Date.now().toString();
  }

  /**
   * Log a debug message to console and log file
   * @param message The message to log
   */
  debugLog(message: string): void {
    const logEntry = `[DEBUG] ${new Date().toISOString()} - ${message}`;
    console.log(logEntry);
    fs.appendFileSync(this.logFile, `${logEntry}\n`);
  }

  /**
   * Set up all error and console logging listeners
   */
  async setupLogging(): Promise<void> {
    // Set up console listener
    this.page.on('console', msg => {
      const logEntry = `[CONSOLE_${msg.type().toUpperCase()}] ${msg.text()}\n`;
      fs.appendFileSync(this.logFile, logEntry);
      this.consoleLogs.push({
        type: msg.type(),
        text: msg.text()
      });
      
      if (msg.type() === 'error') {
        this.errors.push(msg.text());
        console.log(logEntry.trim()); // Echo to terminal
      }
    });
    
    // Set up page error listener
    this.page.on('pageerror', error => {
      const logEntry = `[PAGE_ERROR] ${error.message}\n`;
      fs.appendFileSync(this.logFile, logEntry);
      console.log(logEntry.trim()); // Echo to terminal
      this.errors.push(error.message);
    });
    
    // Add window error event listener
    await this.page.exposeFunction('logWindowError', (errorData: ErrorData) => {
      const logEntry = `[WINDOW_ERROR] ${errorData.message}\n`;
      fs.appendFileSync(this.logFile, logEntry);
      console.log(logEntry.trim()); // Echo to terminal
      this.errors.push(errorData.message);
    });
    
    // Add global error handler in the browser
    await this.page.addInitScript(() => {
      window.addEventListener('error', (e) => {
        if ((window as any).logWindowError) {
          (window as any).logWindowError({
            message: e.error ? e.error.message : 'Unknown error event',
            stack: e.error ? e.error.stack : '',
            filename: e.filename || '',
            lineno: e.lineno || 0,
            colno: e.colno || 0
          });
        }
      });
    });
  }

  /**
   * Log an error to the log file
   * @param error The error to log
   */
  logError(error: Error): void {
    fs.appendFileSync(this.logFile, `[TEST_ERROR] ${error.message}\n${error.stack}\n`);
    console.error(`Test failed: ${error.message}`);
  }

  /**
   * Log a successful test completion
   */
  logSuccess(): void {
    fs.appendFileSync(this.logFile, `\n=== Test completed successfully at ${new Date().toISOString()} ===\n`);
    fs.appendFileSync(this.logFile, `Errors captured: ${this.errors.length}\n`);
    this.debugLog('=== Test completed successfully ===');
  }


  /**
   * Force test failure if a specific error pattern is detected
   * @param errorPattern Text pattern to search for in the errors or console logs
   * @throws Error if the specified error pattern is found
   */
  failOnError(errorPattern: string): void {
    // Check the errors array
    const foundError = this.errors.find(err => err.includes(errorPattern));
    if (foundError) {
      this.debugLog(`[FORCED FAILURE] Found error matching pattern: ${errorPattern}`);
      throw new Error(`Test failed due to error: ${foundError}`);
    }

    // Also check console logs with type 'error' for the pattern
    const foundConsoleError = this.consoleLogs.find(log => 
      log.type === 'error' && 
      (log.text.includes(errorPattern) || errorPattern === 'CONSOLE_ERROR')
    );
    if (foundConsoleError) {
      this.debugLog(`[FORCED FAILURE] Found console error matching pattern: ${errorPattern}`);
      throw new Error(`Test failed due to console error: ${foundConsoleError.text}`);
    }
  }

  /**
   * Get all captured errors
   * @returns Array of error messages
   */
  getErrors(): string[] {
    return this.errors;
  }

  /**
   * Get all captured console logs
   * @returns Array of console log entries
   */
  getConsoleLogs(): ConsoleLog[] {
    return this.consoleLogs;
  }
}
