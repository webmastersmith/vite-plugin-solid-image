# vite-plugin-solid-image

# This plugin is under construction and not yet working.

## What it does?

This plugin automates my `solid-image` package for vite. I built this for plugin for solid-start framework.

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
        'src/components/Pic/phone.png?w=20;120&f=avif;webp&progressBar=false&print=false&media=(min-width: 1px)',
        'src/components/Pic/phone.png?w=25;125&f=avif;webp&progressBar=false&print=false&media=(min-width: 1px)',
        'src/components/Pic/phone.png?w=55;155&f=avif;webp&progressBar=false&print=false&media=(min-width: 1px)',
      ])}
    </>
  );
}
```

### Folder Structure

```txt
- root
  - src
    - components
    - routes
    - ...
```

- this plugin only look for `.jsx, tsx` files in the `src` folder.

### Comments

- `{/* { createImages(...) } */}` // will not be processed.

### URL restrictions

- the url can only be in string format.
  - `'src/components/Pic/phone.png?w=20;120&f=avif;webp`
- image paths must be relative to root.
- **src folder**
  - `src/yourFolderPath/imageName.jpg`
- **public folder**
  - `public/yourFolderPath/imageName.jpg`

```tsx
<Image src={'src/components/Pic/phone.png?w=50;100;150&f=avif&progressBar=false'} />
// or
<Image
  src={[
    'src/components/Pic/phone.png?w=50;100;150&f=avif;webp&progressBar=false',
    'src/components/Pic/phone.png?w=50;100;150&f=avif;webp&progressBar=false',
    'src/components/Pic/phone.png?w=50;100;150&f=avif;webp&progressBar=false',
  ]}
/>
```

# URL Options

- see: <https://github.com/webmastersmith/solid-image#url-options>
- progressBar and output to console.log are turned off by default.
  - to turn on:
    - `progressBar=true&print=true`
