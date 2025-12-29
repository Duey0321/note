export default function Loading() {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }