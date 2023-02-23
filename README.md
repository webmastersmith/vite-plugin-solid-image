# vite-plugin-solid-image

## What it does?

This plugin automates my [solid-image](https://www.npmjs.com/package/solid-image) package for vite.

## Example

- this plugin only looks for `.jsx, .tsx` files in the `src` folder.
- **Image Location**
  - currently only the public folder is supported.
    - ex.. `public/phone/phone.png?w=20;120&f=avif;webp...`
- **URL restrictions**
  - the url can only be in string format.
    - `public/phone/phone.png?w=20;120&f=avif;webp`
- **URL Options**
  - see: [solid-image#url-options](https://github.com/webmastersmith/solid-image#url-options)
  - progressBar and print to console.log are turned off by default.
    - to turn on:
      - `progressBar=true`
      - `print=true`
- **Comments**
  - it's better to remove dead code to avoid problems.
  - `{/* { createImages(...) } */}` // will not be processed.

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
import { createImages } from 'solid-image';

export default function MyComponent() {
  return (
    <>
      <h1>MyComponent</h1>
      {createImages('/public/phone/phone.png/phone.png?w=120&f=avif;webp')}

      <p>Another Example</p>
      {createImages([
        '/public/phone/phone.png/phone.png?w=120&f=avif;webp&media=(max-width: 500px)',
        '/public/phone/phone.png/phone.png?w=125&f=avif;webp&media=(max-width: 1000px)',
        '/public/phone/phone.png/phone.png?w=155&f=avif;webp&media=(min-width: 1001px)',
      ])}
    </>
  );
}
```
