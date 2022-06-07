/** actions 可以直接引用 index 内容 */
import type {
  OSCore,
  OSCustomFieldPureFormFieldItemConfigsType,
  OSCustomFieldPureTableFormFieldItemConfigsType,
  OSCustomFieldStaticPureFormFieldItemConfigsType,
  OSDialogModalOperationType,
  OSDialogModalType,
  OSFormAPI,
  OSFormType,
  OSTableRequestDataSourceParams,
  OSTableRequestDataSourceReturnType,
  OSTableType,
  OSTriggerButtonType,
  OSTriggerDropdownType,
  OSTriggerType,
  RecordType,
  RequestIO,
  RequiredRecursion,
  _OSFormType,
  _OSTableFormFieldItemSettingsFnOption,
  _OSTableType,
} from '@ty-one-start/one-start';
import type { AlertProps } from '@ty/antd';
import type { RcFile } from '@ty/antd/lib/upload';

export type OSActionsCreateAPI = OSFormAPI;

export interface _OSActionsCreateType<OSCustomFieldStaticPureTableFormFieldItemConfigsType>
  extends OSCore {
  settings?: {
    /**
     * 弹出框和直接展示
     * @default modal
     */
    type?: 'modal' | 'plain';
    /** 是否为复制合约 */
    copy?: boolean;
    /** 创建触发器的配置 */
    createTriggerSettings?: OSTriggerButtonType['settings'];
    /** 资源id */
    sourceId?: string;
    /** modal 反馈配置 */
    createModalDialogSettings?: OSDialogModalType['settings'];
    /** 表单配置 */
    createFormSettings?: _OSFormType<
      OSCustomFieldPureFormFieldItemConfigsType,
      OSCustomFieldStaticPureFormFieldItemConfigsType
    >['settings'];
    /**
     * 是否启用表单模板
     * @default false
     */
    enableTemplate?: boolean;
    /**
     * 是否启用编辑本地持久化
     * @default false
     */
    enablePersistence?: boolean;
    /** 创建模板的表单 */
    templateCreateFormSettings?: _OSFormType<
      OSCustomFieldPureFormFieldItemConfigsType,
      OSCustomFieldStaticPureFormFieldItemConfigsType
    >['settings'];
    /** 创建模板 modal 的配置 */
    templateCreateModalSettings?: OSDialogModalType['settings'];
    /** 模板设置的表格 */
    templateSearchTableSettings?: _OSTableType<
      OSCustomFieldStaticPureTableFormFieldItemConfigsType,
      OSCustomFieldPureTableFormFieldItemConfigsType,
      OSCustomFieldPureFormFieldItemConfigsType,
      OSCustomFieldStaticPureFormFieldItemConfigsType
    >['settings'];
  };
  requests?: {
    /** 创建资源请求 */
    requestCreateSource?: RequestIO<
      {
        values: RecordType;
        apis: OSActionsCreateAPI;
      },
      undefined
    >;
    /** 创建模板时的请求 */
    requestTemplateCreate?: RequestIO<{
      values: RecordType;
      createFormValues: RecordType;
      apis: OSActionsCreateAPI;
    }>;
    /** 请求所有模版列表 */
    requestTemplateList?: RequestIO<
      {
        apis: OSActionsCreateAPI;
      } & OSTableRequestDataSourceParams<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      OSTableRequestDataSourceReturnType<
        OSCustomFieldStaticPureTableFormFieldItemConfigsType,
        OSCustomFieldPureTableFormFieldItemConfigsType
      >
    >;
    /** 更新模板信息的请求 */
    requestUpdateTemplateInfo?: RequestIO<
      {
        values: RecordType;
        apis: OSActionsCreateAPI;
      } & _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      undefined
    >;
    /** 更新模板 values 内容 */
    requestUpdateTemplateValues?: RequestIO<
      {
        values: RecordType;
        templateId: string;
        apis: OSActionsCreateAPI;
      },
      undefined
    >;
    /** 删除模板的请求 */
    requestDeleteTemplate?: RequestIO<
      {
        apis: OSActionsCreateAPI;
      } & _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      undefined
    >;
    /** 请求模板详情的接口 */
    requestTemplateDataSource?: RequestIO<
      {
        apis: OSActionsCreateAPI;
      } & _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      RecordType
    >;
    /** 应用模板数据的接口 */
    requestApplayTemplateData?: RequestIO<
      {
        apis: OSActionsCreateAPI;
      } & _OSTableFormFieldItemSettingsFnOption<OSCustomFieldStaticPureTableFormFieldItemConfigsType>,
      {
        values?: RecordType;
        templateId: string;
        templateName: string;
      }
    >;
    requestCreateFormInitialValues?: RequestIO<
      {
        apis: OSActionsCreateAPI;
      } & Parameters<RequiredRecursion<OSFormType>['requests']['requestInitialValues']>[0],
      RecordType
    >;
  };
  slots?: {
    renderContent?: (options: { formDom: JSX.Element; type?: 'modal' | 'plain' }) => JSX.Element;
    renderActions?: () => JSX.Element;
  };
}

export type OSActionsTemplateUploadAPI = {};

export interface OSActionsTemplateUploadType extends OSCore {
  settings?: {
    /** 提示信息 */
    tooltip?: string | string[];
    /** 下载模板 */
    templates?: {
      /** 文件名称 */
      fileName: string;
      key?: string;
    }[];
    /** 允许的文件格式后缀 */
    suffixs?: string[];
    /** 按钮文案 */
    buttonTriggerText?: string;
  };
  requests?: {
    /** 上传模板数据 */
    requestUploadReportData?: RequestIO<
      {
        file: RcFile;
      },
      void
    >;
    /** 下载模板数据 */
    requestDownloadTemplateData?: RequestIO<
      {
        fileName: string;
        key: string;
      },
      void
    >;
  };
}

export type OSActionsOperateAPI = Pick<OSFormAPI, 'setFieldsValue' | 'getFieldsValue'>;

export interface OSActionsOperateType extends OSCore {
  settings?: {
    /** dialog 标题 */
    modalTitle?: string;
    /** 确认类型 */
    modalType?: RequiredRecursion<OSDialogModalOperationType>['settings']['type'];
    /** 确认按钮类型 */
    triggerButtonType?: RequiredRecursion<OSTriggerButtonType>['settings']['type'];
    /** 确认按钮危险提示 */
    triggerButtonDanger?: RequiredRecursion<OSTriggerButtonType>['settings']['danger'];
    /** 确认按钮危险提示 */
    danger?: boolean;
    /** 按钮文案 */
    triggerButtonText?: string;
    /** 按钮设置 */
    triggerButtonSettings?: OSTriggerButtonType['settings'];
    /** 表单字段 */
    formSettings?: _OSFormType<
      OSCustomFieldPureFormFieldItemConfigsType,
      OSCustomFieldStaticPureFormFieldItemConfigsType
    >['settings'];
    /** 提示信息 */
    alert?: {
      type?: AlertProps['type'];
      message: AlertProps['message'];
    };
    /** 确认拟态框配置 */
    modalOperationSettings?: OSDialogModalOperationType['settings'];
    /** 操作项 */
    actions?:
      | RequiredRecursion<OSDialogModalOperationType>['settings']['actions']
      | ((options: {
          formRef?: React.RefObject<OSFormAPI>;
        }) => RequiredRecursion<OSDialogModalOperationType>['settings']['actions']);
    /** 启动重置表单 */
    resetForm?: boolean;
  };
  requests?: {
    requestAfterConfirm?: RequestIO<
      {
        values?: RecordType;
      },
      undefined
    >;
    requestAfterCancel?: RequestIO<
      {
        values?: RecordType;
      },
      undefined
    >;
  } & _OSFormType<
    OSCustomFieldPureFormFieldItemConfigsType,
    OSCustomFieldStaticPureFormFieldItemConfigsType
  >['requests'];
}

export type OSActionsRecountAPI = {};

export interface OSActionsRecountType extends OSCore {
  settings?: {
    /**
     * dialog 标题
     * @default 重新计算
     */
    modalTitle?: string;
    /** 确认按钮类型 */
    triggerButtonType?: RequiredRecursion<OSTriggerButtonType>['settings']['type'];
    /** 按钮文案 */
    triggerButtonText?: string;
    /** 按钮设置 */
    triggerButtonSettings?: OSTriggerButtonType['settings'];
    /** 表单字段 */
    formSettings?: _OSFormType<
      OSCustomFieldPureFormFieldItemConfigsType,
      OSCustomFieldStaticPureFormFieldItemConfigsType
    >['settings'];
    /**
     * 获取当前状态间隔时间 ms
     * @default 5000
     */
    getCurrentStateInterval?: number;
  };
  requests?: {
    /** 请求重新计算 */
    requestRecount?: RequestIO<
      {
        values?: RecordType;
      },
      {
        /** 成功打印消息内容 */
        message?: string;
      }
    >;
    /** 请求当前计算状态 */
    requestCurrentStatus?: RequestIO<
      void,
      {
        /**
         * 是否计算中
         * 0：运行结束 | 1：运行中 | 2：运行异常
         */
        recountingStatus?: number;
        /** 触发时间 */
        triggerDate?: string;
        errorMessage?: string;
      }
    >;
  };
}

export type OSActionsReportDownloadAPI = {};

export interface OSActionsReportDownloadType extends OSCore {
  settings?: {
    /**
     * dialog 标题
     * @default 下载报告
     */
    modalTitle?: string;
    /** 确认按钮类型 */
    triggerButtonType?: RequiredRecursion<OSTriggerButtonType>['settings']['type'];
    /** 按钮文案 */
    triggerButtonText?: string;
    /** 按钮设置 */
    triggerButtonSettings?: OSTriggerButtonType['settings'];
    /** 表单配置 */
    formsSettings?: Record<
      string,
      _OSFormType<
        OSCustomFieldPureFormFieldItemConfigsType,
        OSCustomFieldStaticPureFormFieldItemConfigsType
      >['settings']
    >;
    /** 报告列表 */
    menu?: RequiredRecursion<OSTriggerDropdownType>['settings']['menu'];
  };
  requests?: {
    /** 请求报告下载 */
    requestReportDownload?: RequestIO<
      {
        key?: string;
        values?: RecordType;
      },
      {
        /** 成功打印消息内容 */
        message?: string;
        /** 文件内容 */
        file: BlobPart;
        /** 文件名称，包括后缀 */
        fileName?: string;
        /**
         * char-stream 字符流
         * byte-stream 字节流
         * file-stream 文件流
         */
        fileType?: 'char-stream' | 'byte-stream' | 'file-stream';
      }
    >;
  };
}

export type OSBattleTableUploadFileType = {
  file: RcFile;
  /** 附件 id = attachmentKey + rowId */
  attachmentId: string;
  attachmentKey: string;
  /** file 所在的行数据 */
  rowData: RecordType;
  /** 上传错误信息 */
  errorMessages?: {
    title?: string;
    desc?: string;
  }[];
  /** 是否已上传 */
  uploaded?: boolean;
  /** 匹配的文件名称 */
  name: string;
};

export type OSBattleTableUploadAPI = {};

export type OSBattleTableUploadType = {
  settings?: {
    triggerText?: string;
    /**
     * 弹窗和 trigge 的 title
     * @default 批量上传
     */
    modalTitle?: string;
    modalWidth?: number | string;
    /** trigger disabled */
    triggerSettings?: OSTriggerType['settings'];
    /** 表格列定义 */
    fieldItems?: Required<OSTableType>['settings']['fieldItems'];
    /** 定义附件列，和 fieldItems 的 key 对应 */
    attachmentFieldKeys?: Record<
      string,
      {
        /** 匹配后缀 */
        suffix: string | string[];
        /** 匹配的文件名称字段 */
        baseDataIndex: string;
      }
    >;
    /** 表单字段定义 */
    extraFormFieldItems?: Required<OSFormType>['settings']['fieldItems'];
    /** 表单初始值 */
    extraFormInitialValues?: RecordType;
  };
  requests?: {
    /** 请求表格数据 */
    requestDataSource?: Required<OSTableType>['requests']['requestDataSource'];
    /** 请求额外表单数据 */
    requestExtraFormDataSource?: Required<OSFormType>['requests']['requestDataSource'];
    /** 上传请求 */
    requestWhenUpload?: RequestIO<
      {
        values?: RecordType;
        files?: OSBattleTableUploadFileType[];
        fullFiles?: OSBattleTableUploadFileType[];
      },
      {
        errorMessages?: Record<
          /** key 为 attachmentId */
          string,
          {
            title?: string;
            desc?: string;
          }[]
        >;
      }
    >;
  };
};
