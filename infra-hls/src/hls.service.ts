import { exec } from 'child_process';
import { Injectable } from '@nestjs/common';
import {
  arrayToString,
  ffmPegCmdOptions,
  getFfpRobe,
  getHlsM3u8Cmd,
  jsonParse,
  selectEntries,
} from './utils';

@Injectable()
export class HlsService {
  async getFfpRobe(inputPath: string, options: (keyof typeof selectEntries)[]) {
    const { v, select_streams, show_entries, of, i, p } = ffmPegCmdOptions;
    const entries_value = arrayToString(options);

    const ffpRobeCmd = getFfpRobe({
      v,
      select_streams,
      show_entries: show_entries.replace('*', entries_value),
      of,
      p,
      i: i.replace('*', inputPath),
    });

    return new Promise((resolve, reject) => {
      exec(ffpRobeCmd, (err, stdout: any) => {
        if (err) {
          return reject(err);
        }
        resolve(jsonParse(stdout)['streams'][0]);
      });
    });
  }

  async getHlsM3u8(inputPath: string, outputPath: string) {
    const { i, codec, start_number, hls_time, hls_list_size, f, o } =
      ffmPegCmdOptions;
    const m3U8Cmd = getHlsM3u8Cmd({
      i: i.replace('*', inputPath),
      codec,
      start_number,
      hls_list_size,
      hls_time,
      f,
      o: o.replace('*', outputPath),
    });

    return new Promise<number>((resolve, reject) => {
      exec(m3U8Cmd, (err, stdout) => {
        if (err) {
          return reject(err);
        }
        resolve(Number(stdout.trim()));
      });
    });
  }
}
