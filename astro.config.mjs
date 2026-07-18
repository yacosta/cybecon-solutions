import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.cyberconsolutions.com",
  vite: {
    plugins: [tailwindcss()]
  }
});
