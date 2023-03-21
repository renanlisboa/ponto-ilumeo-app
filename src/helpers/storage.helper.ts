export class StorageHelper {
  getLocal(key: string) {
    return localStorage.getItem(key);
  }

  setLocal(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  removeLocal(key: string) {
    localStorage.removeItem(key);
  }

  getSession(key: string) {
    return sessionStorage.getItem(key);
  }

  setSession(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  removeSession(key: string) {
    sessionStorage.removeItem(key);
  }
}
