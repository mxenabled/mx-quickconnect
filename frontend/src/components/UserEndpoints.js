import Identity from "./Identity";
import Verification from "./Verification";
import Balances from "./Balances";
import Transactions from "./Transactions";
// import Holdings from "./Holdings";
import Header from "./Header";
import { Table } from '@kyper/table'
import { Text } from '@kyper/text'


function UserEndpoints({userGuid, memberGuid}) {
  return (
    <div style={{paddingBottom: '48px'}}>
      <Header />
      <Table className={'guid-table'} >
        <tbody>
          <tr>
            <td>
              userGuid
            </td>
            <td>
              {userGuid}
            </td>
          </tr>
          <tr>
            <td>
              memberGuid
            </td>
            <td>
              {memberGuid}
            </td>
          </tr>
        </tbody>
      </Table>
      <div className="mt-16 mb-48">
        <Text as="Paragraph" color="primary" tag="p">
          Nice work! You have set up a user and member, and can now make the following requests:
        </Text>
      </div>
      <Verification userGuid={userGuid} memberGuid={memberGuid} />
      <Identity userGuid={userGuid} memberGuid={memberGuid} />
      <Balances userGuid={userGuid} memberGuid={memberGuid} />
      <Transactions userGuid={userGuid} memberGuid={memberGuid} />
      {/* <Holdings userGuid={userGuid} memberGuid={memberGuid} /> */}
    </div>
  );
}

export default UserEndpoints;
