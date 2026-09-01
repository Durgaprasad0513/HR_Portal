import { useState } from 'react';
import { dashboardApi } from '@/api/dashboard';
import { Button } from '@/components/ui/Button';
import { Download, Users, Briefcase, FileText, Star, Plane } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (type: string) => {
    setDownloading(type);
    try {
      const blob = await dashboardApi.getReports(type);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${type} report downloaded successfully`);
    } catch (err) {
      toast.error(`Failed to download ${type} report`);
    } finally {
      setDownloading(null);
    }
  };

  const reports = [
    { type: 'employees', title: 'Employee Directory', icon: Users, desc: 'Full list of active employees with roles and departments.' },
    { type: 'travel', title: 'Travel Requests', icon: Plane, desc: 'Recent travel requests and expense settlements.' },
    { type: 'assets', title: 'Assigned Assets', icon: FileText, desc: 'All IT and Non-IT assets assigned to employees.' },
    { type: 'recruitment', title: 'Candidate Pipeline', icon: Briefcase, desc: 'Current candidates and their hiring statuses.' },
    { type: 'training', title: 'Training Sessions', icon: Star, desc: 'Past and upcoming trainings and participant counts.' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white mb-6">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.type} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-full bg-accent-50 flex items-center justify-center">
                <report.icon className="h-5 w-5 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white">{report.title}</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-6 flex-1">{report.desc}</p>
            <Button 
              onClick={() => handleDownload(report.type)} 
              disabled={downloading === report.type}
              className="w-full justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {downloading === report.type ? 'Downloading...' : 'Download CSV'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
