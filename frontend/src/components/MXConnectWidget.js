import React, { useEffect } from 'react'

function MXConnectWidget({onEvent, widgetUrl}) {

  useEffect(() => {
    // Add the post message listener
    window.addEventListener('message', onPostMessage);

    return function cleanup() {
      // Make sure to remove the post message listener to avoid multiple messages
      window.removeEventListener('message', onPostMessage);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    <iframe
      border='0'
      frame='0'
      frameBorder='0'
      height={650}
      marginHeight='0'
      marginWidth='0'
      src={widgetUrl}
      title='MX Connect Widget'
      width={768}
    />
  )
}

export default MXConnectWidget;
