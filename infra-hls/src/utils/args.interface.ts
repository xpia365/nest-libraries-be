export interface FFmPegCmdOptions extends Record<string, string> {}

export interface FFpRobe {
  i: string;
  v: string;
  select_streams: string;
  show_entries: string;
  of: string;
  p: string;
}

export interface M3U8 {
  codec: string;
  start_number: string;
  hls_time: string;
  hls_list_size: string;
  f: string;
  i: string;
  o: string;
}
