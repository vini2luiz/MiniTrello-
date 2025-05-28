
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Task, TaskStatus } from '../types';
import { MoreVertical, Edit3, Trash2, Clock, Calendar, ArrowRight, CheckCircle, PlayCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'progress':
        return <PlayCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
    }
  };

  const getNextStatus = (currentStatus: TaskStatus): TaskStatus | null => {
    switch (currentStatus) {
      case 'pending':
        return 'progress';
      case 'progress':
        return 'completed';
      case 'completed':
        return null;
    }
  };

  const getNextStatusLabel = (currentStatus: TaskStatus): string => {
    switch (currentStatus) {
      case 'pending':
        return 'Iniciar';
      case 'progress':
        return 'Concluir';
      case 'completed':
        return '';
    }
  };

  const nextStatus = getNextStatus(task.status);

  return (
    <Card className={`task-card group ${`status-${task.status}`}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded-full ${getStatusColor(task.status)} text-white`}>
              {getStatusIcon(task.status)}
            </div>
            <Badge variant="outline" className="text-xs">
              #{task.id.slice(-6)}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
          
          {task.description && (
            <p className="text-sm text-gray-600 line-clamp-3">{task.description}</p>
          )}

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
            
            {task.updatedAt !== task.createdAt && (
              <div className="flex items-center space-x-1">
                <span>Atualizado em</span>
                <span>{format(new Date(task.updatedAt), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          {nextStatus && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(task.id, nextStatus)}
              className="w-full mt-3 hover:bg-blue-50 border-blue-200 text-blue-700"
            >
              <ArrowRight className="h-3 w-3 mr-1" />
              {getNextStatusLabel(task.status)}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
