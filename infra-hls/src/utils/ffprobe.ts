import { FFpRobe } from './args.interface';

export const getFfpRobe = (ffprobe: Partial<FFpRobe>): string => {
  const { v, select_streams, show_entries, of, i, p } = ffprobe;
  return `ffprobe ${v} ${select_streams} ${show_entries} ${of} ${p} ${i}`;
};
