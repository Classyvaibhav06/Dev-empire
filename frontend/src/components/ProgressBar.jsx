export default function ProgressBar({ progress }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm font-bold mb-3">
        <span className="text-textMain">Course Progress</span>
        <span className="text-primary">{Math.round(progress)}%</span>
      </div>
      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
