// vite.config.ts
import { defineConfig } from "file:///D:/evanto/New%20folder%20(3)/ebazer-tailwind-css-ecommerce-admin-template-2025-05-05-05-21-50-utc/razia%20user%20site/razia-chic-builder-main/node_modules/vite/dist/node/index.js";
import react from "file:///D:/evanto/New%20folder%20(3)/ebazer-tailwind-css-ecommerce-admin-template-2025-05-05-05-21-50-utc/razia%20user%20site/razia-chic-builder-main/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///D:/evanto/New%20folder%20(3)/ebazer-tailwind-css-ecommerce-admin-template-2025-05-05-05-21-50-utc/razia%20user%20site/razia-chic-builder-main/node_modules/lovable-tagger/dist/index.js";
import { visualizer } from "file:///D:/evanto/New%20folder%20(3)/ebazer-tailwind-css-ecommerce-admin-template-2025-05-05-05-21-50-utc/razia%20user%20site/razia-chic-builder-main/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
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
    mode === "development" && componentTagger(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxldmFudG9cXFxcTmV3IGZvbGRlciAoMylcXFxcZWJhemVyLXRhaWx3aW5kLWNzcy1lY29tbWVyY2UtYWRtaW4tdGVtcGxhdGUtMjAyNS0wNS0wNS0wNS0yMS01MC11dGNcXFxccmF6aWEgdXNlciBzaXRlXFxcXHJhemlhLWNoaWMtYnVpbGRlci1tYWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxldmFudG9cXFxcTmV3IGZvbGRlciAoMylcXFxcZWJhemVyLXRhaWx3aW5kLWNzcy1lY29tbWVyY2UtYWRtaW4tdGVtcGxhdGUtMjAyNS0wNS0wNS0wNS0yMS01MC11dGNcXFxccmF6aWEgdXNlciBzaXRlXFxcXHJhemlhLWNoaWMtYnVpbGRlci1tYWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9ldmFudG8vTmV3JTIwZm9sZGVyJTIwKDMpL2ViYXplci10YWlsd2luZC1jc3MtZWNvbW1lcmNlLWFkbWluLXRlbXBsYXRlLTIwMjUtMDUtMDUtMDUtMjEtNTAtdXRjL3JhemlhJTIwdXNlciUyMHNpdGUvcmF6aWEtY2hpYy1idWlsZGVyLW1haW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjo6XCIsXG4gICAgcG9ydDogNTE3MyxcbiAgICBobXI6IHtcbiAgICAgIG92ZXJsYXk6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgICB2aXN1YWxpemVyKHtcbiAgICAgIG9wZW46IHRydWUsXG4gICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgIGJyb3RsaVNpemU6IHRydWUsXG4gICAgfSlcbiAgXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcWxCLFNBQVMsb0JBQW9CO0FBQ2xuQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBQ2hDLFNBQVMsa0JBQWtCO0FBSjNCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0gsU0FBUztBQUFBLElBQ1g7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTLGlCQUFpQixnQkFBZ0I7QUFBQSxJQUMxQyxXQUFXO0FBQUEsTUFDVCxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixZQUFZO0FBQUEsSUFDZCxDQUFDO0FBQUEsRUFDSCxFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
