export class EventBus {
  constructor() {
    this.eventObject = {};
  }

  emit(eventName) {
    const callbackList = this.eventObject[eventName];

    if (!callbackList) return console.info(eventName + " not found!");
    for (let callback of callbackList) {
      callback();
    }
  }

  push(eventName, callback) {
    if (!this.eventObject[eventName]) {
      this.eventObject[eventName] = [];
    }
    this.eventObject[eventName].push(callback);
  }
}