import React, { useMemo, useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/Card';
import { Star, MoreHorizontal, Clock, ArrowRight, Check, Bookmark, Send, Calendar, Mail, FileText, Phone, Users, Code, Briefcase, UserCheck, CheckCircle } from 'lucide-react';

const COLUMNS = [
  { id: 'SOURCING', title: 'Sourcing', icon: Bookmark, statusText: 'Wishlist', 
    colors: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-600 dark:border-violet-400', checkBg: 'bg-transparent text-violet-600' } },
  { id: 'SCREENING', title: 'Screening', icon: Send, statusText: 'Submitted', 
    colors: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-600 dark:border-violet-400', checkBg: 'bg-violet-600 text-white' } },
  { id: 'TELEPHONIC', title: 'Telephonic', icon: Phone, statusText: 'In Progress', 
    colors: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-600 dark:border-violet-400', checkBg: 'bg-violet-600 text-white' } },
  { id: 'HR_INTERVIEW', title: 'HR Interview', icon: Users, statusText: 'In Progress', 
    colors: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-600 dark:border-violet-400', checkBg: 'bg-violet-600 text-white' } },
  { id: 'TECHNICAL', title: 'Technical', icon: Code, statusText: 'In Progress', 
    colors: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-600 dark:border-violet-400', checkBg: 'bg-violet-600 text-white' } },
  { id: 'MANAGEMENT', title: 'Management', icon: Briefcase, statusText: 'In Progress', 
    colors: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-600 dark:border-violet-400', checkBg: 'bg-violet-600 text-white' } },
  { id: 'SELECTED', title: 'Selected', icon: UserCheck, statusText: 'Selected', 
    colors: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-600 dark:border-violet-400', checkBg: 'bg-violet-600 text-white' } },
  { id: 'OFFER', title: 'Offer', icon: Star, statusText: 'Offer Released', 
    colors: { bg: 'bg-lime-100 dark:bg-lime-900/30', text: 'text-lime-500 dark:text-lime-400', border: 'border-lime-500 dark:border-lime-400', checkBg: 'bg-lime-500 text-white' } },
  { id: 'JOINED_REJECTED', title: 'Completed', icon: CheckCircle, statusText: 'Closed', 
    colors: { bg: 'bg-lime-100 dark:bg-lime-900/30', text: 'text-lime-500 dark:text-lime-400', border: 'border-lime-500 dark:border-lime-400', checkBg: 'bg-lime-500 text-white' } }
];

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  experience?: string;
  status: string; // Will map to the column
  requisitionId?: string;
  originalData?: any;
}

interface KanbanBoardProps {
  candidates: Candidate[];
  onStatusChange: (id: string, newStatus: string) => void;
}

function SortableCandidateCard({ candidate }: { candidate: Candidate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 cursor-grab active:cursor-grabbing w-full">
      <Card className="hover:border-accent-500 transition-colors w-full text-left">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-xs">
                 {candidate.name.substring(0,2).toUpperCase()}
               </div>
               <div>
                  <div className="font-semibold text-navy-900 dark:text-white text-sm">{candidate.name}</div>
                  <div className="flex items-center text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5">
                    <Clock className="w-3 h-3 mr-1" /> 2 days ago
                  </div>
               </div>
             </div>
             <MoreHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="flex text-amber-400 pt-1">
             <Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 text-gray-300"/><Star className="w-3.5 h-3.5 text-gray-300"/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KanbanColumn({ col, candidates }: { col: typeof COLUMNS[0]; candidates: Candidate[] }) {
  const { setNodeRef } = useSortable({
    id: col.id,
    data: { type: 'Column' },
  });
  
  const Icon = col.icon;

  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-6 min-w-[280px] w-[300px] border border-gray-100 dark:border-gray-800 shrink-0 items-center">
      
      {/* Icon Area */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${col.colors.bg}`}>
        <Icon className={`w-8 h-8 ${col.colors.text}`} />
      </div>
      
      {/* Title */}
      <h3 className="font-bold text-xl text-navy-900 dark:text-white mb-4 text-center">{col.title}</h3>
      
      {/* Divider */}
      <div className="w-full h-px bg-gray-100 dark:bg-gray-800 mb-6" />
      
      {/* Candidates Area */}
      <div ref={setNodeRef} className="flex-1 w-full min-h-[150px] flex flex-col items-center">
        <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {candidates.map(c => (
            <SortableCandidateCard key={c.id} candidate={c} />
          ))}
          {candidates.length === 0 && (
            <div className="text-gray-400 dark:text-gray-500 text-sm italic py-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl w-full text-center">
              Drop candidates here
            </div>
          )}
        </SortableContext>
      </div>

      {/* Footer Pill */}
      <div className="w-full mt-6 flex items-center justify-between">
         <div className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${col.colors.bg} ${col.colors.text}`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {col.statusText}
         </div>
         <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${col.colors.border} ${col.colors.checkBg}`}>
            <Check className="w-4 h-4 stroke-[3]" />
         </div>
      </div>
    </div>
  );
}

export function KanbanBoard({ candidates, onStatusChange }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const getColumnForCandidate = (c: Candidate) => {
    const raw = c.originalData || {};
    
    // Joined / Rejected Stage
    if (raw.offerStatus === 'OFFER_ACCEPTED' || raw.offerStatus === 'OFFER_DECLINED' || 
        raw.selectionStatus === 'SELECTION_REJECTED' || raw.screeningStatus === 'SCREENING_REJECTED') {
      return 'JOINED_REJECTED';
    }

    // Offer Stage
    if (raw.offerStatus === 'RELEASED') {
      return 'OFFER';
    }

    // Selected Stage
    if (raw.selectionStatus === 'SELECTED') {
      return 'SELECTED';
    }
    
    // Interview Stages
    if (raw.interviewRound === 'MANAGEMENT') return 'MANAGEMENT';
    if (raw.interviewRound === 'TECHNICAL') return 'TECHNICAL';
    if (raw.interviewRound === 'HR') return 'HR_INTERVIEW';
    if (raw.interviewRound === 'TELEPHONIC') return 'TELEPHONIC';

    // If selection process started but round not explicitly set, fallback to HR
    if (raw.selectionStatus && raw.selectionStatus !== 'SELECTION_PENDING') {
      return 'HR_INTERVIEW';
    }
    
    // Screening Stage
    if (raw.screeningStatus === 'SHORTLISTED') {
      return 'SCREENING';
    }
    
    // Default to Sourcing
    return 'SOURCING';
  };

  const columnsData = useMemo(() => {
    const cols: Record<string, Candidate[]> = {};
    COLUMNS.forEach(c => cols[c.id] = []);
    candidates.forEach(c => {
      const colId = getColumnForCandidate(c);
      if (cols[colId]) cols[colId].push(c);
      else cols['SOURCING'].push(c);
    });
    return cols;
  }, [candidates]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;
    
    const candidate = candidates.find(c => c.id === activeIdStr);
    if (!candidate) return;

    const columnIds = COLUMNS.map(c => c.id);
    if (columnIds.includes(overIdStr)) {
      if (getColumnForCandidate(candidate) !== overIdStr) {
        onStatusChange(activeIdStr, overIdStr);
      }
      return;
    }

    const overCandidate = candidates.find(c => c.id === overIdStr);
    if (overCandidate) {
      const overStatus = getColumnForCandidate(overCandidate);
      if (getColumnForCandidate(candidate) !== overStatus) {
        onStatusChange(activeIdStr, overStatus);
      }
    }
  };

  const activeCandidate = activeId ? candidates.find(c => c.id === activeId) : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar items-start">
        {COLUMNS.map((col, index) => (
          <React.Fragment key={col.id}>
            <KanbanColumn col={col} candidates={columnsData[col.id]} />
            {index < COLUMNS.length - 1 && (
              <div className="flex items-center justify-center h-[300px] px-2 text-violet-300 dark:text-violet-900">
                <ArrowRight className="w-6 h-6 stroke-[2.5]" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <DragOverlay>
        {activeCandidate ? (
          <div className="w-[250px]">
            <Card className="border-accent-500 shadow-xl opacity-90 cursor-grabbing w-full">
              <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-xs">
                    {activeCandidate.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                      <div className="font-semibold text-navy-900 dark:text-white text-sm">{activeCandidate.name}</div>
                      <div className="flex items-center text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5">
                        <Clock className="w-3 h-3 mr-1" /> 2 days ago
                      </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
