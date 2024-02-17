import { Controller, Post } from '@nestjs/common';
import { CanvasService } from './canvas.service';
import { objects } from './utils/objects';

@Controller('canvas')
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  @Post()
  async renderPng() {
    return this.canvasService.renderPng(objects);
  }
}
