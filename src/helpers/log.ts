// TODO(pablo): Don't know how to get static refs to the values, so
// manually keeping in-sync with src/wasm/include/web-ifc.h.
export enum LogLevel {
    LOG_LEVEL_DEBUG = 0,
    LOG_LEVEL_INFO,
    LOG_LEVEL_WARN,
    LOG_LEVEL_ERROR,
    LOG_LEVEL_OFF,
}

export abstract class Log {
	private static logLevel: number = LogLevel.LOG_LEVEL_INFO;

	public static setLogLevel(level: number) {
		this.logLevel = level;
	}

	static log(msg: string, ...args: any[]) {
		if(args.length > 0)
			console.log(msg, ...args);
		else
			console.log(msg);
	}

	public static debug(msg: string, ...args: any[]) {
		if (this.logLevel <= LogLevel.LOG_LEVEL_DEBUG) {
			this.log('DEBUG: ', msg, ...args);
		}
	}

	public static info(msg: string, ...args: any[]) {
		if (this.logLevel <= LogLevel.LOG_LEVEL_INFO) {
			console.info('INFO: ', msg, ...args);
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
