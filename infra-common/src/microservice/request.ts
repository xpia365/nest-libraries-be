export class MicroserviceRequest<T> {
  constructor(partial: Partial<MicroserviceRequest<T>>) {
    Object.assign(this, partial);
  }

  id!: string;

  service!: string;

  pattern!: string;

  input!: T;
}
