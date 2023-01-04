import type { AstroIntegration } from 'astro';
import fastGlob from 'fast-glob';
import fs from 'fs';
import { join } from 'path';


const currentConfig = {
  fileName: 'offline-cached-list.json',
  cssPattern: '**/*.css',
  imagePattern: '',
};

export const cacheSwAstroPlugin = (conf: Partial<typeof currentConfig> = {}): AstroIntegration => {
  Object.assign(currentConfig, conf);

  return {
    name: 'CacheSW',
    hooks: {
      'astro:build:done': async (options) => {
        const pages: string[] = [];

        options.routes.forEach(route => {
          pages.push(route.route);
        });

        const resultData = {
          pages,
          images: await getFilesByPatten(options.dir.pathname, currentConfig.imagePattern),
          styles: await getFilesByPatten(options.dir.pathname, currentConfig.cssPattern),
          otherFiles: [],
        };

        await writeFile(
          join(options.dir.pathname, currentConfig.fileName),
          resultData
        );
      },
    },
  };
};

async function getFilesByPatten(dir: string, pattern: string): Promise<string[]> {
  if (!pattern) {
    return [];
  }

  const files = await fastGlob(`${dir}${pattern}`);

  if (!files?.length) {
    return [];
  }

  return files.map(file => {
    return file.replace(dir, '');
  });
}


async function writeFile(filePath: string, data: any) {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data), 'utf-8');

    console.log(`File '${currentConfig.fileName}' written successfully`);
  } catch (err) {
    console.error(err);
  }
}
