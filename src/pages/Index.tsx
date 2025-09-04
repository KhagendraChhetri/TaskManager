// Task Management App - Main page with full CRUD functionality

import { useState, useEffect, useMemo } from 'react';
import { Plus, CheckCircle2, ListTodo } from 'lucide-react';
import { Task, TaskStatus, TaskFormData, TaskPriority } from '@/types/task';
import { loadTasks, saveTasks, generateId } from '@/utils/localStorage';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { TaskFilters } from '@/components/TaskFilters';
import { AppSidebar } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { 
  SidebarProvider, 
  SidebarTrigger, 
  SidebarInset 
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [activeFilter, setActiveFilter] = useState<TaskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'createdAt' | 'status'>('dueDate');
  const { toast } = useToast();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = loadTasks();
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = activeFilter === 'all' 
      ? tasks 
      : tasks.filter(task => task.status === activeFilter);

    return filtered.sort((a, b) => {
      // Always prioritize high priority tasks
      const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then sort by selected criteria
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'status':
          const statusOrder = { 'pending': 0, 'in-progress': 1, 'completed': 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });
  }, [tasks, activeFilter, sortBy]);

  // Calculate task counts for filters
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  }), [tasks]);

  const handleCreateTask = (data: TaskFormData) => {
    const newTask: Task = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task created!",
      description: `"${data.title}" has been added to your tasks.`,
    });
  };

  const handleUpdateTask = (data: TaskFormData) => {
    if (!editingTask) return;

    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...data, updatedAt: new Date().toISOString() }
        : task
    ));

    toast({
      title: "Task updated!",
      description: `"${data.title}" has been updated successfully.`,
    });
    setEditingTask(undefined);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(task => task.id !== taskId));
    
    if (taskToDelete) {
      toast({
        title: "Task deleted",
        description: `"${taskToDelete.title}" has been removed from your tasks.`,
        variant: "destructive"
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    // For now, clicking a task opens it for editing
    // In a more complex app, this could open a detailed view
    handleEditTask(task);
  };

  const openNewTaskForm = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar onNewTask={openNewTaskForm} />
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <div className="bg-gradient-primary text-primary-foreground">
            <div className="px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="text-white hover:bg-white/10" />
                  <div className="p-2 bg-white/10 rounded-xl">
                    <ListTodo className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Task Manager</h1>
                    <p className="text-primary-foreground/80 text-sm">
                      Stay organized and get things done
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={openNewTaskForm}
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-medium"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Task
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 py-8">
            {/* Filters and Stats */}
            <div className="mb-8">
              <TaskFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                taskCounts={taskCounts}
              />
            </div>

            {/* Task List */}
            <div className="space-y-4">
              {filteredAndSortedTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-muted/30 rounded-2xl inline-block mb-4">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {activeFilter === 'all' ? 'No tasks yet' : `No ${activeFilter.replace('-', ' ')} tasks`}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {activeFilter === 'all' 
                      ? 'Create your first task to get started!' 
                      : `You don't have any ${activeFilter.replace('-', ' ')} tasks right now.`}
                  </p>
                  {activeFilter === 'all' && (
                    <Button onClick={openNewTaskForm} size="lg" className="bg-gradient-primary">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Your First Task
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredAndSortedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onClick={handleTaskClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Task Form Modal */}
          <TaskForm
            task={editingTask}
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setEditingTask(undefined);
            }}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;