import Image from 'next/image';

export default function UserCard({ user, onSelect }) {
  return (
    <div 
      onClick={() => onSelect(user)}
      className="w-64 h-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl p-6 cursor-pointer 
        transform transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center gap-6
        border border-gray-100 dark:border-gray-700"
    >
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 
        dark:from-gray-700 dark:to-gray-600 overflow-hidden shadow-inner">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-light text-blue-500 dark:text-gray-300">
            {user.name[0].toUpperCase()}
          </div>
        )}
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{user.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Click to login</p>
      </div>
    </div>
  );
} 