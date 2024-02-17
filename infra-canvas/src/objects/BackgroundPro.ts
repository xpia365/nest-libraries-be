import { fabric } from 'fabric';
import { Image } from 'canvas';

const BackgroundPro = fabric.util.createClass(fabric.Rect, {
  type: 'backgroundPro',
  _prevObjectStacking: null,
  image: null,
  rangeLeft: 0,
  rangeTop: 0,
  rangeAngle: 0,
  canvas: fabric.Canvas,

  initialize(rectOptions) {
    rectOptions || (rectOptions = {});

    this.on('added', () => {
      let imgSrc =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
      const center = this.canvas.getCenter();
      // this.top = center.top;
      // this.left = center.left;
      if (rectOptions.src) {
        imgSrc = rectOptions.src;
      }
      fabric.Image.fromURL(imgSrc, (myImg) => {
        if (rectOptions.src) {
          myImg.set({
            originX: 'center',
            originY: 'center',
            width: myImg.width,
            height: myImg.height,
            crossOrigin: 'anonymous',
          });

          if (myImg.width >= myImg.height) {
            this.canvas.setViewportTransform([
              this.canvas.width / myImg.width, // scaleX
              0, // skewX
              0, //skewY
              this.canvas.width / myImg.width, // scaleY
              center.left,
              center.top,
            ]);
          } else {
            this.canvas.setViewportTransform([
              this.canvas.height / myImg.height,
              0,
              0,
              this.canvas.height / myImg.height,
              center.left,
              center.top,
            ]);
          }
        } else {
          myImg.set({
            originX: 'center',
            originY: 'center',
            width: rectOptions.width || 1181.1,
            height: rectOptions.height || 1181.1,
            crossOrigin: 'anonymous',
          });

          const filter = new fabric.Image.filters.BlendColor({
            color: rectOptions.fill || '#fff',
            mode: 'tint',
          });
          myImg.filters.push(filter);
          myImg.applyFilters();

          if (myImg.width < myImg.height) {
            this.canvas.setViewportTransform([
              this.canvas.width / myImg.width,
              0,
              0,
              this.canvas.width / myImg.width,
              center.left,
              center.top,
            ]);
          } else {
            this.canvas.setViewportTransform([
              this.canvas.height / myImg.height,
              0,
              0,
              this.canvas.height / myImg.height,
              center.left,
              center.top,
            ]);
          }
        }

        const loadImage = rectOptions.urls.map((item) => {
          return new Promise((res, rej) => {
            const image = new Image();
            image.onload = () => {
              res(true);
            };

            image.onerror = () => {
              rej(false);
            };

            image.src = item;
          });
        });

        Promise.all(loadImage)
          .then(() => {
            console.log(
              this.canvas.toDataURL({ format: 'png' }),
              '=================',
            );
          })
          .catch((err) => {
            console.log(err, '===');
          });

        this.canvas.setBackgroundImage(
          myImg,
          this.canvas.renderAll.bind(this.canvas),
        );
      });
    });

    this.on('removed', () => {
      this.canvas.remove(this.text);
    });

    this.on('scaling', () => {
      this.strokeWidth = 0;
      this.stroke = '#333';

      this.image && this.recalcImage();
      if (this.images) this.image.top = this.top;
    });

    this.on('scaled', (e: any) => {
      this.width = Math.round(e.target.width * e.target.scaleX);
      this.height = Math.round(e.target.height * e.target.scaleY);
      this.scaleX = 1;
      this.scaleY = 1;

      // set range left vs top before move
      this.rangeLeft = e.target.image?.left - this.left;
      this.rangeTop = e.target.image?.top - this.top;

      this.canvas?.renderAll();
    });

    this.on('mousedown:before', (event: any) => {
      this.selectable = true;
      this.evented = true;
      this.stroke = 'red';
      this.moveCursor = 'default';
      this.hoverCursor = 'default';
      // this.canvas.setActiveObject(this);
      if (this.image) {
        // set range left vs top before move
        this.rangeLeft = event.target.image?.left - this.left;
        this.rangeTop = event.target.image?.top - this.top;
        // this.rangeAngle = event.target.image?.angle - this.angle;

        this.image.selectable = false;
        this.image.evented = false;

        // this.canvas.setActiveObject(this);
        this.selectable = true;
      }
      this._prevObjectStacking = this.canvas.preserveObjectStacking;
      this.canvas.preserveObjectStacking = true;
      this.strokeWidth = 0;
      this.canvas?.renderAll();
    });

    this.on('mousedblclick', () => {
      this.canvas.centerObject(this);
      this.moveCursor = 'default';
      this.hoverCursor = 'default';
      return this.canvas?.renderAll();
    });

    this.on('selected', () => {
      this.selectable = true;
      this._prevObjectStacking = this.canvas.preserveObjectStacking;
      this.canvas.preserveObjectStacking = true;
      this.canvas?.renderAll();
    });

    this.on('deselected', () => {
      this.canvas.preserveObjectStacking = this._prevObjectStacking;
      this.strokeWidth = 0;
      this.canvas?.renderAll();
    });
  },

  setBackground: function (zoom: any) {
    const center = this.canvas.getCenter();

    this.canvas.zoomToPoint({ x: center.left, y: center.top }, zoom);

    return this.canvas?.renderAll();
  },

  // render
  _render(ctx) {
    this.callSuper('_render', ctx);
    ctx.save();
  },
});

BackgroundPro.fromObject = (options, callback) => {
  return callback(new BackgroundPro(options));
};

export { BackgroundPro };
