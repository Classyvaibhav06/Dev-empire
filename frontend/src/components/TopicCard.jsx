import { Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, Circle } from 'lucide-react';

export default function TopicCard({ topic, isCompleted }) {
  return (
    <Link 
      to={`/topic/${topic.id}`}
      className="block bg-white border border-gray-100 hover:border-primary/30 rounded-2xl p-6 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-xl font-bold group-hover:text-primary transition-colors flex items-center gap-2 text-textMain">
            {topic.title}
          </h4>
          <p className="text-sm text-textMuted mt-2 line-clamp-2 leading-relaxed">
            {topic.description}
          </p>
          <div className="flex items-center gap-4 mt-5 text-xs font-semibold text-textMuted">
            <span className="flex items-center gap-1.5 bg-blue-50 text-primary px-2.5 py-1 rounded-md">
              <PlayCircle className="w-3.5 h-3.5" />
              {topic.videos?.length || 0} Videos
            </span>
            {topic.project && (
              <span className="flex items-center gap-1.5 bg-green-50 text-success px-2.5 py-1 rounded-md">
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                1 Project
              </span>
            )}
          </div>
        </div>
        <div>
          {isCompleted ? (
            <CheckCircle className="w-7 h-7 text-success shrink-0" />
          ) : (
            <Circle className="w-7 h-7 text-gray-200 group-hover:text-primary/50 shrink-0 transition-colors" />
          )}
        </div>
      </div>
    </Link>
  );
}
