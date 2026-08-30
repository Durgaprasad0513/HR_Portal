import React from 'react';
import { Button } from '@/components/ui/Button';
import { ShiftBadge } from '@/components/ui/ShiftBadge';
import { StationCard } from '@/components/ui/StationCard';
import { Plus, Send, Settings2, Trash2 } from 'lucide-react';

export default function InteractiveShowcase() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-text-heading mb-2">Modern Food-Tech UI Showcase</h1>
        <p className="text-text-muted">Interactive components using the updated CSS token architecture.</p>
      </div>

      <section>
        <h2 className="text-xl font-bold text-text-heading mb-6 border-b border-slate-border pb-2">1. Interactive Buttons</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Primary (Brand)</h3>
            <div className="flex flex-col gap-3 items-start">
              <Button variant="primary">Primary Action</Button>
              <Button variant="primary" isLoading>Loading State</Button>
              <Button variant="primary" className="gap-2"><Plus className="w-4 h-4" /> With Icon</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Dark Slate</h3>
            <div className="flex flex-col gap-3 items-start">
              <Button variant="dark">Navigation Action</Button>
              <Button variant="dark" isLoading>Processing...</Button>
              <Button variant="dark" className="gap-2">Settings <Settings2 className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Secondary / Outline</h3>
            <div className="flex flex-col gap-3 items-start">
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="outline">Outline Action</Button>
              <Button variant="ghost">Ghost Action</Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Danger</h3>
            <div className="flex flex-col gap-3 items-start">
              <Button variant="danger">Delete Item</Button>
              <Button variant="danger" className="gap-2"><Trash2 className="w-4 h-4" /> Remove</Button>
              <Button variant="outline" className="text-status-danger border-status-danger/30 hover:bg-status-danger-bg">Soft Danger</Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-heading mb-6 border-b border-slate-border pb-2">2. Shift Badges (Operational Status)</h2>
        <div className="flex flex-wrap gap-4">
          <ShiftBadge status="active" />
          <ShiftBadge status="standby" />
          <ShiftBadge status="warning" />
          <ShiftBadge status="danger" />
          
          <ShiftBadge status="active" label="Cooking - Line 1" />
          <ShiftBadge status="warning" label="SLA Warning" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-text-heading mb-6 border-b border-slate-border pb-2">3. Station Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StationCard 
            stationName="Hot Kitchen (Grill)"
            activeCount={4}
            totalCount={6}
            overallStatus="active"
          />
          <StationCard 
            stationName="Cold Prep Station"
            activeCount={2}
            totalCount={3}
            overallStatus="standby"
          />
          <StationCard 
            stationName="Dispatch & Packing"
            activeCount={1}
            totalCount={5}
            overallStatus="danger"
          />
        </div>
      </section>
    </div>
  );
}
