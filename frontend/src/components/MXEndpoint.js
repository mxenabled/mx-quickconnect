import { Table } from '@kyper/table'
import { Text } from '@kyper/text'
import { Tag } from '@kyper/tag'
import { Button } from '@kyper/button'
import { Spinner } from '@kyper/progressindicators'
import { Export } from '@kyper/icon/Export'
import { Code } from '@kyper/icon/Code'
import { Hamburger } from '@kyper/icon/Hamburger'

import { useState, useEffect } from 'react';

function MXEndpoint({
  jsonData,
  docsLink,
  error,
  isLoading,
  onAction,
  requestType,
  requestUrl,
  subText,
  title,
  tableData,
}) {
  const [dataView, setDataView] = useState(null);

  useEffect(() => {
    if (jsonData != null) {
      setDataView('table');
    }
  }, [jsonData])

  const requestLabel = () => {
    if (error != null) {
      return (
        <Tag title="Error" variant="error" />
      )
    } else if (requestType.toLowerCase() === 'post') {
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
            { error == null ? (
              <Button onClick={onAction} variant="neutral" size="small" disabled={tableData.rowData.length > 0}>
                {isLoading ? (
                  <div style={{ margin: '0 34px'}}>
                    <Spinner size={24} fgColor="#2F73DA" />
                  </div>
                ) : (
                  'Send Request'
                )}
              </Button>
            ) : (
              <Button onClick={() => window.open(error?.link, '_blank')} variant="primary" size="small">
                  Learn More
                  <Export
                    color="currentColor"
                    height={12}
                    style={{
                      marginLeft: 8
                    }}
                    width={12}
                  />
              </Button>
            )}
          </div>
          <div className="mt-20 subtext">
            <Text as="ParagraphSmall" color="secondary" tag="p">
              {subText + ' '}
              <a href={docsLink} target="_blank" rel="noreferrer">Visit the docs to learn more.</a>
            </Text>
          </div>
          <div className="view-toggle">
            <div onClick={() => {
              if (jsonData != null) {
                setDataView('table')
              }
            }} className={`toggle-item ${dataView === 'table' ? ' toggle-item-selected right' : ''} ${jsonData == null ? 'toggle-item-disabled' : ''}`}>
              <Hamburger height={14} color={`${jsonData == null ? '#A8B1BD' : '#165ECC'}`} />
            </div>
            <div onClick={() => {
              if (jsonData != null) {
                setDataView('json')
              }
            }} className={`toggle-item ${dataView === 'json' ? ' toggle-item-selected left' : ''} ${jsonData == null ? 'toggle-item-disabled' : ''}`}>
              <Code height={14} color={`${jsonData == null ? '#A8B1BD' : '#165ECC'}`} />
            </div>
          </div>
        </div>
      </div>
      <div className={`mx-endpoint-table ${tableData.rowData.length > 0 ? '' : 'hidden' }`}>
        <Table className={`${dataView === 'table' ? '' : 'hidden'}`} wrapperTag="table">
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
              <td colSpan={10}>
                {`${tableData.rowData.length} rows`}
              </td>
            </tr>
          </tfoot>
        </Table>
        <div className={`${dataView === 'json' ? '' : 'hidden'}`}>
          <div className='p-16 bottom-border title-sm'>JSON</div>
          <pre>
            { JSON.stringify(jsonData, null, 2) }
          </pre>
          <div className='bottom-pre' />
        </div>
      </div>
      <div className={`mx-endpoint-error ${error != null ? '' : 'hidden' }`}>
        <Table className='error-table' >
          <tbody>
            <tr>
              <td>
                Error code
              </td>
              <td>
                {error?.code}
              </td>
            </tr>
            <tr>
              <td>
                Type
              </td>
              <td>
                {error?.type}
              </td>
            </tr>
            <tr>
              <td>
                Message
              </td>
              <td>
                {error?.message}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  )
}


export default MXEndpoint;
