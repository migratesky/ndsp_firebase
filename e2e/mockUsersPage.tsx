interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const MockUsersPage = ({ users = [] }: { users?: User[] }) => {
  return (
    <div data-testid="mock-users-page">
      <h1>User Management</h1>
      <button>Add User</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
