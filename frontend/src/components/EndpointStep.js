import { Tag } from '@kyper/tag'
import { Text } from '@kyper/text'

function EndpointStep({loadingStatusLabel, url}) {

  return (
    <div className="mt-8 flex-align status-step">
      <span className='mr-8'>
        <Tag title="Get" variant="success" />
      </span>
      <Text className='code-text' as="ParagraphSmall" color="primary" tag="span">
        {url}
      </Text>
      {loadingStatusLabel()}
    </div>
  )
}

export default EndpointStep;
