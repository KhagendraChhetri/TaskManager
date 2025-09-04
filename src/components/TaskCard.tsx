// Individual task card component with status and priority styling

import { Calendar, Clock, Edit3, Trash2, AlertCircle, Minus, ArrowUp } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onClick: (task: Task) => void;
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  pending: { 
    label: 'Pending', 
    className: 'bg-status-pending text-status-pending-foreground hover:bg-status-pending/90' 
  },
  'in-progress': { 
    label: 'In Progress', 
    className: 'bg-status-in-progress text-status-in-progress-foreground hover:bg-status-in-progress/90' 
  },
  completed: { 
    label: 'Completed', 
    className: 'bg-status-completed text-status-completed-foreground hover:bg-status-completed/90' 
  }
};

const priorityConfig: Record<TaskPriority, { 
  label: string; 
  className: string; 
  icon: React.ComponentType<{ className?: string }>;
  cardAccent: string;
}> = {
  low: { 
    label: 'Low', 
    className: 'bg-priority-low text-priority-low-foreground hover:bg-priority-low/90 border border-priority-low/20',
    icon: Minus,
    cardAccent: 'border-l-priority-low/30'
  },
  medium: { 
    label: 'Medium', 
    className: 'bg-priority-medium text-priority-medium-foreground hover:bg-priority-medium/90',
    icon: AlertCircle,
    cardAccent: 'border-l-priority-medium'
  },
  high: { 
    label: 'High', 
    className: 'bg-priority-high text-priority-high-foreground hover:bg-priority-high/90',
    icon: ArrowUp,
    cardAccent: 'border-l-priority-high'
  }
};

export const TaskCard = ({ task, onEdit, onDelete, onClick }: TaskCardProps) => {
  const statusStyle = statusConfig[task.status];
  const priorityStyle = priorityConfig[task.priority];
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <Card 
      className={`group hover:shadow-medium transition-all duration-300 cursor-pointer bg-gradient-card animate-slide-up border-l-4 ${priorityStyle.cardAccent}`}
      onClick={() => onClick(task)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
              {task.title}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {task.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge className={priorityStyle.className}>
              <priorityStyle.icon className="h-3 w-3 mr-1" />
              {priorityStyle.label}
            </Badge>
            <Badge className={statusStyle.className}>
              {statusStyle.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-destructive' : ''}`}>
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(task.updatedAt), 'MMM dd')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
              onClick={handleEdit}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};