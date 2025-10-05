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
import { Plus, Edit2, Trash2, Circle, Clock, CheckCircle2, Play, Pause, CheckCheck, Timer, Eye, X, Link as LinkIcon, FileText, Target, CheckSquare } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: [],
    main_objectives: [],
    secondary_objectives: [],
    resources: [],
    resource_links: [],
    additional_notes: '',
    subtasks: []
  });
  const [tempInput, setTempInput] = useState({
    tag: '',
    main_objective: '',
    secondary_objective: '',
    resource_name: '',
    resource_url: '',
    resource_description: '',
    resource_link: '',
    subtask: ''
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
      tags: task.tags || [],
      main_objectives: task.main_objectives || [],
      secondary_objectives: task.secondary_objectives || [],
      resources: task.resources || [],
      resource_links: task.resource_links || [],
      additional_notes: task.additional_notes || '',
      subtasks: task.subtasks || []
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
      tags: [],
      main_objectives: [],
      secondary_objectives: [],
      resources: [],
      resource_links: [],
      additional_notes: '',
      subtasks: []
    });
    setTempInput({
      tag: '',
      main_objective: '',
      secondary_objective: '',
      resource_name: '',
      resource_url: '',
      resource_description: '',
      resource_link: '',
      subtask: ''
    });
    setEditingTask(null);
  };

  // Helper functions for managing arrays in form
  const addTag = () => {
    if (tempInput.tag.trim()) {
      setFormData({ ...formData, tags: [...formData.tags, tempInput.tag.trim()] });
      setTempInput({ ...tempInput, tag: '' });
    }
  };

  const removeTag = (index) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
  };

  const addMainObjective = () => {
    if (tempInput.main_objective.trim()) {
      setFormData({ ...formData, main_objectives: [...formData.main_objectives, tempInput.main_objective.trim()] });
      setTempInput({ ...tempInput, main_objective: '' });
    }
  };

  const removeMainObjective = (index) => {
    setFormData({ ...formData, main_objectives: formData.main_objectives.filter((_, i) => i !== index) });
  };

  const addSecondaryObjective = () => {
    if (tempInput.secondary_objective.trim()) {
      setFormData({ ...formData, secondary_objectives: [...formData.secondary_objectives, tempInput.secondary_objective.trim()] });
      setTempInput({ ...tempInput, secondary_objective: '' });
    }
  };

  const removeSecondaryObjective = (index) => {
    setFormData({ ...formData, secondary_objectives: formData.secondary_objectives.filter((_, i) => i !== index) });
  };

  const addResource = () => {
    if (tempInput.resource_name.trim()) {
      const newResource = {
        name: tempInput.resource_name.trim(),
        url: tempInput.resource_url.trim() || null,
        description: tempInput.resource_description.trim() || null
      };
      setFormData({ ...formData, resources: [...formData.resources, newResource] });
      setTempInput({ ...tempInput, resource_name: '', resource_url: '', resource_description: '' });
    }
  };

  const removeResource = (index) => {
    setFormData({ ...formData, resources: formData.resources.filter((_, i) => i !== index) });
  };

  const addResourceLink = () => {
    if (tempInput.resource_link.trim()) {
      setFormData({ ...formData, resource_links: [...formData.resource_links, tempInput.resource_link.trim()] });
      setTempInput({ ...tempInput, resource_link: '' });
    }
  };

  const removeResourceLink = (index) => {
    setFormData({ ...formData, resource_links: formData.resource_links.filter((_, i) => i !== index) });
  };

  const addSubtask = () => {
    if (tempInput.subtask.trim()) {
      const newSubtask = {
        id: Date.now().toString(),
        title: tempInput.subtask.trim(),
        completed: false
      };
      setFormData({ ...formData, subtasks: [...formData.subtasks, newSubtask] });
      setTempInput({ ...tempInput, subtask: '' });
    }
  };

  const removeSubtask = (index) => {
    setFormData({ ...formData, subtasks: formData.subtasks.filter((_, i) => i !== index) });
  };

  const toggleSubtask = (index) => {
    const updatedSubtasks = [...formData.subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    setFormData({ ...formData, subtasks: updatedSubtasks });
  };

  const viewTaskDetails = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const groupedTasks = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    done: tasks.filter(t => t.status === 'done'),
  };

  const handleTimerAction = async (taskId, action) => {
    try {
      if (action === 'start') {
        await taskService.startTimer(taskId);
      } else if (action === 'pause') {
        await taskService.pauseTimer(taskId);
      } else if (action === 'complete') {
        await taskService.completeTask(taskId);
      }
      loadTasks();
    } catch (error) {
      console.error('Error with timer action:', error);
    }
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
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                  onTimerAction={handleTimerAction}
                  onViewDetails={viewTaskDetails}
                />
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
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                  onTimerAction={handleTimerAction}
                  onViewDetails={viewTaskDetails}
                />
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
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                  onTimerAction={handleTimerAction}
                  onViewDetails={viewTaskDetails}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
            <DialogDescription>
              {editingTask ? 'Modifica los detalles de tu tarea' : 'Crea una nueva tarea para tu tablero'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Title */}
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

              {/* Description */}
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

              {/* Status and Priority */}
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
                      <SelectItem value="backlog">Backlog</SelectItem>
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

              {/* Tags */}
              <div className="grid gap-2">
                <Label>Etiquetas</Label>
                <div className="flex gap-2">
                  <Input
                    value={tempInput.tag}
                    onChange={(e) => setTempInput({ ...tempInput, tag: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Agregar etiqueta"
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Objectives */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Objetivos Principales
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={tempInput.main_objective}
                    onChange={(e) => setTempInput({ ...tempInput, main_objective: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMainObjective())}
                    placeholder="Agregar objetivo principal"
                  />
                  <Button type="button" onClick={addMainObjective} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.main_objectives.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {formData.main_objectives.map((obj, index) => (
                      <li key={index} className="text-sm flex items-center justify-between">
                        <span className="flex-1">{obj}</span>
                        <X
                          className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
                          onClick={() => removeMainObjective(index)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Secondary Objectives */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Objetivos Secundarios
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={tempInput.secondary_objective}
                    onChange={(e) => setTempInput({ ...tempInput, secondary_objective: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSecondaryObjective())}
                    placeholder="Agregar objetivo secundario"
                  />
                  <Button type="button" onClick={addSecondaryObjective} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.secondary_objectives.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {formData.secondary_objectives.map((obj, index) => (
                      <li key={index} className="text-sm flex items-center justify-between">
                        <span className="flex-1">{obj}</span>
                        <X
                          className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
                          onClick={() => removeSecondaryObjective(index)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Resources */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Recursos
                </Label>
                <div className="space-y-2">
                  <Input
                    value={tempInput.resource_name}
                    onChange={(e) => setTempInput({ ...tempInput, resource_name: e.target.value })}
                    placeholder="Nombre del recurso"
                  />
                  <Input
                    value={tempInput.resource_url}
                    onChange={(e) => setTempInput({ ...tempInput, resource_url: e.target.value })}
                    placeholder="URL del recurso (opcional)"
                  />
                  <Input
                    value={tempInput.resource_description}
                    onChange={(e) => setTempInput({ ...tempInput, resource_description: e.target.value })}
                    placeholder="Descripción del recurso (opcional)"
                  />
                  <Button type="button" onClick={addResource} size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Recurso
                  </Button>
                </div>
                {formData.resources.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.resources.map((resource, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{resource.name}</p>
                            {resource.url && (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <LinkIcon className="h-3 w-3" />
                                {resource.url}
                              </a>
                            )}
                            {resource.description && (
                              <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                            )}
                          </div>
                          <X
                            className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
                            onClick={() => removeResource(index)}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Resource Links */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Enlaces de Recursos
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={tempInput.resource_link}
                    onChange={(e) => setTempInput({ ...tempInput, resource_link: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResourceLink())}
                    placeholder="Agregar enlace"
                  />
                  <Button type="button" onClick={addResourceLink} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.resource_links.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {formData.resource_links.map((link, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 flex-1 truncate"
                        >
                          <LinkIcon className="h-3 w-3" />
                          {link}
                        </a>
                        <X
                          className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
                          onClick={() => removeResourceLink(index)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Subtasks */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  Subtareas
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={tempInput.subtask}
                    onChange={(e) => setTempInput({ ...tempInput, subtask: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                    placeholder="Agregar subtarea"
                  />
                  <Button type="button" onClick={addSubtask} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.subtasks.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.subtasks.map((subtask, index) => (
                      <div key={subtask.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => toggleSubtask(index)}
                          className="h-4 w-4"
                        />
                        <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {subtask.title}
                        </span>
                        <X
                          className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-destructive"
                          onClick={() => removeSubtask(index)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div className="grid gap-2">
                <Label htmlFor="additional_notes">Notas Adicionales</Label>
                <Textarea
                  id="additional_notes"
                  rows={3}
                  value={formData.additional_notes}
                  onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                  placeholder="Notas adicionales sobre la tarea (opcional)"
                />
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

      {/* Detail View Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedTask?.title}</DialogTitle>
            <DialogDescription>
              Detalles completos de la tarea
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4 py-4">
              {/* Status and Priority */}
              <div className="flex gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Estado</p>
                  <Badge variant="outline">
                    {selectedTask.status === 'todo' && 'Pendiente'}
                    {selectedTask.status === 'in_progress' && 'En Proceso'}
                    {selectedTask.status === 'done' && 'Completada'}
                    {selectedTask.status === 'backlog' && 'Backlog'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Prioridad</p>
                  <Badge variant={
                    selectedTask.priority === 'urgent' ? 'destructive' :
                    selectedTask.priority === 'high' ? 'default' :
                    selectedTask.priority === 'medium' ? 'secondary' : 'outline'
                  }>
                    {selectedTask.priority === 'urgent' && 'Urgente'}
                    {selectedTask.priority === 'high' && 'Alta'}
                    {selectedTask.priority === 'medium' && 'Media'}
                    {selectedTask.priority === 'low' && 'Baja'}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              {selectedTask.description && (
                <div>
                  <p className="text-sm font-medium mb-2">Descripción</p>
                  <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                </div>
              )}

              {/* Tags */}
              {selectedTask.tags && selectedTask.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Etiquetas</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Objectives */}
              {selectedTask.main_objectives && selectedTask.main_objectives.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Objetivos Principales
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedTask.main_objectives.map((obj, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Secondary Objectives */}
              {selectedTask.secondary_objectives && selectedTask.secondary_objectives.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Objetivos Secundarios
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedTask.secondary_objectives.map((obj, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resources */}
              {selectedTask.resources && selectedTask.resources.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Recursos
                  </p>
                  <div className="space-y-2">
                    {selectedTask.resources.map((resource, index) => (
                      <Card key={index} className="p-3">
                        <p className="font-medium text-sm">{resource.name}</p>
                        {resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                          >
                            <LinkIcon className="h-3 w-3" />
                            {resource.url}
                          </a>
                        )}
                        {resource.description && (
                          <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Resource Links */}
              {selectedTask.resource_links && selectedTask.resource_links.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Enlaces de Recursos
                  </p>
                  <div className="space-y-1">
                    {selectedTask.resource_links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <LinkIcon className="h-3 w-3" />
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Subtasks */}
              {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    Subtareas ({selectedTask.subtasks.filter(st => st.completed).length}/{selectedTask.subtasks.length})
                  </p>
                  <div className="space-y-2">
                    {selectedTask.subtasks.map((subtask, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          disabled
                          className="h-4 w-4"
                        />
                        <span className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {selectedTask.additional_notes && (
                <div>
                  <p className="text-sm font-medium mb-2">Notas Adicionales</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedTask.additional_notes}</p>
                </div>
              )}

              {/* Time Tracking */}
              {selectedTask.total_time_spent > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Tiempo Invertido
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const seconds = selectedTask.total_time_spent;
                      const hours = Math.floor(seconds / 3600);
                      const minutes = Math.floor((seconds % 3600) / 60);
                      if (hours > 0) return `${hours}h ${minutes}m`;
                      return `${minutes}m`;
                    })()}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDetailModal(false);
                handleEdit(selectedTask);
              }}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button onClick={() => setShowDetailModal(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onTimerAction, onViewDetails }) {
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

  const formatTime = (seconds) => {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}
        
        {/* Tags Display */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {/* Time Tracking Display */}
        {task.total_time_spent > 0 && (
          <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
            <Timer className="h-3 w-3" />
            <span>Tiempo: {formatTime(task.total_time_spent)}</span>
            {task.is_running && (
              <Badge variant="outline" className="ml-2 text-xs animate-pulse">
                En ejecución
              </Badge>
            )}
          </div>
        )}

        {/* Timer Controls */}
        {task.status !== 'done' && (
          <div className="flex gap-2 mb-3">
            {!task.is_running ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onTimerAction(task.id, 'start')}
                className="h-7 gap-1 flex-1"
              >
                <Play className="h-3 w-3" />
                Ejecutar
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onTimerAction(task.id, 'pause')}
                className="h-7 gap-1 flex-1"
              >
                <Pause className="h-3 w-3" />
                Pausar
              </Button>
            )}
            <Button
              size="sm"
              variant="default"
              onClick={() => onTimerAction(task.id, 'complete')}
              className="h-7 gap-1 flex-1"
            >
              <CheckCheck className="h-3 w-3" />
              Finalizar
            </Button>
          </div>
        )}

        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails(task)}
            className="h-8 gap-1"
          >
            <Eye className="h-3 w-3" />
            Ver
          </Button>
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
