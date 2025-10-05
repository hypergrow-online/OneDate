import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Loader2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...userData } = formData;
      await authService.register(userData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">Crear cuenta</CardTitle>
          <CardDescription className="text-base">
            Regístrate para empezar a usar OneDate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="usuario123"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo (opcional)</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.full_name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Registrarse
                </>
              )}
            </Button>

            <div className="text-center pt-4">
              <Link 
                to="/login" 
                className="text-sm text-primary hover:underline"
              >
                ¿Ya tienes cuenta? <span className="font-semibold">Inicia sesión</span>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
