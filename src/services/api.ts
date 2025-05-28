
import { Task, User, CreateTaskRequest, UpdateTaskRequest, LoginRequest, RegisterRequest, ApiResponse, TaskStatus } from '../types';

// Simulação de banco SQLite usando localStorage
class TaskManagerAPI {
  private readonly USERS_KEY = 'taskmanager_users';
  private readonly TASKS_KEY = 'taskmanager_tasks';
  private readonly AUTH_KEY = 'taskmanager_auth';

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.TASKS_KEY)) {
      localStorage.setItem(this.TASKS_KEY, JSON.stringify([]));
    }
  }

  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private getTasks(): Task[] {
    return JSON.parse(localStorage.getItem(this.TASKS_KEY) || '[]');
  }

  private saveTasks(tasks: Task[]) {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private generateJWT(userId: string): string {
    // Simulação simples de JWT - em produção usaria biblioteca apropriada
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 24 * 60 * 60 * 1000 }));
    const signature = btoa(`signature_${userId}`);
    return `${header}.${payload}.${signature}`;
  }

  private validateToken(token: string): string | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp < Date.now()) return null;
      
      return payload.userId;
    } catch {
      return null;
    }
  }

  // AUTH ENDPOINTS

  async register(data: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    console.log('POST /auth/register', data);
    
    const users = this.getUsers();
    
    if (users.find(u => u.username === data.username)) {
      return { success: false, error: 'Username already exists' };
    }

    const user: User = {
      id: this.generateId(),
      username: data.username,
      password: data.password, // Em produção, seria hasheado
      createdAt: new Date().toISOString()
    };

    users.push(user);
    this.saveUsers(users);

    const token = this.generateJWT(user.id);
    
    return { 
      success: true, 
      data: { user: { ...user, password: '' }, token },
      message: 'User registered successfully'
    };
  }

  async login(data: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    console.log('POST /auth/login', data);
    
    const users = this.getUsers();
    const user = users.find(u => u.username === data.username && u.password === data.password);
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const token = this.generateJWT(user.id);
    
    return { 
      success: true, 
      data: { user: { ...user, password: '' }, token },
      message: 'Login successful'
    };
  }

  // TASK ENDPOINTS

  async getTasks(token: string): Promise<ApiResponse<Task[]>> {
    console.log('GET /tasks');
    
    const userId = this.validateToken(token);
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const tasks = this.getTasks().filter(task => task.userId === userId);
    return { success: true, data: tasks };
  }

  async createTask(token: string, data: CreateTaskRequest): Promise<ApiResponse<Task>> {
    console.log('POST /tasks', data);
    
    const userId = this.validateToken(token);
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const tasks = this.getTasks();
    const newTask: Task = {
      id: this.generateId(),
      title: data.title,
      description: data.description,
      status: data.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId
    };

    tasks.push(newTask);
    this.saveTasks(tasks);

    return { success: true, data: newTask, message: 'Task created successfully' };
  }

  async updateTask(token: string, taskId: string, data: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    console.log(`PUT /tasks/${taskId}`, data);
    
    const userId = this.validateToken(token);
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId && task.userId === userId);
    
    if (taskIndex === -1) {
      return { success: false, error: 'Task not found' };
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    this.saveTasks(tasks);

    return { success: true, data: updatedTask, message: 'Task updated successfully' };
  }

  async deleteTask(token: string, taskId: string): Promise<ApiResponse<void>> {
    console.log(`DELETE /tasks/${taskId}`);
    
    const userId = this.validateToken(token);
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId && task.userId === userId);
    
    if (taskIndex === -1) {
      return { success: false, error: 'Task not found' };
    }

    tasks.splice(taskIndex, 1);
    this.saveTasks(tasks);

    return { success: true, message: 'Task deleted successfully' };
  }
}

export const api = new TaskManagerAPI();
