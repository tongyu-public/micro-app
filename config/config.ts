// https://umijs.org/config/
import { defineConfig } from 'umi';

import proxy from './proxy';
import routes from './routes';
import fs from 'fs';
import path from 'path';
import settings from './settings.json';

const { OPEN_API } = process.env;
const {
  services,
  hosts,
  proxy: { applyHost = 'dev' },
} = settings;

const getOpenapiConfigs = () => {
  return Object.keys(services)
    .filter((key) => !services[key].skip)
    .map((key) => {
      const config = services[key];

      const getSwaggerJSONPath = () => {
        const localSchemaPath = path.join(
          process.cwd(),
          'swagger-jsons',
          `${config.name}-services.json`,
        );
        if (fs.existsSync(localSchemaPath)) {
          return localSchemaPath;
        }

        const host = (() => {
          if (config.proxy?.applyHost) {
            return hosts[config.proxy.applyHost];
          }
          return hosts[applyHost];
        })();

        return `http://${host}:${config.swaggerPort}/v3/api-docs`;
      };

      if (config.openapi === false) {
        return false;
      }
      return {
        requestLibPath: settings.requestLibPath,
        schemaPath: getSwaggerJSONPath(),
        projectName: config.name,
        apiPrefix: `"${config.apiPrefix ?? key}"`,
        namespace: `${config.name[0].toUpperCase()}${config.name.slice(1)}ServicesAPI`,
        hook: {
          customFunctionName: (data: { tags: string[]; operationId: string }) => {
            if (!Array.isArray(data.tags) || data.tags.length !== 1) {
              throw new Error('tags must be array with one element');
            }

            if (
              data.operationId.match(/_[0-9]+$/) ||
              [
                'import',
                'export',
                'delete',
                'break',
                'else',
                'new',
                'var',
                'case',
                'finally',
                'return',
                'void',
                'catch',
                'for',
                'switch',
                'while',
                'continue',
                'function',
                'this',
                'with',
                'default',
                'if',
                'throw',
                'in',
                'try',
                'do',
                'instranceof',
                'typeof',
              ].includes(data.operationId)
            ) {
              return `${data.tags[0].replace(/-([a-z])/g, (__, letter) => {
                return letter.toUpperCase();
              })}${data.operationId
                .replace(/_[0-9]+$/, '')
                .replace(/^\w/, (item) => item.toUpperCase())}`.replace(/^\w/, (item) =>
                item.toLowerCase(),
              );
            }

            return data.operationId;
          },
        },
      };
    })
    .filter(Boolean);
};

export default OPEN_API
  ? defineConfig({
      openAPI: getOpenapiConfigs(),
    })
  : defineConfig({
      qiankun: {
        slave: {},
      },
      hash: true,
      // https://umijs.org/zh-CN/plugins/plugin-locale
      locale: {
        // default zh-CN
        default: 'zh-CN',
        antd: true,
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loading: '@ant-design/pro-layout/es/PageLoading',
      },
      targets: {
        ie: 11,
      },
      routes,
      esbuild: {},
      title: false,
      ignoreMomentLocale: true,
      proxy: proxy(hosts[applyHost]),
      base: '/',
      publicPath: '/',
      fastRefresh: {},
      nodeModulesTransform: { type: 'none' },
      // mfsu: {},
      webpack5: {},
      // exportStatic: {},
      extraBabelPlugins: [
        [
          'import',
          {
            libraryName: '@ty/antd',
            libraryDirectory: 'es',
            style: true,
          },
          'antd',
        ],
      ],
      externals: {
        xlsx: 'window.XLSX',
        'ag-grid-enterprise': 'window.agGrid',
        'd3-scale': 'd3',
      },
      headScripts: [
        {
          src: '/xlsx.full.min.js',
        },
        {
          src: '/ag-grid-enterprise.min.js',
        },
        { src: '/d3-array.min.js' },
        { src: '/d3-color.min.js' },
        { src: '/d3-format.min.js' },
        { src: '/d3-interpolate.min.js' },
        { src: '/d3-time.min.js' },
        { src: '/d3-time-format.min.js' },
        { src: '/d3-scale.min.js' },
      ],
    });
