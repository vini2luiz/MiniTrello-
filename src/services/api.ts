
import { 
  Task, 
  User, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  LoginRequest, 
  RegisterRequest, 
  ApiResponse,
  TaskStatus 
} from '../types';

class TaskManagerAPI {
  private users: User[] = [];
  private tasks: Task[] = [];
  private currentUserId: string | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const users = localStorage.getItem('taskmanager_users');
    const tasks = localStorage.getItem('taskmanager_tasks');
    
    if (users) {
      this.users = JSON.parse(users);
    }
    
    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
  }

  private saveToStorage() {
    localStorage.setItem('taskmanager_users', JSON.stringify(this.users));
    localStorage.setItem('taskmanager_tasks', JSON.stringify(this.tasks));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateToken(userId: string): string {
    return btoa(JSON.stringify({ userId, timestamp: Date.now() }));
  }

  private validateToken(token: string): string | null {
    try {
      const decoded = JSON.parse(atob(token));
      return decoded.userId;
    } catch {
      return null;
    }
  }

  async register(credentials: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    const existingUser = this.users.find(u => u.username === credentials.username);
    if (existingUser) {
      return {
        success: false,
        error: 'Usuário já existe'
      };
    }

    const user: User = {
      id: this.generateId(),
      username: credentials.username,
      password: credentials.password, // Em produção, seria hasheado
      createdAt: new Date().toISOString()
    };

    this.users.push(user);
    this.saveToStorage();

    const token = this.generateToken(user.id);

    return {
      success: true,
      data: { user, token }
    };
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = this.users.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      return {
        success: false,
        error: 'Credenciais inválidas'
      };
    }

    const token = this.generateToken(user.id);

    return {
      success: true,
      data: { user, token }
    };
  }

  async getTasks(token: string): Promise<ApiResponse<Task[]>> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));

    const userId = this.validateToken(token);
    if (!userId) {
      return {
        success: false,
        error: 'Token inválido'
      };
    }

    const userTasks = this.tasks.filter(task => task.userId === userId);

    return {
      success: true,
      data: userTasks
    };
  }

  async createTask(token: string, taskData: CreateTaskRequest): Promise<ApiResponse<Task>> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 400));

    const userId = this.validateToken(token);
    if (!userId) {
      return {
        success: false,
        error: 'Token inválido'
      };
    }

    const task: Task = {
      id: this.generateId(),
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || 'pending',
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.tasks.push(task);
    this.saveToStorage();

    return {
      success: true,
      data: task
    };
  }

  async updateTask(token: string, taskId: string, updates: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 400));

    const userId = this.validateToken(token);
    if (!userId) {
      return {
        success: false,
        error: 'Token inválido'
      };
    }

    const taskIndex = this.tasks.findIndex(task => task.id === taskId && task.userId === userId);
    if (taskIndex === -1) {
      return {
        success: false,
        error: 'Tarefa não encontrada'
      };
    }

    const task = this.tasks[taskIndex];
    this.tasks[taskIndex] = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage();

    return {
      success: true,
      data: this.tasks[taskIndex]
    };
  }

  async deleteTask(token: string, taskId: string): Promise<ApiResponse<void>> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));

    const userId = this.validateToken(token);
    if (!userId) {
      return {
        success: false,
        error: 'Token inválido'
      };
    }

    const taskIndex = this.tasks.findIndex(task => task.id === taskId && task.userId === userId);
    if (taskIndex === -1) {
      return {
        success: false,
        error: 'Tarefa não encontrada'
      };
    }

    this.tasks.splice(taskIndex, 1);
    this.saveToStorage();

    return {
      success: true
    };
  }
}

export const api = new TaskManagerAPI();
