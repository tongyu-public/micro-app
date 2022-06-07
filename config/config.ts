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
      alias: {
        '@ty-swap-pages/utils': path.join(__dirname, '../src/packages/utils/src/index'),
        '@ty-swap-pages/base': path.join(__dirname, '../src/packages/base/src/index'),
        '@ty-swap-pages/provider': path.join(__dirname, '../src/packages/provider/src/index'),
        '@ty-swap-pages/io-component': path.join(
          __dirname,
          '../src/packages/io-component/src/index',
        ),
        '@ty-swap-pages/services': path.join(__dirname, '../src/packages/services/src/index'),
        '@ty-swap-pages/fields': path.join(__dirname, '../src/packages/fields/src/index'),
        '@ty-swap-pages/page-swap-booking': path.join(
          __dirname,
          '../src/packages/page-swap-booking/src/index',
        ),
        '@ty-swap-pages/page-swap-position-detail': path.join(
          __dirname,
          '../src/packages/page-swap-position-detail/src/index',
        ),
        '@ty-swap-pages/core': path.join(__dirname, '../src/packages/core/src/index'),
        '@ty-swap-pages/services-swap': path.join(
          __dirname,
          '../src/packages/services-swap/src/index',
        ),
        '@ty-swap-pages/page-source-manage': path.join(
          __dirname,
          '../src/packages/page-source-manage/src/index',
        ),
        '@ty-swap-pages/page-one-click-execution': path.join(
          __dirname,
          '../src/packages/page-one-click-execution/src/index',
        ),
        '@ty-swap-pages/containers': path.join(__dirname, '../src/packages/containers/src/index'),
        '@ty-swap-pages/design-operations': path.join(
          __dirname,
          '../src/packages/design-operations/src/index',
        ),
        '@ty-swap-pages/services-option': path.join(
          __dirname,
          '../src/packages/services-option/src/index',
        ),
        '@ty-swap-pages/global': path.join(__dirname, '../src/packages/global/src/index'),
        '@ty-swap-pages/page-frame-valuation-report': path.join(
          __dirname,
          '../src/packages/page-frame-valuation-report/src/index',
        ),
        '@ty-swap-pages/page-swap-contract-detail-report': path.join(
          __dirname,
          '../src/packages/page-swap-contract-detail-report/src/index',
        ),
        '@ty-swap-pages/page-pnl-reports': path.join(
          __dirname,
          '../src/packages/page-pnl-reports/src/index',
        ),
        '@ty-swap-pages/page-risk-reports': path.join(
          __dirname,
          '../src/packages/page-risk-reports/src/index',
        ),
        '@ty-swap-pages/page-swap-customer-valuation-report': path.join(
          __dirname,
          '../src/packages/page-swap-customer-valuation-report/src/index',
        ),
        '@ty-swap-pages/page-swap-subject-valuation-report': path.join(
          __dirname,
          '../src/packages/page-swap-subject-valuation-report/src/index',
        ),
        '@ty-swap-pages/page-swap-dividend-management': path.join(
          __dirname,
          '../src/packages/page-swap-dividend-management/src/index',
        ),
        '@ty-swap-pages/page-swap-margin-manage': path.join(
          __dirname,
          '../src/packages/page-swap-margin-manage/src/index',
        ),
        '@ty-swap-pages/page-system-settings': path.join(
          __dirname,
          '../src/packages/page-system-settings/src/index',
        ),
        '@ty-swap-pages/page-valuation-management': path.join(
          __dirname,
          '../src/packages/page-valuation-management/src/index',
        ),
        '@ty-swap-pages/page-water-recording-management': path.join(
          __dirname,
          '../src/packages/page-water-recording-management/src/index',
        ),
        '@ty-swap-pages/page-swap-submitted': path.join(
          __dirname,
          '../src/packages/page-swap-submitted/src/index',
        ),
        '@ty-swap-pages/page-life-cycle-overview': path.join(
          __dirname,
          '../src/packages/page-life-cycle-overview/src/index',
        ),
        '@ty-swap-pages/page-event-reminder': path.join(
          __dirname,
          '../src/packages/page-event-reminder/src/index',
        ),
        '@ty-swap-pages/page-inchange-in-real-time': path.join(
          __dirname,
          '../src/packages/page-inchange-in-real-time/src/index',
        ),
        '@ty-swap-pages/page-risk-control-quota-allocation': path.join(
          __dirname,
          '../src/packages/page-risk-control-quota-allocation/src/index',
        ),
        '@ty-swap-pages/page-custom-fields': path.join(
          __dirname,
          '../src/packages/page-custom-fields/src/index',
        ),
        '@ty-swap-pages/page-swap-position-list': path.join(
          __dirname,
          '../src/packages/page-swap-position-list/src/index',
        ),
        '@ty-swap-pages/page-swap-contract-source-manage': path.join(
          __dirname,
          '../src/packages/page-swap-contract-source-manage/src/index',
        ),
        '@ty-swap-pages/page-sales-manage': path.join(
          __dirname,
          '../src/packages/page-sales-manage/src/index',
        ),
        '@ty-swap-pages/page-party-review-records': path.join(
          __dirname,
          '../src/packages/page-party-review-records/src/index',
        ),
        '@ty-swap-pages/page-account-capital-allocation': path.join(
          __dirname,
          '../src/packages/page-account-capital-allocation/src/index',
        ),
        '@ty-swap-pages/page-swap-general-contract-create': path.join(
          __dirname,
          '../src/packages/page-swap-general-contract-create/src/index',
        ),
        '@ty-swap-pages/page-swap-frame-contract-create': path.join(
          __dirname,
          '../src/packages/page-swap-frame-contract-create/src/index',
        ),
        '@ty-swap-pages/page-field-precision-manage': path.join(
          __dirname,
          '../src/packages/page-field-precision-manage/src/index',
        ),
        '@ty-swap-pages/helpers': path.join(__dirname, '../src/packages/helpers/src/index'),
      },
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
