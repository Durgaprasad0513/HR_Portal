import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Heart, Shield, Users, Lightbulb, ChevronRight } from 'lucide-react';

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      category: 'Health & Wellness',
      title: 'New wellness program launched for all employees',
      date: 'Dec 15, 2023',
      author: 'HR Department',
      icon: <Heart className="w-6 h-6 text-pink-500" />,
      bgColor: 'bg-pink-100',
    },
    {
      id: 2,
      category: 'Security',
      title: 'Mandatory cybersecurity training updated',
      date: 'Dec 10, 2023',
      author: 'IT Security',
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-100',
    },
    {
      id: 3,
      category: 'Company Culture',
      title: 'Highlights from our annual team building event',
      date: 'Nov 28, 2023',
      author: 'Culture Team',
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      bgColor: 'bg-emerald-100',
    },
    {
      id: 4,
      category: 'Innovation',
      title: 'Q4 Hackathon winners announced!',
      date: 'Nov 15, 2023',
      author: 'Engineering',
      icon: <Lightbulb className="w-6 h-6 text-amber-500" />,
      bgColor: 'bg-amber-100',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Company News</h1>
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            placeholder="Search news..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-4 animate-in fade-in">
        {newsItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow group cursor-pointer">
            <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-6">
              
              <div className={`shrink-0 w-16 h-16 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                {item.icon}
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-accent-600">{item.category}</p>
                <h3 className="text-lg font-bold text-navy-900 group-hover:text-accent-500 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.author}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center sm:self-center self-end">
                <Button variant="ghost" className="text-accent-600 hover:text-accent-700 hover:bg-accent-50 group-hover:bg-accent-50">
                  Read more <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button variant="outline" className="text-navy-900">Load More News</Button>
      </div>
    </div>
  );
}
