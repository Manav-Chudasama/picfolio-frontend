import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { Lock } from 'lucide-react';

export default function PasswordModal({ isOpen, onClose, onSubmit, userName }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
    setPassword('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-xl
          transform transition-all">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-blue-500 dark:text-gray-300" />
            </div>
            <Dialog.Title className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Welcome back
            </Dialog.Title>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{userName}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none
                  transition-all dark:text-gray-100"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200
                  dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600
                  transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  dark:focus:ring-offset-gray-800"
              >
                Login
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 