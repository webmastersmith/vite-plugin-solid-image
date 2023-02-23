import { createImages as Images } from 'solid-image';
import path from 'node:path';
import fs from 'fs';
export default Images;

export function solidImage() {
  return {
    name: 'vite-plugin-solid-image', // this name will show up in warnings and errors
    async load(id: string) {
      const basePath = path.join(process.cwd(), 'src');
      if (id.includes(basePath)) {
        return parseFile(id);
      }
      return;
    },
  };
}

async function parseFile(id: string) {
  // only js, jsx, ts, tsx files
  if (/[jt]sx$/i.test(id)) {
    // file is (tj)sx read it for 'Image'
    let file = fs.readFileSync(id, 'utf-8');

    // look for this pattern.
    let solidImageRegex = new RegExp('import .*?createImages.*', 'ig');
    // check if 'import solid-image' is in file.
    if (solidImageRegex.test(file)) {
      // console.log(file);
      // lookbehind to ignore commented out code.
      const createImagesRegex = new RegExp(/(?<!\{\/\*.?){createImages(.*?)}/is);
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
          .replaceAll(/[^-_a-zA-Z0-9:;,=\/&?.]/gi, '')
          .split(',')
          .reduce((a: string[], b: string) => {
            // remove empty strings.
            if (b) {
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

        const img = await Images(urlFix);
        // console.log('return createImages', img);
        file = front + `\n${img}\n` + back;
        // reduce count
        count--;
      }
      file = file.replaceAll(solidImageRegex, '');
      // console.log(file);
      return file;
    }
    return;
  }
  return;
}
