import Image from "next/image";

export default function PeopleCarousel({ people = [] }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        People
      </h2>
      <button className="text-sm text-blue-500 hover:underline">
        View All
      </button>
    </div>
  );
}

export function PeopleRow({ people = [] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex gap-6 min-w-full pr-4">
        {people.map((p) => (
          <div key={p.id} className="flex flex-col items-center shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-blue-500 transition">
              <Image
                src={p.avatar}
                alt={p.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-2 text-sm text-gray-300 dark:text-gray-300">
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
