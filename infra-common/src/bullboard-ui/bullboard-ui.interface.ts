export class BullBoardUiOptions {
  routes!: string;
  path!: string;
  username!: string;
  password!: string;
  secret!: string;
}

export interface BullBoardUiModuleAsyncOptions {
  routes: string;
  useFactory?: (
    ...args: any[]
  ) => Promise<BullBoardUiOptions> | BullBoardUiOptions;
  inject?: any[];
}
