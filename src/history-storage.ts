const KEY = 'SPEAK-IT-STORAGE';

const HISTORY_SIZE_LIMIT = 100;

export default class HistoryStorage {
  private storage: Storage;

  constructor(storage: Storage[]) {
    this.storage = storage.find(storage => storage != null);
  }

  public get(): string[] {
    if (this.storage == null) {
      return [];
    }
    const history = this.storage.getItem(KEY);
    if (history == null) {
      return [];
    }
    return JSON.parse(history);
  }

  public add(message: string): void {
    if (this.storage == null) {
      return;
    }
    let history = this.removedHistory(message);
    history.unshift(message);
    history = history.slice(0, HISTORY_SIZE_LIMIT);
    this.storage.setItem(KEY, JSON.stringify(history));
  }

  public delete(message: string): void {
    if (this.storage == null) {
      return;
    }
    const history = this.removedHistory(message);
    this.storage.setItem(KEY, JSON.stringify(history));
  }

  private removedHistory(message: string): string[] {
    let history = this.get();
    return history.filter(h => h !== message);
  }
}
