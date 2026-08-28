import React, { useMemo, useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/Card';
import { Star, MoreHorizontal, Clock } from 'lucide-react';

const COLUMNS = ['APPLIED', 'CV REVIEW', '1ST INTERVIEW', 'TASK SENT', '2ND INTERVIEW'];

interface Candidate {
  id: string;
  name: string;
  email: string;
  experience: string;
  status: string;
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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 cursor-grab active:cursor-grabbing">
      <Card className="hover:border-accent-500 transition-colors">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-xs">
                 {candidate.name.substring(0,2).toUpperCase()}
               </div>
               <div>
                  <div className="font-semibold text-navy-900 text-sm">{candidate.name}</div>
                  <div className="flex items-center text-[10px] text-gray-500 mt-0.5">
                    <Clock className="w-3 h-3 mr-1" /> 2 days ago
                  </div>
               </div>
             </div>
             <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex text-amber-400 pt-1">
             <Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 fill-current"/><Star className="w-3.5 h-3.5 text-gray-300"/><Star className="w-3.5 h-3.5 text-gray-300"/>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KanbanColumn({ title, candidates }: { title: string; candidates: Candidate[] }) {
  const { setNodeRef } = useSortable({
    id: title,
    data: { type: 'Column' },
  });

  return (
    <div className="flex flex-col bg-gray-50 rounded-xl p-4 min-w-[280px] border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider">{title}</h3>
        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">{candidates.length}</span>
      </div>
      <div ref={setNodeRef} className="flex-1 min-h-[150px]">
        <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {candidates.map(c => (
            <SortableCandidateCard key={c.id} candidate={c} />
          ))}
        </SortableContext>
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

  const getStatusString = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes('APPL')) return 'APPLIED';
    if (s.includes('CV')) return 'CV REVIEW';
    if (s.includes('1ST') || s.includes('FIRST')) return '1ST INTERVIEW';
    if (s.includes('TASK')) return 'TASK SENT';
    if (s.includes('2ND') || s.includes('SECOND') || s.includes('INTERVIEW')) return '2ND INTERVIEW';
    return 'APPLIED';
  };

  const columns = useMemo(() => {
    const cols: Record<string, Candidate[]> = {};
    COLUMNS.forEach(c => cols[c] = []);
    candidates.forEach(c => {
      const col = getStatusString(c.status);
      if (cols[col]) cols[col].push(c);
      else cols['APPLIED'].push(c);
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

    if (COLUMNS.includes(overIdStr)) {
      if (getStatusString(candidate.status) !== overIdStr) {
        onStatusChange(activeIdStr, overIdStr);
      }
      return;
    }

    const overCandidate = candidates.find(c => c.id === overIdStr);
    if (overCandidate) {
      const overStatus = getStatusString(overCandidate.status);
      if (getStatusString(candidate.status) !== overStatus) {
        onStatusChange(activeIdStr, overStatus);
      }
    }
  };

  const activeCandidate = activeId ? candidates.find(c => c.id === activeId) : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {COLUMNS.map(col => (
          <KanbanColumn key={col} title={col} candidates={columns[col]} />
        ))}
      </div>
      <DragOverlay>
        {activeCandidate ? (
          <Card className="border-accent-500 shadow-xl opacity-90 cursor-grabbing">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-xs">
                    {activeCandidate.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                      <div className="font-semibold text-navy-900 text-sm">{activeCandidate.name}</div>
                      <div className="flex items-center text-[10px] text-gray-500 mt-0.5">
                        <Clock className="w-3 h-3 mr-1" /> 2 days ago
                      </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
