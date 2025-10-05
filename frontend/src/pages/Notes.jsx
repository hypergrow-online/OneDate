import { useState, useEffect } from 'react';
import { noteService } from '../services/notes';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Search, X, FolderOpen, StickyNote } from 'lucide-react';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    folder: 'General',
    tags: [],
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await noteService.getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const data = await noteService.searchNotes(searchQuery);
        setNotes(data);
      } catch (error) {
        console.error('Error searching notes:', error);
      }
    } else {
      loadNotes();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await noteService.updateNote(editingNote.id, formData);
      } else {
        await noteService.createNote(formData);
      }
      loadNotes();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      folder: note.folder || 'General',
      tags: note.tags || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      try {
        await noteService.deleteNote(id);
        loadNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      folder: 'General',
      tags: [],
    });
    setEditingNote(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando notas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Notas</h1>
          <p className="text-muted-foreground mt-2">
            Organiza y gestiona tus notas personales
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Nota
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar en tus notas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="secondary">
              Buscar
            </Button>
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSearchQuery('');
                  loadNotes();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <StickyNote className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-semibold mb-2">No hay notas todavía</h3>
            <p className="text-muted-foreground text-center mb-4">
              Crea tu primera nota para empezar a organizar tus ideas
            </p>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Nota
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Editar Nota' : 'Nueva Nota'}</DialogTitle>
            <DialogDescription>
              {editingNote ? 'Modifica el contenido de tu nota' : 'Crea una nueva nota para guardar tus ideas'}
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
                  placeholder="Título de la nota"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="folder">Carpeta</Label>
                <Input
                  id="folder"
                  value={formData.folder}
                  onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                  placeholder="General"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Contenido</Label>
                <Textarea
                  id="content"
                  rows={12}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Escribe el contenido de tu nota aquí..."
                  className="font-mono text-sm"
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
                {editingNote ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50 flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <FolderOpen className="h-3 w-3" />
              {note.folder}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-4 flex-1">
          {note.content}
        </p>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {note.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex justify-end gap-2 pt-4 border-t opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(note)}
            className="h-8 gap-1"
          >
            <Edit2 className="h-3 w-3" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(note.id)}
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
