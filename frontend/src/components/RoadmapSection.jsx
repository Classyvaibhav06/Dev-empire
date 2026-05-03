import TopicCard from './TopicCard';

export default function RoadmapSection({ section, completedTopics }) {
  return (
    <div className="relative pl-8 md:pl-0">
      {/* Timeline line for mobile */}
      <div className="absolute left-[11px] top-2 bottom-0 w-1 bg-blue-50 rounded-full md:hidden"></div>
      
      <div className="mb-16 relative">
        <div className="flex items-center gap-4 mb-8 md:mb-10">
          {/* Timeline node */}
          <div className="absolute left-[-32px] md:static w-8 h-8 rounded-full bg-white border-[6px] border-primary z-10 flex items-center justify-center shadow-md">
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-textMain tracking-tight">
            <span className="text-primary mr-2 opacity-50">{section.order}.</span>
            {section.title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 md:pl-12">
          {section.topics.map(topic => (
            <TopicCard 
              key={topic.id || topic.title} 
              topic={topic} 
              isCompleted={completedTopics.includes(topic.id)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
