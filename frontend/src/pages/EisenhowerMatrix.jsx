import { useState, useEffect } from 'react';
import { taskService } from '../services/tasks';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, ArrowRight, AlertCircle, Clock, Brain, Coffee } from 'lucide-react';

export default function EisenhowerMatrix() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eisenhower_quadrant: 'urgent_important',
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
      const taskData = {
        ...formData,
        status: 'backlog'
      };
      
      if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData);
      } else {
        await taskService.createTask(taskData);
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
      eisenhower_quadrant: task.eisenhower_quadrant || 'urgent_important',
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

  const handleMoveToKanban = async (task) => {
    try {
      await taskService.updateTask(task.id, {
        status: 'todo',
        eisenhower_quadrant: null
      });
      loadTasks();
    } catch (error) {
      console.error('Error moving task to kanban:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eisenhower_quadrant: 'urgent_important',
    });
    setEditingTask(null);
  };

  const groupedTasks = {
    urgent_important: tasks.filter(t => t.status === 'backlog' && t.eisenhower_quadrant === 'urgent_important'),
    urgent_not_important: tasks.filter(t => t.status === 'backlog' && t.eisenhower_quadrant === 'urgent_not_important'),
    not_urgent_important: tasks.filter(t => t.status === 'backlog' && t.eisenhower_quadrant === 'not_urgent_important'),
    not_urgent_not_important: tasks.filter(t => t.status === 'backlog' && t.eisenhower_quadrant === 'not_urgent_not_important'),
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
          <h1 className="text-4xl font-bold tracking-tight">Matriz de Eisenhower</h1>
          <p className="text-muted-foreground mt-2">
            Organiza tus tareas por urgencia e importancia
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      {/* Eisenhower Matrix - 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent & Important */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-2 border-red-300 dark:border-red-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              Urgente e Importante
              <Badge variant="destructive" className="ml-auto">
                {groupedTasks.urgent_important.length}
              </Badge>
            </CardTitle>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Hacer ahora - Crisis/Emergencias</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {groupedTasks.urgent_important.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay tareas urgentes e importantes
              </p>
            ) : (
              groupedTasks.urgent_important.map((task) => (
                <MatrixTaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                  onMoveToKanban={handleMoveToKanban}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Urgent & Not Important */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-2 border-orange-300 dark:border-orange-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <Clock className="h-5 w-5" />
              Urgente / No Importante
              <Badge variant="secondary" className="ml-auto bg-orange-200 dark:bg-orange-800">
                {groupedTasks.urgent_not_important.length}
              </Badge>
            </CardTitle>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Delegar - Interrupciones</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {groupedTasks.urgent_not_important.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay tareas urgentes pero no importantes
              </p>
            ) : (
              groupedTasks.urgent_not_important.map((task) => (
                <MatrixTaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                  onMoveToKanban={handleMoveToKanban}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Not Urgent & Important */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-2 border-blue-300 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Brain className="h-5 w-5" />
              Importante / No Urgente
              <Badge variant="secondary" className="ml-auto bg-blue-200 dark:bg-blue-800">
                {groupedTasks.not_urgent_important.length}
              </Badge>
            </CardTitle>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Planificar - Objetivos a largo plazo</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {groupedTasks.not_urgent_important.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay tareas importantes pero no urgentes
              </p>
            ) : (
              groupedTasks.not_urgent_important.map((task) => (
                <MatrixTaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                  onMoveToKanban={handleMoveToKanban}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Not Urgent & Not Important */}
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 border-slate-300 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Coffee className="h-5 w-5" />
              No Urgente / No Importante
              <Badge variant="secondary" className="ml-auto bg-slate-200 dark:bg-slate-700">
                {groupedTasks.not_urgent_not_important.length}
              </Badge>
            </CardTitle>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Eliminar - Distracciones</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {groupedTasks.not_urgent_not_important.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay tareas no urgentes ni importantes
              </p>
            ) : (
              groupedTasks.not_urgent_not_important.map((task) => (
                <MatrixTaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                  onMoveToKanban={handleMoveToKanban}
                />
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
              {editingTask ? 'Modifica los detalles de tu tarea' : 'Crea una nueva tarea en la matriz de Eisenhower'}
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
              <div className="grid gap-2">
                <Label htmlFor="quadrant">Cuadrante</Label>
                <select
                  id="quadrant"
                  value={formData.eisenhower_quadrant}
                  onChange={(e) => setFormData({ ...formData, eisenhower_quadrant: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="urgent_important">Urgente e Importante</option>
                  <option value="urgent_not_important">Urgente / No Importante</option>
                  <option value="not_urgent_important">Importante / No Urgente</option>
                  <option value="not_urgent_not_important">No Urgente / No Importante</option>
                </select>
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

function MatrixTaskCard({ task, onEdit, onDelete, onMoveToKanban }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-sm flex-1 pr-2">{task.title}</h3>
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
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
          <Button
            size="sm"
            variant="default"
            onClick={() => onMoveToKanban(task)}
            className="h-8 gap-1"
          >
            <ArrowRight className="h-3 w-3" />
            A Kanban
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
