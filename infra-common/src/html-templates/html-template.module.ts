import { DynamicModule, Global, Module } from '@nestjs/common';

import { EMAIL_TEMPLATE_MODULE_PROVIDER } from './html-template.const';
import { HtmlTemplateService } from './html-template.service';
import { HtmlTemplateOptions } from './html-template.interface';

@Global()
@Module({})
export class HtmlTemplateModule {
  static register(options: HtmlTemplateOptions): DynamicModule {
    return {
      module: HtmlTemplateModule,
      providers: [
        {
          provide: EMAIL_TEMPLATE_MODULE_PROVIDER,
          useValue: options,
        },
        HtmlTemplateService,
      ],
      exports: [HtmlTemplateService],
    };
  }
}
