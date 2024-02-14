import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { HlsService } from './hls.service';
import path from 'path';
import { selectEntries } from './utils';

@Module({
  providers: [HlsService],
  exports: [HlsService],
})
export class HlsModule implements OnApplicationBootstrap {
  constructor(private readonly hlsService: HlsService) {}

  async onApplicationBootstrap() {
    // const data = await this.hlsService.getFfpRobe(
    //   '/home/luandev/Downloads/FE/RxJSBasics/ua-rxjsbcnewr/lesson1.mp4',
    //   ['index', 'width', 'bit_rate', 'height', 'codec_name'],
    // );
    // await this.hlsService.getHlsM3u8(
    //   '/home/luandev/Downloads/FE/RxJSBasics/ua-rxjsbcnewr/lesson1.mp4',
    //   path.join('hls', 'output'),
    // );
    // console.log(data, 'hls');
  }
}
