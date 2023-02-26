# vite-plugin-solid-image

## What it does?

This plugin automates my [solid-image](https://www.npmjs.com/package/solid-image) package for vite.
The final output code replaces all `Images` functions with `img` or `picture` elements. There is no trace of `solid-image` after `dev` or `prod` build.

## How does it work?

The **Images** function is never called. It is simply a placeholder, so regex can find it and extract the arguments, then replace the **Images** function with the `img` or `picture` element. Because this process is static, dynamic code will not work. **You cannot use variables as arguments in the Images function.**

The first time you run the code, the images will be created. This process can take a few seconds, up to a few minutes, depending on how many images your creating. During the creation phase, the images may appear broken. Wait until the images are created, and reload the page to refresh.

If you would like feedback during image creation, add `progressBar=true` to your argument. After image creation, you can delete this.
ex.. `public/phone.png?w=20&f=avif&progressBar=true`

## Install

- `npm i -D vite-plugin-solid-image`

## Folder, File and Argument Naming

- allowed characters -no spaces in **folder, file and Images argument** names.
- `- _ a-z A-Z 0-9 : ; , = \ / & ? .`

## Astro Example

- see below 👇

## Example

- This plugin only looks for `.jsx`, `.tsx` and `.astro` files in the `src` folder.
- **Image Location**
  - currently **only the public folder is supported**.
    - ex.. `public/phone/phone.png?w=20;120&f=avif;webp...`
- **URL restrictions**
  - the url can only be in string format.
    - ex.. `public/phone/phone.png?w=20;120&f=avif;webp`
  - The regex to split the url is: `,\n` (comma followed by a newline). Be careful of your formatter removing newlines when you have short lines of text.
    - ex .. `{Images(['/public/phone.png?', '/public/phone.png?'])}`
      - // will not work! Must have newline between urls.
- **URL Options**
  - see: [solid-image#url-options](https://github.com/webmastersmith/solid-image#url-options)
  - **clean** be careful **using the same image multiple times** and turning on `clean=true`. It can delete other sizes from previous **Images** functions.
  - **progressBar** and **print to console.log** are turned **off** by default.
    - to turn on:
      - `progressBar=true`
      - `print=true`
- **Comments**
  - `{/* {Images(...)} */}` // will not be processed.
    - because regex is used to locate the **Images** function, it may still 'find' the code if it doesn't look exactly like the example 👆. Better to remove dead code and avoid problems.
- **Options**
  - an object that can be passed to `solidImage` vite function.
  - **files**
    - array of strings you can control what file types the plugin will read.
    - default: `.tsx, .jsx, .astro`
    - `solidImage({files: ['.tsx', '.mdx']})` // only `.tsx` and `.mdx` files will be read.
      - The `files` property overrides the default. Only what you pass in will be read.

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

      <p>Multi Line Example with Template Strings.</p>
      <p>Don't accidentally add a comma to end of a line.</p>
      {Images(
        `public/phone/phone.png
        ?w=50;100;150
        &f=avif
        &alt=the image of champions
        &sizes=50px
        &progressBar=true
        &print=true`
      )}

      <p>Art Direction</p>
      {Images([
        '/public/phone/phone.png/phone.png?w=120&f=avif;webp&media=(max-width: 500px)',
        '/public/phone/phone.png/phone.png?w=125&f=avif;webp&media=(max-width: 1000px)',
        '/public/phone/phone.png/phone.png?w=155&f=avif;webp&media=(min-width: 1001px)',
      ])}

      <p>Art Direction with template strings</p>
      {Images([
        `/public/phone/phone.png
        ?w=500;1000
        &a=9:16
        &f=avif;webp
        &sizes=500px
        &media=(max-width: 500px) 100vw`,

        `/public/phone/phone-square.png
        ?w=350;600
        &a=3:4
        &f=avif;webp
        &sizes=350px
        &media=(max-width: 700px) 50vw`,

        `public/phone/phone-wide.png
        ?w=250;500;750
        &a=16:9
        &f=avif;webp
        &alt=this is a image of a phone.
        &fallbackFormat=jpg
        &fallbackWidth=250
        &sizes=250px
        &media=(min-width: 1000px) 25vw`,
      ])}
    </>
  );
}
```

## Astro Example

**astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import { solidImage } from 'vite-plugin-solid-image';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [solidImage()],
  },
});
```

**src/pages/index.astro**

```astro
---
import Layout from '../layouts/Layout.astro';
import Images from 'vite-plugin-solid-image';
---

<Layout title="Welcome to Astro.">
	<main>
		<h1>Template String & Tailwindcss Example</span></h1>
		{Images(
			`public/phone.png
      ?w=100;400;200
			&c=bg-green-300 basis-1/4 !font-medium
			&className=false
			&f=avif;webp`
		)}
	</main>
</Layout>
```

## Problems

![images not defined](https://github.com/webmastersmith/vite-plugin-solid-image/blob/main/images/images-not-defined.png)

- if you get this error, it is because the regex missed your **Images** function. Make sure it has the **same spacing** as the example 👆.
- If your images are not coming out correctly, double check syntax and make sure all **`&`** and **`?`** are in place and there are no accidental commas.

## License

Published under the MIT license. © Bryon Smith 2023.
