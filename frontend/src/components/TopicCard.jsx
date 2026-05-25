import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { Card, Badge } from './ui/Shared';

export default function TopicCard({ topic, isCompleted, onSelect }) {
  const handleClick = (e) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(topic);
    }
  };

  return (
    <Link to={`/topic/${topic.id}`} onClick={handleClick} className="block group h-full">
      <Card className={`relative overflow-hidden h-full flex flex-col ${isCompleted ? 'border-success/30' : ''}`}>
        <div className="flex items-start justify-between gap-4 flex-grow">
          <div className="flex-1 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
               <Badge variant={topic.level === 'Beginner' ? 'success' : 'warning'} className="!text-[10px]">
                 {topic.level}
               </Badge>
            </div>
            <h4 className="text-xl font-bold group-hover:text-primary transition-colors text-textMain mb-2">
              {topic.title}
            </h4>
            <p className="text-xs text-textMuted line-clamp-2 leading-relaxed mb-4 flex-grow">
              {topic.description || "Master the core concepts of this module through hands-on practice and expert-led videos."}
            </p>
            <div className="flex items-center gap-4 text-[10px] font-bold text-textDim uppercase tracking-widest mt-auto">
              <span className="flex items-center gap-1.5">
                <PlayCircle className="w-3.5 h-3.5 text-primary" />
                {topic.videos?.length || 1} Modules
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                Project
              </span>
            </div>
          </div>
          <div className="shrink-0 pt-2">
            {isCompleted ? (
              <div className="w-10 h-10 rounded-md bg-success/10 flex items-center justify-center border border-success/20">
                 <CheckCircle className="w-6 h-6 text-success" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-md bg-surface flex items-center justify-center border border-surfaceBorder group-hover:border-primary group-hover:bg-primary/5 transition-all">
                 <ArrowRight className="w-5 h-5 text-textMuted group-hover:text-primary transition-colors" />
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
