const KEY = 'SPEAK-IT-STORAGE';

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
    let history = this.get();
    history = history.filter(h => h !== message);
    history.unshift(message);
    this.storage.setItem(KEY, JSON.stringify(history));
  }
}
