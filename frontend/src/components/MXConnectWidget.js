import React, { useEffect, useState } from 'react'
import { Text } from '@kyper/text'
import { Button } from '@kyper/button'
import { ChevronDown } from '@kyper/icon/ChevronDown'
import { ChevronUp } from '@kyper/icon/ChevronUp'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function MXConnectWidget({ onEvent, widgetUrl }) {
  const [isShowingParams, setIsShowingParams] = useState(false);

  useEffect(() => {
    // Add the post message listener
    window.addEventListener('message', onPostMessage);

    return function cleanup() {
      // Make sure to remove the post message listener to avoid multiple messages
      window.removeEventListener('message', onPostMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const widgetConfig = {
    widget_url: {
      widget_type: 'connect_widget',
      is_mobile_webview: false,
      mode: 'verification',
      ui_message_version: 4,
      include_transactions: true,
    }
  }

  /**
   * Handle MX Postmessages and call the event callback with the payload.
   * NOTE: this only looks for post messages with `ui_message_version: 4`
   */
  const onPostMessage = event => {
    if (event.data && event.data.mx === true) {
      onEvent(event.data)
    }
  }

  /**
   * Render a basic iframe. You'll want to customize the values here to best
   * fit your own app.
   */
  return (
    <div>
      <div className='flex-align flex-center mb-8'>
        <Text as="ParagraphSmall" color="primary" tag="span">
          MXConnect Widget
        </Text>
        <div className='ml-8'>
          <Button size="small" variant="link-tertiary" onClick={() => setIsShowingParams(!isShowingParams)}>
            see config
            {isShowingParams ? (
              <ChevronUp
                color="currentColor"
                height={12}
                style={{
                  marginLeft: 4
                }}
                width={12}
              />
            ) : (
              <ChevronDown
                color="currentColor"
                height={12}
                style={{
                  marginLeft: 4
                }}
                width={12}
              />
            )}
          </Button>
        </div>
      </div>
      {isShowingParams && (
        <div className='widget-params'>
          <SyntaxHighlighter language="json" style={docco}>
            {JSON.stringify(widgetConfig, null, 2)}
          </SyntaxHighlighter>
        </div>
      )}
      <div className='dashed-border'>
        <iframe
          border='0'
          frame='0'
          frameBorder='0'
          height={650}
          marginHeight='0'
          marginWidth='0'
          src={widgetUrl}
          title='MX Connect Widget'
          width={766}
        />
      </div>
    </div>
  )
}

export default MXConnectWidget;
