import { Text } from '@kyper/text'

function Header() {
  return (
    <div>
      <Text as="H1" color="primary" tag="p">
        MXquickconnect
      </Text>
      <div className='mt-8 pb-16 bottom-border'>
        <Text as="Paragraph" color="primary" tag="p">
          A fast way to try the MX platform and learn about integration
        </Text>
      </div>
    </div>
  )
}

export default Header;

