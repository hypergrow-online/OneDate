import { useState, useEffect } from 'react';
import { taskService } from '../services/tasks';
import { noteService } from '../services/notes';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalNotes: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, notesData] = await Promise.all([
        taskService.getTasks(),
        noteService.getNotes(),
      ]);
      
      setTasks(tasksData);
      setNotes(notesData);
      
      const completedCount = tasksData.filter(t => t.status === 'done').length;
      setStats({
        totalTasks: tasksData.length,
        completedTasks: completedCount,
        pendingTasks: tasksData.length - completedCount,
        totalNotes: notesData.length,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-3xl">📋</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Tareas
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats.totalTasks}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-3xl">✅</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completadas
                  </dt>
                  <dd className="text-3xl font-semibold text-green-600">
                    {stats.completedTasks}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-3xl">⏳</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pendientes
                  </dt>
                  <dd className="text-3xl font-semibold text-orange-600">
                    {stats.pendingTasks}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-3xl">📝</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Notas
                  </dt>
                  <dd className="text-3xl font-semibold text-blue-600">
                    {stats.totalNotes}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Tareas Recientes
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {tasks.length === 0 ? (
            <p className="text-gray-500">No hay tareas todavía</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.slice(0, 5).map((task) => (
                <li key={task.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {task.status === 'done' ? '✅ Completada' : '⏳ Pendiente'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Notes */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Notas Recientes
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {notes.length === 0 ? (
            <p className="text-gray-500">No hay notas todavía</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notes.slice(0, 5).map((note) => (
                <li key={note.id} className="py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {note.title}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {note.content.substring(0, 100)}...
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
