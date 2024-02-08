export class BullBoardUiOptions {
  routes!: string;
  path!: string;
  username!: string;
  password!: string;
  secret!: string;
}

export interface BullBoardUiModuleAsyncOptions {
  useFactory?: (
    ...args: any[]
  ) => Promise<BullBoardUiOptions> | BullBoardUiOptions;
  inject?: any[];
}
