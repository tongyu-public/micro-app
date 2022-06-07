declare const Settings: {
  requestLibPath: string;
  services: Record<
    string,
    {
      proxy: {
        pathRewrite?: boolean;
        applyHost?: string;
      };
      swaggerPort: number;
      name: string;
      description: string;
      openapi?: boolean;
    }
  >;
  hosts: Record<string, string>;
  proxy: {
    applyHost: string;
  };
};
export default Settings;
