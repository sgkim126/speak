const KEY = 'SPEAK-IT-STORAGE';

export default class HistoryStorage {
  private storage: Storage;

  constructor(storage: Storage[]) {
    this.storage = storage.find(function (storage) {
      return storage != null;
    });
  }

  get(): string[] {
    if (this.storage == null) {
      return [];
    }
    var history = this.storage.getItem(KEY);
    if (history == null) {
      return [];
    }
    return JSON.parse(history);
  }

  add(message: string) {
    if (this.storage == null) {
      return;
    }
    const history = this.get();
    history.unshift(message);
    this.storage.setItem(KEY, JSON.stringify(history));
  }
}
