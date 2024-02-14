import { M3U8 } from './args.interface';

export const getHlsM3u8Cmd = (m3u8: Partial<M3U8>): string => {
  const { i, codec, start_number, hls_time, hls_list_size, f, o } = m3u8;
  return `ffmpeg ${i} ${codec} ${start_number} ${hls_time} ${hls_list_size} ${f} ${o}`;
};
