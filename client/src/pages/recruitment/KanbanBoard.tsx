import React, { useMemo, useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, KeyboardSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { sortableKeyboardCoordinates, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/Card';
import { Star, MoreHorizontal, Check, Bookmark, Send, FileText, Phone, Users, Code, Briefcase, UserCheck, CheckCircle } from 'lucide-react';

const COLUMNS = [
  { id: 'REQUIREMENT', title: 'Requirement', icon: FileText, colors: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400' } },
  { id: 'SOURCING', title: 'Sourcing', icon: Bookmark, colors: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' } },
  { id: 'SCREENING', title: 'Screening', icon: Send, colors: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' } },
  { id: 'TELEPHONIC', title: 'Telephonic', icon: Phone, colors: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400' } },
  { id: 'HR_INTERVIEW', title: 'HR Interview', icon: Users, colors: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' } },
  { id: 'TECHNICAL', title: 'Technical', icon: Code, colors: { bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', text: 'text-fuchsia-600 dark:text-fuchsia-400' } },
  { id: 'MANAGEMENT', title: 'Management', icon: Briefcase, colors: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400' } },
  { id: 'SELECTED', title: 'Selected', icon: UserCheck, colors: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400' } },
  { id: 'OFFER', title: 'Offer', icon: Star, colors: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-500 dark:text-orange-400' } },
  { id: 'JOINED_REJECTED', title: 'Completed', icon: CheckCircle, colors: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-500 dark:text-emerald-400' } }
];

export interface KanbanItem {
  id: string;
  title: string;
  subtitle?: string;
  status: string;
  originalData?: any;
}

interface KanbanBoardProps {
  items: KanbanItem[];
  onStatusChange: (id: string, newStatus: string) => void;
  onItemClick?: (item: KanbanItem) => void;
}

function SortableItemCard({ item, onClick }: { item: KanbanItem; onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 cursor-grab active:cursor-grabbing w-full outline-none" aria-label={`Candidate ${item.title}`}>
      <Card className="hover:border-accent-300 dark:hover:border-accent-600 transition-colors w-full text-left shadow-sm bg-white dark:bg-surface border-slate-200 dark:border-slate-700">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs shrink-0">
                {item.title.substring(0,2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-white text-sm truncate">{item.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {item.subtitle}
                </div>
              </div>
            </div>
            <button 
              type="button"
              onPointerDown={(e) => e.stopPropagation()} 
              onClick={onClick}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
              aria-label="View candidate details"
            >
              <MoreHorizontal className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KanbanColumn({ col, items, onItemClick }: { col: typeof COLUMNS[0]; items: KanbanItem[]; onItemClick?: (item: KanbanItem) => void }) {
  const { setNodeRef, isOver } = useDroppable({
    id: col.id,
    data: { type: 'Column' },
  });
  
  const Icon = col.icon;

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col rounded-[1.25rem] p-3 min-w-[280px] w-[280px] shrink-0 transition-colors ${
        isOver ? 'bg-slate-100 dark:bg-slate-800/80 ring-2 ring-accent-400/50' : 'bg-slate-50/80 dark:bg-slate-900/20'
      }`}
      role="region"
      aria-label={`${col.title} column`}
    >
      
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4 px-1 mt-1">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${col.colors.bg}`}>
            <Icon className={`w-4 h-4 ${col.colors.text}`} strokeWidth={2.5} />
          </div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">{col.title}</h3>
        </div>
        <div className="flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-slate-200/50 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
          {items.length}
        </div>
      </div>
      
      {/* Items Area */}
      <div className="flex-1 w-full min-h-[100px] flex flex-col">
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.map(i => (
            <SortableItemCard key={i.id} item={i} onClick={() => onItemClick?.(i)} />
          ))}
        </SortableContext>
      </div>

    </div>
  );
}

export function KanbanBoard({ items, onStatusChange, onItemClick }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getColumnForItem = (i: KanbanItem) => {
    const colIds = COLUMNS.map(c => c.id);
    if (colIds.includes(i.status)) return i.status;
    return 'REQUIREMENT';
  };

  const columnsData = useMemo(() => {
    const cols: Record<string, KanbanItem[]> = {};
    COLUMNS.forEach(c => cols[c.id] = []);
    
    items.forEach(i => {
      const colId = getColumnForItem(i);
      if (cols[colId]) cols[colId].push(i);
      else cols['REQUIREMENT'].push(i);
    });
    return cols;
  }, [items]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;
    
    const item = items.find(i => i.id === activeIdStr);
    if (!item) return;

    const columnIds = COLUMNS.map(c => c.id);
    const currentColumn = getColumnForItem(item);
    const currentIndex = columnIds.indexOf(currentColumn);
    let newColumn = currentColumn;

    if (columnIds.includes(overIdStr)) {
      newColumn = overIdStr;
    } else {
      const overItem = items.find(i => i.id === overIdStr);
      if (overItem) {
        newColumn = getColumnForItem(overItem);
      }
    }

    const newIndex = columnIds.indexOf(newColumn);
    
    // Only allow moving forwards or sideways safely
    if (newIndex !== currentIndex) {
      onStatusChange(activeIdStr, newColumn);
    }
  };

  const activeItem = activeId ? items.find(i => i.id === activeId) : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-5 overflow-x-auto pb-6 custom-scrollbar items-start min-h-[500px]">
        {COLUMNS.map((col) => (
          <KanbanColumn key={col.id} col={col} items={columnsData[col.id]} onItemClick={onItemClick} />
        ))}
      </div>
      <DragOverlay>
        {activeItem ? (
          <div className="w-[280px] opacity-100 cursor-grabbing drop-shadow-2xl scale-105 transition-transform origin-top-left">
            <SortableItemCard item={activeItem} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

