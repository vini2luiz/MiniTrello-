
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, LogOut, User, Calendar, Clock, Trash2, Edit3, Trello } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Task, TaskStatus } from '../types';
import { api } from '../services/api';
import { toast } from '@/hooks/use-toast';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';

const TaskBoard = () => {
  const { user, logout, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const statusConfig = {
    pending: {
      title: 'Pendente',
      color: 'bg-yellow-100 border-yellow-300',
      badge: 'bg-yellow-500',
      count: tasks.filter(t => t.status === 'pending').length
    },
    progress: {
      title: 'Em Progresso',
      color: 'bg-blue-100 border-blue-300',
      badge: 'bg-blue-500',
      count: tasks.filter(t => t.status === 'progress').length
    },
    completed: {
      title: 'Concluído',
      color: 'bg-green-100 border-green-300',
      badge: 'bg-green-500',
      count: tasks.filter(t => t.status === 'completed').length
    }
  };

  const loadTasks = async () => {
    if (!token) return;
    
    try {
      const response = await api.getTasks(token);
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        toast({
          title: "Erro ao carregar tarefas",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar tarefas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [token]);

  const handleCreateTask = async (taskData: { title: string; description: string; status?: TaskStatus }) => {
    if (!token) return;
    
    try {
      const response = await api.createTask(token, taskData);
      if (response.success && response.data) {
        setTasks(prev => [...prev, response.data!]);
        setShowTaskForm(false);
        toast({
          title: "Tarefa criada!",
          description: "Nova tarefa adicionada com sucesso",
        });
      } else {
        toast({
          title: "Erro ao criar tarefa",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: { title?: string; description?: string; status?: TaskStatus }) => {
    if (!token) return;
    
    try {
      const response = await api.updateTask(token, taskId, updates);
      if (response.success && response.data) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? response.data! : task
        ));
        setEditingTask(null);
        toast({
          title: "Tarefa atualizada!",
          description: "Tarefa modificada com sucesso",
        });
      } else {
        toast({
          title: "Erro ao atualizar tarefa",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!token) return;
    
    try {
      const response = await api.deleteTask(token, taskId);
      if (response.success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        toast({
          title: "Tarefa removida!",
          description: "Tarefa excluída com sucesso",
        });
      } else {
        toast({
          title: "Erro ao remover tarefa",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    handleUpdateTask(taskId, { status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Trello className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TaskManager
                </h1>
                <p className="text-sm text-gray-600">Sistema de Gerenciamento de Tarefas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">{user?.username}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Tarefas</p>
                  <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {Object.entries(statusConfig).map(([status, config]) => (
            <Card key={status} className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{config.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{config.count}</p>
                  </div>
                  <Badge className={`${config.badge} text-white px-3 py-1`}>
                    {config.count}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Minhas Tarefas</h2>
          <Button
            onClick={() => setShowTaskForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Task Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className={`${config.color} rounded-lg p-4 border-2`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">{config.title}</h3>
                <Badge className={`${config.badge} text-white`}>
                  {config.count}
                </Badge>
              </div>
              
              <div className="space-y-3">
                {tasks
                  .filter(task => task.status === status)
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={setEditingTask}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                
                {tasks.filter(task => task.status === status).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma tarefa</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showTaskForm || !!editingTask}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? 
          (data) => handleUpdateTask(editingTask.id, data) : 
          handleCreateTask
        }
        task={editingTask}
        mode={editingTask ? 'edit' : 'create'}
      />
    </div>
  );
};

export default TaskBoard;
