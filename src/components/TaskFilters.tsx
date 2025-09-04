// Task filtering and sorting component

import { TaskStatus } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface TaskFiltersProps {
  activeFilter: TaskStatus | 'all';
  onFilterChange: (filter: TaskStatus | 'all') => void;
  sortBy: 'dueDate' | 'createdAt' | 'status';
  onSortChange: (sort: 'dueDate' | 'createdAt' | 'status') => void;
  taskCounts: Record<TaskStatus | 'all', number>;
}

const filterOptions = [
  { value: 'all' as const, label: 'All Tasks', className: 'bg-secondary text-secondary-foreground hover:bg-secondary/80' },
  { value: 'pending' as const, label: 'Pending', className: 'bg-status-pending text-status-pending-foreground hover:bg-status-pending/90' },
  { value: 'in-progress' as const, label: 'In Progress', className: 'bg-status-in-progress text-status-in-progress-foreground hover:bg-status-in-progress/90' },
  { value: 'completed' as const, label: 'Completed', className: 'bg-status-completed text-status-completed-foreground hover:bg-status-completed/90' }
];

const sortOptions = [
  { value: 'dueDate' as const, label: 'Due Date' },
  { value: 'createdAt' as const, label: 'Created Date' },
  { value: 'status' as const, label: 'Status' }
];

export const TaskFilters = ({ 
  activeFilter, 
  onFilterChange, 
  sortBy, 
  onSortChange, 
  taskCounts 
}: TaskFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={activeFilter === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(option.value)}
            className={`
              relative transition-all duration-200 
              ${activeFilter === option.value 
                ? `${option.className} shadow-soft` 
                : 'hover:shadow-soft'
              }
            `}
          >
            <span>{option.label}</span>
            <Badge 
              variant="secondary" 
              className="ml-2 bg-white/20 text-current border-0 text-xs min-w-[20px] h-5"
            >
              {taskCounts[option.value]}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};