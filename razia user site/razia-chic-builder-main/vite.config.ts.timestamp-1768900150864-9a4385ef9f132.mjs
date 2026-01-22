// vite.config.ts
import { defineConfig } from "file:///D:/evanto/New%20folder%20(3)/ebazer-tailwind-css-ecommerce-admin-template-2025-05-05-05-21-50-utc/razia%20user%20site/razia-chic-builder-main/node_modules/vite/dist/node/index.js";
import react from "file:///D:/evanto/New%20folder%20(3)/ebazer-tailwind-css-ecommerce-admin-template-2025-05-05-05-21-50-utc/razia%20user%20site/razia-chic-builder-main/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///D:/evanto/New%20folder%20(3)/ebazer-tailwind-css-ecommerce-admin-template-2025-05-05-05-21-50-utc/razia%20user%20site/razia-chic-builder-main/node_modules/lovable-tagger/dist/index.js";
import viteCompression from "file:///D:/evanto/New%20folder%20(3)/ebazer-tailwind-css-ecommerce-admin-template-2025-05-05-05-21-50-utc/razia%20user%20site/razia-chic-builder-main/node_modules/vite-plugin-compression/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\evanto\\New folder (3)\\ebazer-tailwind-css-ecommerce-admin-template-2025-05-05-05-21-50-utc\\razia user site\\razia-chic-builder-main";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    hmr: {
      overlay: false
    }
  },
  plugins: [
    react(),
    viteCompression(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-slot", "lucide-react"]
        }
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxldmFudG9cXFxcTmV3IGZvbGRlciAoMylcXFxcZWJhemVyLXRhaWx3aW5kLWNzcy1lY29tbWVyY2UtYWRtaW4tdGVtcGxhdGUtMjAyNS0wNS0wNS0wNS0yMS01MC11dGNcXFxccmF6aWEgdXNlciBzaXRlXFxcXHJhemlhLWNoaWMtYnVpbGRlci1tYWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxldmFudG9cXFxcTmV3IGZvbGRlciAoMylcXFxcZWJhemVyLXRhaWx3aW5kLWNzcy1lY29tbWVyY2UtYWRtaW4tdGVtcGxhdGUtMjAyNS0wNS0wNS0wNS0yMS01MC11dGNcXFxccmF6aWEgdXNlciBzaXRlXFxcXHJhemlhLWNoaWMtYnVpbGRlci1tYWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9ldmFudG8vTmV3JTIwZm9sZGVyJTIwKDMpL2ViYXplci10YWlsd2luZC1jc3MtZWNvbW1lcmNlLWFkbWluLXRlbXBsYXRlLTIwMjUtMDUtMDUtMDUtMjEtNTAtdXRjL3JhemlhJTIwdXNlciUyMHNpdGUvcmF6aWEtY2hpYy1idWlsZGVyLW1haW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbic7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogNTE3MyxcclxuICAgIGhtcjoge1xyXG4gICAgICBvdmVybGF5OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgdml0ZUNvbXByZXNzaW9uKCksXHJcbiAgICBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKClcclxuICBdLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxyXG4gICAgICAgICAgdWk6IFsnQHJhZGl4LXVpL3JlYWN0LWRpYWxvZycsICdAcmFkaXgtdWkvcmVhY3Qtc2xvdCcsICdsdWNpZGUtcmVhY3QnXVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFsQixTQUFTLG9CQUFvQjtBQUNsbkIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUNoQyxPQUFPLHFCQUFxQjtBQUo1QixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sZ0JBQWdCO0FBQUEsSUFDaEIsU0FBUyxpQkFBaUIsZ0JBQWdCO0FBQUEsRUFDNUMsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ2pELElBQUksQ0FBQywwQkFBMEIsd0JBQXdCLGNBQWM7QUFBQSxRQUN2RTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
