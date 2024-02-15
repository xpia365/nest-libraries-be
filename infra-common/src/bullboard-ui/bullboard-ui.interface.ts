export class BullBoardUiOptions {
  route: string;
  path!: string;
  username!: string;
  password!: string;
  secret!: string;
}

export interface BullBoardUiModuleAsyncOptions {
  route: string;
  useFactory?: (
    ...args: any[]
  ) => Promise<BullBoardUiOptions> | BullBoardUiOptions;
  inject?: any[];
}
