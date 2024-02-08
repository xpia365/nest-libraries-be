import { Inject, Injectable } from '@nestjs/common';
import Email from 'email-templates';
import * as path from 'path';

import { EMAIL_TEMPLATE_MODULE_PROVIDER } from './html-template.const';
import { HtmlTemplateOptions } from './html-template.interface';

export class HtmlTemplateContext<T> {
  language?: string = 'en';

  data!: T;
}

@Injectable()
export class HtmlTemplateService {
  private readonly email: Email;

  constructor(
    @Inject(EMAIL_TEMPLATE_MODULE_PROVIDER)
    private readonly options: HtmlTemplateOptions,
  ) {
    this.email = new Email({
      views: {
        options: {
          extension: 'ejs',
        },
        root: this.options.root,
      },
      getPath: (
        filename: string,
        template: string,
        locals: HtmlTemplateContext<unknown>,
      ): string => {
        const { language = 'en' } = locals;
        return path.join(
          this.options.templateDir,
          template,
          `${filename}.${language}`,
        );
      },
      juiceResources: {
        webResources: {
          relativeTo: path.join(this.options.root, this.options.templateDir),
        },
      },
    });
  }

  async render(
    templateName: string,
    context: HtmlTemplateContext<unknown>,
  ): Promise<Partial<Email.EmailMessage>> {
    return this.email.renderAll(templateName, context.data);
  }
}
