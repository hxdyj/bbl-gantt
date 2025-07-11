import path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import strip from '@rollup/plugin-strip'
import pkg from './package.json'
import cleanPlugin from 'vite-plugin-clean'

export default defineConfig({
	publicDir: 'public-faker',
	build: {
		lib: {
			entry: path.resolve(__dirname, './package/index.ts'),
			name: pkg.name,
			fileName: format => `index.${format}.js`,
			cssFileName: 'style'
		},
		// rollupOptions: {
		// 	external: (id) => {
		// 		return Object.keys(pkg.dependencies).includes(id); // ESM 格式下设置外部依赖
		// 	},
		// 	output:{
		// 		globals:{
		// 			dayjs:'dayjs',
		// 			uid:'uid',
		// 			"@svgdotjs/svg.js":"svgjs"
		// 		},
		// 		exports:"named"
		// 	}
		// },
		minify: false
	},
	plugins: [
		cleanPlugin({
			targetFiles: ['./dist', './types'],
		}),
		strip({ include: '**/*.(js|ts)' }),
		dts({
			outDir: path.resolve(__dirname, './types'),
			root: path.resolve(__dirname, './package'),
			include: [path.resolve(__dirname, './package') + '/**/*'],
			tsconfigPath: path.resolve(__dirname, './tsconfig.node.json')
		}),
	],
})
