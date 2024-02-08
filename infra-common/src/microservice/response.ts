export class MicroserviceResponse<T> {
  constructor(partial: Partial<MicroserviceResponse<T>>) {
    Object.assign(this, partial);
  }

  success!: boolean;

  data!: T;

  message!: string;

  statusCode!: number;
}
