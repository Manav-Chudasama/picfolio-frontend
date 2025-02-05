'use client';
import { useState } from 'react';
import UserCard from '../components/UserCard';
import NewUserCard from '../components/NewUserCard';
import PasswordModal from '../components/PasswordModal';
import NewUserModal from '../components/NewUserModal';

export default function Home() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
  ]);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = (password) => {
    console.log(`Login attempt for ${selectedUser.name} with password: ${password}`);
    setIsPasswordModalOpen(false);
    setSelectedUser(null);
    // Redirect to photos page after login
    window.location.href = '/photos';
  };

  const handleNewUser = (userData) => {
    const newUser = {
      id: users.length + 1,
      name: userData.name,
    };
    setUsers([...users, newUser]);
    setIsNewUserModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 
      dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
          Welcome to Picfolio
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          Select your profile to continue
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {users.map(user => (
            <UserCard key={user.id} user={user} onSelect={handleUserSelect} />
          ))}
          <NewUserCard onClick={() => setIsNewUserModalOpen(true)} />
        </div>
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordSubmit}
        userName={selectedUser?.name}
      />

      <NewUserModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
        onSubmit={handleNewUser}
      />
    </div>
  );
}
