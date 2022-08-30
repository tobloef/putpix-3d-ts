import { Vector3 } from "./types";

export async function loadImage(src: string): Promise<ImageData> {
  const image = new Image();
  image.src = src;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d");

      if (ctx == null) {
        reject(new Error(`Failed to create canvas context.`));
        return;
      }

      ctx.drawImage(image, 0, 0, image.width, image.height);
      resolve(ctx.getImageData(0, 0, image.width, image.height));
    };
    image.onerror = () => {
      image.onerror = null;
      reject(new Error(`Failed to load image "${src}".`));
    }
  });
}

export type Bitmap = {
  width: number,
  height: number,
  pixels: Vector3[][]
};

function make2dArray<T>(width: number, height: number, defaultValue: T): T[][] {
  return [...new Array(width)].map(() => [...new Array(height)].map(() => defaultValue));
}

export function imageDataToBitmap(imageData: ImageData): Bitmap {
  const pixels = make2dArray<Vector3>(imageData.width, imageData.height, [0, 0, 0]);

  for (let i = 0; i < imageData.data.length; i += 4) {
    const x = (i / 4) % imageData.width;
    const y = ((i / 4) - x) / imageData.width;

    const color: Vector3 = [
      imageData.data[i],
      imageData.data[i + 1],
      imageData.data[i + 2],
    ];

    pixels[x][y] = color;
  }

  return {
    width: imageData.width,
    height: imageData.height,
    pixels,
  }
}