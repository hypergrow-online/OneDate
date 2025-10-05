import { useState, useEffect } from 'react';
import { taskService } from '../services/tasks';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Circle, Clock, CheckCircle2 } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, formData);
      } else {
        await taskService.createTask(formData);
      }
      loadTasks();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await taskService.deleteTask(id);
        loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
    });
    setEditingTask(null);
  };

  const groupedTasks = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    done: tasks.filter(t => t.status === 'done'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Tareas</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus tareas con el tablero Kanban
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pendientes */}
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Circle className="h-5 w-5" />
              Pendientes
              <Badge variant="secondary" className="ml-auto">
                {groupedTasks.todo.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {groupedTasks.todo.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay tareas pendientes
              </p>
            ) : (
              groupedTasks.todo.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            )}
          </CardContent>
        </Card>

        {/* En Proceso */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Clock className="h-5 w-5" />
              En Proceso
              <Badge variant="secondary" className="ml-auto">
                {groupedTasks.in_progress.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {groupedTasks.in_progress.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay tareas en proceso
              </p>
            ) : (
              groupedTasks.in_progress.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Completadas */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              Completadas
              <Badge variant="secondary" className="ml-auto">
                {groupedTasks.done.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {groupedTasks.done.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay tareas completadas
              </p>
            ) : (
              groupedTasks.done.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
            <DialogDescription>
              {editingTask ? 'Modifica los detalles de tu tarea' : 'Crea una nueva tarea para tu tablero'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nombre de la tarea"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles de la tarea (opcional)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Pendiente</SelectItem>
                      <SelectItem value="in_progress">En Proceso</SelectItem>
                      <SelectItem value="done">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingTask ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete }) {
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      urgent: 'Urgente',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja',
    };
    return labels[priority] || priority;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-sm flex-1 pr-2">{task.title}</h3>
          <Badge variant={getPriorityVariant(task.priority)} className="text-xs">
            {getPriorityLabel(task.priority)}
          </Badge>
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(task)}
            className="h-8 gap-1"
          >
            <Edit2 className="h-3 w-3" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(task.id)}
            className="h-8 gap-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
