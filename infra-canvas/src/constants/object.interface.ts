export interface ObjectItem {
  type: string;
  width: number;
  height: number;
  uuid?: string;
  formatImg?: string;
  src?: string;
  urls?: string[];
}

export interface ObjectGroup {
  [key: string]: ObjectItem[];
}
