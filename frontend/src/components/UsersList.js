// import './App.css';
import { useState, useEffect } from 'react';

function UsersList() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    setIsLoading(true);
    const response = await fetch(`http://localhost:8000/api/users`)
    .then(res => res.json())
    .then((res) => {
      console.log('response', res);
      setUsers(res.users)
    });
  }, [])

  // const loadWidget = async () => {
  //   console.log('hit')
  //   setIsLoading(true);
  //   const response = await fetch(`http://localhost:8000/api/test`)
  //   .then(res => res.json())
  //   .then((res) => {
  //     console.log('second then', res);
  //   });
  //   // const data = await response.json();
  //   // console.log('data', data)
  // }

  return (
    <div >
      <h2>Users</h2>
      <ul>
        {users.map(user => {
          return (
            <button key={`${user.id}`} onClick={() => console.log('user', user.id, 'clicked')}>
              <li className="clickable">{`${user.id}: ${user.guid}`}</li>
            </button>
          )
        })}
      </ul>
      {isLoading && (<h3>Loading</h3>)}
    </div>
  );
}

export default UsersList;
