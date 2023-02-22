# vite-plugin-solid-image

## What it does?

This plugin automates my [solid-image package](https://www.npmjs.com/package/solid-image) for vite.

## Example

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

export default function Pic() {
  return (
    <>
      <h1 class={styles.pic}>Pic Component</h1>
      {createImages([
        '/public/phone/phone.png/phone.png?w=120&f=avif;webp&media=(max-width: 500px)',
        '/public/phone/phone.png/phone.png?w=125&f=avif;webp&media=(max-width: 1000px)',
        '/public/phone/phone.png/phone.png?w=155&f=avif;webp&media=(min-width: 1001px)',
      ])}
    </>
  );
}
```

- this plugin only looks for `.jsx, tsx` files in the `src` folder.

### Comments

- `{/* { createImages(...) } */}` // will not be processed.
- it's better to remove dead code to avoid problems.

### Image Location

- currently only the public folder is supported.
  - ex.. `public/phone/phone.png?w=20;120&f=avif;webp...`

### URL restrictions

- the url can only be in string format.
  - `public/phone/phone.png?w=20;120&f=avif;webp`

```tsx
<Image src={'/public/phone/phone.png?w=50;100;150&f=avif'} />
// for Art direction use Array
<Image
  src={[
    '/public/phone/phone.png?w=50;100;150&f=avif;webp',
    '/public/phone/phone.png?w=50;100;150&f=avif;webp',
    '/public/phone/phone.png?w=50;100;150&f=avif;webp',
  ]}
/>
```

# URL Options

- see: <https://github.com/webmastersmith/solid-image#url-options>
- progressBar and output to console.log are turned off by default.
  - to turn on:
    - `progressBar=true&print=true`
