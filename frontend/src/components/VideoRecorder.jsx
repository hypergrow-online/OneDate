import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Video, Square, Play, Trash2, Upload } from 'lucide-react';

export default function VideoRecorder({ open, onClose, onSave }) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [title, setTitle] = useState('');
  const [folder, setFolder] = useState('General');
  const [uploading, setUploading] = useState(false);
  
  const videoRef = useRef(null);
  const previewRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const recordedBlobRef = useRef(null);

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [open]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('No se pudo acceder a la cámara y micrófono. Por favor, verifica los permisos.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      alert('Cámara no disponible');
      return;
    }

    chunksRef.current = [];
    
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      recordedBlobRef.current = blob;
      setHasRecording(true);
      
      // Show preview
      if (previewRef.current) {
        previewRef.current.src = URL.createObjectURL(blob);
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const discardRecording = () => {
    setHasRecording(false);
    setIsPreviewing(false);
    recordedBlobRef.current = null;
    chunksRef.current = [];
    
    if (previewRef.current) {
      previewRef.current.src = '';
    }
    
    startCamera();
  };

  const handleSave = async () => {
    if (!recordedBlobRef.current || !title.trim()) {
      alert('Por favor ingresa un título para la nota de video');
      return;
    }

    setUploading(true);
    try {
      await onSave(title, folder, recordedBlobRef.current);
      handleClose();
    } catch (err) {
      console.error('Error saving video:', err);
      alert('Error al guardar el video. Por favor intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    setIsRecording(false);
    setHasRecording(false);
    setIsPreviewing(false);
    setTitle('');
    setFolder('General');
    setUploading(false);
    recordedBlobRef.current = null;
    chunksRef.current = [];
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Grabar Video Nota</DialogTitle>
          <DialogDescription>
            Graba un video nota usando tu cámara y micrófono
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Video Display */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {!hasRecording ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={previewRef}
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-medium">Grabando...</span>
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center gap-3">
            {!hasRecording ? (
              <>
                {!isRecording ? (
                  <Button
                    type="button"
                    onClick={startRecording}
                    className="gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Iniciar Grabación
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={stopRecording}
                    variant="destructive"
                    className="gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Detener Grabación
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={discardRecording}
                  variant="outline"
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Descartar
                </Button>
                <Button
                  type="button"
                  onClick={() => previewRef.current?.play()}
                  variant="secondary"
                  className="gap-2"
                >
                  <Play className="h-4 w-4" />
                  Reproducir
                </Button>
              </>
            )}
          </div>

          {/* Title and Folder Inputs - shown when recording exists */}
          {hasRecording && (
            <div className="space-y-3 pt-4 border-t">
              <div className="grid gap-2">
                <Label htmlFor="video-title">Título *</Label>
                <Input
                  id="video-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título de la video nota"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="video-folder">Carpeta</Label>
                <Input
                  id="video-folder"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  placeholder="General"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={uploading}
          >
            Cancelar
          </Button>
          {hasRecording && (
            <Button
              type="button"
              onClick={handleSave}
              disabled={!title.trim() || uploading}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Guardando...' : 'Guardar Video Nota'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
