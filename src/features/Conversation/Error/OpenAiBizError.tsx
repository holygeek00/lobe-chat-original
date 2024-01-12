import { Highlighter } from '@lobehub/ui';
import { Button } from 'antd';
import isEqual from 'fast-deep-equal';
import { memo, useCallback } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useGlobalStore } from '@/store/global';
import { settingsSelectors } from '@/store/global/selectors';

import { RenderErrorMessage } from '../types';
import OpenAPIKey from './OpenAPIKey';

interface OpenAIError {
  code: 'invalid_api_key' | string;
  message: string;
  param?: any;
  type: string;
}

interface OpenAIErrorResponse {
  error: OpenAIError;
}

const OpenAiBizError: RenderErrorMessage['Render'] = memo(({ error, id, ...props }) => {
  const errorBody: OpenAIErrorResponse = (error as any)?.body;

  const errorCode = errorBody.error?.code;
  useGlobalStore(settingsSelectors.currentSettings, isEqual);
  const [resetSettings] = useGlobalStore((s) => [s.resetSettings]);
  const handleReset = useCallback(() => {
    resetSettings();
  }, []);
  if (errorCode === 'invalid_api_key')
    // @ts-ignore
    return <OpenAPIKey error={error} id={id} {...props} />;

  return (
    <Flexbox style={{ maxWidth: 600 }}>
      <Highlighter copyButtonSize={'small'} language={'json'}>
        {JSON.stringify(errorBody, null, 2)}
      </Highlighter>
      <Button danger onClick={handleReset} type="primary">
        遇到问题？点我立即重置并重新输入
      </Button>
    </Flexbox>
  );
});

export default OpenAiBizError;
