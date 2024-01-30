/**
 * Web-IFC Logging Helper
 * @module Logging
 */

export enum LogLevel {
    LOG_LEVEL_DEBUG = 1,
    LOG_LEVEL_WARN = 3,
    LOG_LEVEL_ERROR = 4,
    LOG_LEVEL_OFF = 6
}

export abstract class Log {
	private static logLevel: number = LogLevel.LOG_LEVEL_ERROR;

	public static setLogLevel(level: number) {
		this.logLevel = level;
	}

	public static log(msg: string, ...args: any[]) {
		if (this.logLevel <= LogLevel.LOG_LEVEL_ERROR) {
			console.log(msg, ...args);
		}
	}
	
	public static debug(msg: string, ...args: any[]) {
		if (this.logLevel <= LogLevel.LOG_LEVEL_DEBUG) {
			console.trace('DEBUG: ', msg, ...args);
		}
	}

	public static warn(msg: string, ...args: any[]) {
		if (this.logLevel <= LogLevel.LOG_LEVEL_WARN) {
			console.warn('WARN: ', msg, ...args);
		}
	}

	public static error(msg: string, ...args: any[]) {
		if (this.logLevel <= LogLevel.LOG_LEVEL_ERROR) {
			console.error('ERROR: ', msg, ...args);
		}
	}
}
