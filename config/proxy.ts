export default (host: string) => {
  console.log('host', host);
  return {
    '/api/auth-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/bct-service': {
      target: `http://${host}`,
      // pathRewrite: { '^/bct-service': '' },
      changeOrigin: true,
    },
    '/api/trade-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/pricing-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/report-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/market-data-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/quant-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/model-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/exchange-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/margin-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/trade-margin-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/account-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/scenario-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/reference-data-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/user-preference-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/document-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/download-file': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/api/workflow-service': {
      target: `http://${host}`,
      pathRewrite: { '^/api/workflow-service': '' },
      changeOrigin: true,
    },
    '/api/airflow-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/bct': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/pybct': {
      target: `http://${host}:80`,
      changeOrigin: true,
    },
    '/swap-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
    '/adapter-service': {
      target: `http://${host}`,
      changeOrigin: true,
    },
  };
};
