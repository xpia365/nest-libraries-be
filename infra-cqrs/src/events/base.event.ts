import { Emitter } from './emiter.event';

export class BaseEvent<T> {
  private sender: Emitter;

  constructor(public readonly data: T) {
    this.sender = new Emitter(
      process.env.PACKAGE_NAME || '',
      process.env.PACKAGE_VERSION || '',
      process.env.MACHINE_ID || '',
    );
  }
}
