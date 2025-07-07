import { defineNitroConfig } from 'nitropack'

export default defineNitroConfig({
  output: {
    dir: 'dist',
    serverDir: 'dist/server',
    publicDir: 'dist/public',
  },
})
