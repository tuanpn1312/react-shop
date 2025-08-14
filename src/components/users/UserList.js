import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UserList = ({ users }) => {
  if (!users || users.length === 0) {
    return <p className="text-center my-4">No users found.</p>;
  }

  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.role === 'ROLE_ADMIN' ? 'danger' : 'primary'}>
                  {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                </Badge>
              </td>
              <td>
                <Button
                  as={Link}
                  to={`/users/${user.id}`}
                  variant="info"
                  size="sm"
                  className="me-2"
                >
                  Xem chi tiết
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => window.alert('Chức năng sửa user sẽ được phát triển')}
                >
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa user này?')) {
                      window.alert('Chức năng xóa user sẽ được phát triển');
                    }
                  }}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserList;