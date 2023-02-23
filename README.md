# vite-plugin-solid-image

## What it does?

This plugin automates my [solid-image](https://www.npmjs.com/package/solid-image) package for vite.
The final output code replaces all `Image` functions with `img` or `picture` elements. There is no trace of `solid-image` after `dev` or `prod` build.

## How does it work?

The **Image** function is never called. It is simply a placeholder, so regex can find it and extract the arguments, then replace the **Image** function with the `img` or `picture` element. Because this process is static, dynamic code will not work. **You cannot use variables as arguments in the Image function.**

The first time you run the code, the images will be created. This process can take a few seconds, up to a few minutes, depending on how many images your creating. During the creation phase, the images may appear broken. Wait until the images are created, and reload the page to refresh.

If you would like feedback during image creation, add `progressBar=true` to your argument. After image creation, you can delete this. ex.. `public/phone.png?w=20&f=avif&progressBar=true`

## Install

- `npm i -D vite-plugin-solid-image`

## Folder, File and Argument Naming

- allowed characters -no spaces in **folder, file and Image argument** names.
- `- _ a-z A-Z 0-9 : ; , = \ / & ? .`

## Example

- This plugin only looks for `.jsx` or `.tsx` files in the `src` folder.
- **Image Location**
  - currently **only the public folder is supported**.
    - ex.. `public/phone/phone.png?w=20;120&f=avif;webp...`
- **URL restrictions**
  - the url can only be in string format.
    - ex.. `public/phone/phone.png?w=20;120&f=avif;webp`
- **URL Options**
  - see: [solid-image#url-options](https://github.com/webmastersmith/solid-image#url-options)
  - **progressBar** and **print to console.log** are turned **off** by default.
    - to turn on:
      - `progressBar=true`
      - `print=true`
- **Comments**
  - `{/* {Images(...)} */}` // will not be processed.
    - because regex is used to locate the **Image** function, it may still 'find' the code if it doesn't look exactly like the example 👆. Better to remove dead code and avoid problems.

**vite.config.ts**

```ts
import { defineConfig } from 'vite';
import { solidImage } from 'vite-plugin-solid-image';

export default defineConfig({
  plugins: [solidImage()],
});
```

**YourFile.tsx**

```tsx
import Images from 'vite-plugin-solid-image';

export default function MyComponent() {
  return (
    <>
      <h1>MyComponent</h1>
      {Images('/public/phone/phone.png/phone.png?w=120&f=avif;webp')}

      <p>Another Example -Art Direction</p>
      {Images([
        '/public/phone/phone.png/phone.png?w=120&f=avif;webp&media=(max-width: 500px)',
        '/public/phone/phone.png/phone.png?w=125&f=avif;webp&media=(max-width: 1000px)',
        '/public/phone/phone.png/phone.png?w=155&f=avif;webp&media=(min-width: 1001px)',
      ])}
    </>
  );
}
```

## License

Published under the MIT license. © Bryon Smith 2023.
