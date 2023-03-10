import { createImages } from 'solid-image';
import path from 'node:path';
import fs from 'fs';
export default function Images(props: string | string[]) {}

interface Options {
  files: string[];
  entrypoint?: string;
}
export function solidImage(options?: Options) {
  return {
    name: 'vite-plugin-solid-image', // this name will show up in warnings and errors
    async load(id: string) {
      let basePath = path.join(process.cwd(), 'src');
      if (options?.entrypoint) {
        basePath = path.join(process.cwd(), options.entrypoint);
      }
      if (id.includes(basePath)) {
        return await parseFile(id, options);
      }
      return;
    },
  };
}

async function parseFile(id: string, options?: Options) {
  // prettier-ignore
  let filesRegex = new RegExp('(\.[jt]sx|\.astro)$', 'i');
  if (options?.files) {
    // prettier-ignore
    filesRegex = new RegExp('('+options.files.join('|')+')' + '$', 'i');
  }
  // console.log(filesRegex);
  if (filesRegex.test(id)) {
    // file is (tj)sx read it for 'Image'
    let file = fs.readFileSync(id, 'utf-8');

    // look for this pattern.
    let solidImageRegex = new RegExp('import Images from .vite-plugin-solid-image..?', 'ig');
    // check if 'import Images from  'vite-plugin-solid-image'; exist.
    if (solidImageRegex.test(file)) {
      // console.log(file);
      // lookbehind to ignore commented out code.
      const createImagesRegex = new RegExp(/(?<!\{\/\*\s*?){\s*?Images(.*?)\s*?}/is);
      // console.log(createImagesRegex);
      // prevent runaway loop
      let count = 300;
      while (createImagesRegex.test(file) && count > 0) {
        const imageMatch = file.match(createImagesRegex)!;
        // console.log('imageMatch', imageMatch);
        const index = imageMatch.index!;
        const endIndex = index + imageMatch[0].length + 1;
        // console.log(index, endIndex);
        const front = file.slice(0, index);
        // console.log('front', front);
        const back = file.slice(endIndex, file.length);
        // console.log('back', back);
        // normalize urls, remove blank strings.
        const url = imageMatch[1]
          .replaceAll(/ {2,}/g, ' ') // remove two spaces together.
          .replaceAll(/[^-_a-zA-Z0-9:;,=\\/&?. ()\n!]/gi, '')
          .replace(/^\(/i, '')
          .replace(/\)$/i, '')
          .replaceAll(/,\s*?\n\s*?/gi, ',\n') // if space is after newline, remove.
          .split(',\n') // there can be a comma in media or sizes attribute. Split only after newline.
          .reduce((a: string[], b: string) => {
            // remove empty strings.
            b = b.trim();
            if (b) {
              b = b.replaceAll(/\n/g, ''); // remove leftover newlines.
              b = b.replaceAll(/ &|& /g, '&'); // remove leftover spaces between params.
              b = b.replaceAll(/\? | \?/g, '?'); // remove leftover space between query.
              a.push(b);
            }
            return a;
          }, []);
        // console.log(url);

        // test for turning on of print or progressBar
        const urlJoin = url.join('');
        const progressBar = `&progressBar=${/progressBar=true/.test(urlJoin)}`;
        const print = `&print=${/print=true/.test(urlJoin)}`;
        // loop each url and replace.
        const urlFix = url.map((u: string) => {
          // avoid making duplicate entries in the url.
          const _url = u
            .replaceAll(/&progressBar=(true|false)/gi, '')
            .replaceAll(/&print=(true|false)/gi, '');
          return _url + progressBar + print;
        });
        // console.log('urlFix', urlFix);

        let img = '<p>Something went wrong. Check console.log for error.</p>';
        try {
          img = await createImages(urlFix);
        } catch (error) {
          console.log('createImage Error: ', error);
        }

        file = front + `\n${img}\n` + back;
        // reduce count
        count--;
      } // end while loop
      file = file.replaceAll(solidImageRegex, '');
      // console.log(file);
      return file;
    }
    return;
  }
  return;
}
