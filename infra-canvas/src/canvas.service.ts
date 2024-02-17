import { Injectable } from '@nestjs/common';
import { fabric } from 'fabric';
import { v4 as uuidv4 } from 'uuid';

import { BackgroundPro } from './objects';
import { ObjectGroup, ObjectItem } from './constants';
import { jsonToString } from './utils';

(fabric as any).BackgroundPro = BackgroundPro;

@Injectable()
export class CanvasService {
  async renderPng(objects: any) {
    const canvas = new fabric.Canvas(null, {
      allowTouchScrolling: true,
      renderOnAddRemove: true,
    });
    const uuid = uuidv4();
    const accumulator: ObjectGroup = {};
    const dataUrls = [];

    objects.forEach((currentValue: ObjectItem) => {
      const { type } = currentValue;
      if (type === 'backgroundPro') {
        canvas.width = currentValue.width;
        canvas.height = currentValue.height;
        currentValue.uuid = uuid;
        currentValue.formatImg = 'png';
      }
      accumulator[type] = accumulator[type] || [];
      accumulator[type].push(currentValue);
    });

    const objsConvert: ObjectItem[] = Object.values(accumulator).flat();

    objsConvert.forEach((item) => {
      switch (item.type) {
        case 'backgroundPro':
          if (item.src) dataUrls.push(item.src);
          break;

        default:
          break;
      }
    });
    objsConvert[0].urls = dataUrls;
    canvas.loadFromJSON(jsonToString(objsConvert), () => {});
  }
}
