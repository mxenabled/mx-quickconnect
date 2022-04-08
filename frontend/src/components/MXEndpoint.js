import { Table } from '@kyper/table'
import { Text } from '@kyper/text'
import { Tag } from '@kyper/tag'
import { Button } from '@kyper/button'
import { Dots } from '@kyper/progressindicators'

function MXEndpoint({
  title,
  requestType,
  requestUrl,
  subText,
  onAction,
  tableData,
  isLoading
}) {

  const requestLabel = () => {
    if (requestType.toLowerCase() === 'post') {
      return (
        <Tag title="Post" variant="primary" />
      )
    } else if (requestType.toLowerCase() === 'get') {
      return (
        <Tag title="Get" variant="success" />
      )
    }
  }

  return (
    <div>
      <div className="mx-endpoint-body">
        <div className='endpoint-details'>
          <div className="endpoint-title-url">
            <div>
              <Text as="H3" bold tag="h3">
                {title}
              </Text>
            </div>
            <div className="mt-8">
              <span className='mr-8'>
                {requestLabel()}
              </span>
              <Text className='code-text' as="ParagraphSmall" color="primary" tag="span">
                {requestUrl}
              </Text>
            </div>
          </div>
          <div style={{display: 'inline-block', float: 'right'}}>
            <Button onClick={onAction} variant="neutral" size="small" disabled={tableData.rowData.length > 0}>
              {isLoading ? (
                <Dots size={16} fgColor="#2F73DA" />
              ) : (
                'Send Request'
              )}
            </Button>
          </div>
          <div className="mt-20 subtext">
            <Text as="ParagraphSmall" color="secondary" tag="p">
              {subText}
            </Text>
          </div>
        </div>
      </div>
      <div className={`mx-endpoint-table ${tableData.rowData.length > 0 ? '' : 'hidden' }`}>
        <Table className="" wrapperTag="table">
          <thead>
            <tr>
              { tableData.headers.map(header => (<th key={header}>{header}</th>)) }
            </tr>
          </thead>
          <tbody>
            { tableData.rowData.map(row => {
              return (
                <tr key={row.id}>
                  { row.cols.map((colItem, index) => (<td key={`${row.id}-${colItem}-${index}`}>{colItem}</td>)) }
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={tableData.rowData.length}>
                {`${tableData.rowData.length} rows`}
              </td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </div>
  )
}


export default MXEndpoint;
