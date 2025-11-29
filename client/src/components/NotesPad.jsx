import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = '/api';

function NotesPad() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewNote, setIsNewNote] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.content || '');
    setIsNewNote(false);
  };

  const handleNewNote = () => {
    setSelectedNoteId(null);
    setTitle('');
    setContent('');
    setIsNewNote(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isNewNote) {
        await axios.post(`${API_URL}/notes`, { title: title.trim(), content: content || '' });
      } else {
        await axios.put(`${API_URL}/notes/${selectedNoteId}`, { title: title.trim(), content: content || '' });
      }
      await fetchNotes();
      // Select the saved note
      const updatedNotes = await axios.get(`${API_URL}/notes`);
      if (isNewNote) {
        // Find the newly created note (should be first as it's sorted by updated_at DESC)
        const newNote = updatedNotes.data[0];
        if (newNote) {
          handleSelectNote(newNote);
        }
      }
      setIsNewNote(false);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNoteId) return;
    
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/notes/${selectedNoteId}`);
      setSelectedNoteId(null);
      setTitle('');
      setContent('');
      setIsNewNote(false);
      await fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md transition-colors">
      <div className="flex flex-col md:flex-row min-h-[500px] md:h-[calc(100vh-300px)]">
        {/* Notes List Sidebar */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={handleNewNote}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[44px]"
            >
              + New Note
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {notes.length === 0 ? (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                <p className="text-sm">No notes yet. Create your first note!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {notes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                      selectedNoteId === note.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-400'
                        : ''
                    }`}
                  >
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1 truncate">
                      {note.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(note.updated_at)}
                    </p>
                    {note.content && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                        {note.content}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Note Editor */}
        <div className="flex-1 flex flex-col">
          {selectedNoteId || isNewNote ? (
            <>
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                  {isNewNote ? 'New Note' : 'Edit Note'}
                </h2>
                {!isNewNote && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors touch-manipulation min-h-[44px]"
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
                <div>
                  <label htmlFor="note-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Title *
                  </label>
                  <input
                    id="note-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter note title..."
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <label htmlFor="note-content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Content
                  </label>
                  <textarea
                    id="note-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                    placeholder="Write your note here..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleSave}
                  disabled={isSubmitting || !title.trim()}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation min-h-[44px]"
                >
                  {isSubmitting ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-2">
                  Select a note to view or edit
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  or create a new note to get started
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotesPad;

