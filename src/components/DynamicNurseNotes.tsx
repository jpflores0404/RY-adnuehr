"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Pencil } from "lucide-react";
import { addNurseNote, deleteNurseNote } from "@/app/actions/subrecords";

export default function DynamicNurseNotes({ patientId, initialNotes, isNewborn = false }: { patientId: string, initialNotes: any[], isNewborn?: boolean }) {
  const [notes, setNotes] = useState(initialNotes);
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd(formData: FormData) {
    const newNote = await addNurseNote(patientId, isNewborn, formData);
    setNotes([newNote, ...notes]);
    setIsAdding(false);
  }

  async function handleDelete(noteId: string) {
    if (!confirm("Delete this note?")) return;
    await deleteNurseNote(noteId);
    setNotes(notes.filter(n => n.id !== noteId));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Nurse&apos;s Notes (FDAR)</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 border border-blue-200"
        >
          <Plus size={16} /> Add Note
        </button>
      </div>

      <div className="space-y-4">
        {isAdding && (
          <form action={handleAdd} className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 shadow-sm space-y-4">
             <div className="flex gap-4">
                <input required name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="p-2 rounded border border-slate-300 text-slate-900 bg-white text-sm" />
                <input required name="time" type="time" className="p-2 rounded border border-slate-300 text-slate-900 bg-white text-sm" />
                <select required name="shift" className="p-2 rounded border border-slate-300 text-slate-900 text-sm bg-white">
                    <option value="AM">AM Shift</option>
                    <option value="PM">PM Shift</option>
                    <option value="NOC">Night Shift</option>
                </select>
             </div>
             
             <div className="space-y-3">
                 <div>
                     <label className="text-xs font-bold text-blue-900 uppercase">Focus</label>
                     <input required name="focus" type="text" placeholder="Main issue or concern" className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white text-sm mt-1" />
                 </div>
                 <div>
                     <label className="text-xs font-bold text-blue-900 uppercase">Data</label>
                     <textarea required name="data" rows={2} placeholder="Subjective/Objective data" className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white text-sm mt-1"></textarea>
                 </div>
                 <div>
                     <label className="text-xs font-bold text-blue-900 uppercase">Action</label>
                     <textarea required name="action" rows={2} placeholder="Interventions performed" className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white text-sm mt-1"></textarea>
                 </div>
                 <div>
                     <label className="text-xs font-bold text-blue-900 uppercase">Response</label>
                     <textarea required name="response" rows={2} placeholder="Patient's response" className="w-full p-2 rounded border border-slate-300 text-slate-900 bg-white text-sm mt-1"></textarea>
                 </div>
             </div>

             <div className="flex justify-end gap-3 pt-2">
                 <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium">Cancel</button>
                 <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex gap-2 items-center text-sm font-medium"><Save size={16}/> Save Note</button>
             </div>
          </form>
        )}

        {notes.length === 0 && !isAdding ? (
           <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
             No nursing notes have been added yet.
           </div>
        ) : (
           notes.map(note => (
             <div key={note.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded text-sm">{note.date}</span>
                        <span className="text-slate-600 text-sm">{note.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">{note.shift}</span>
                      <button type="button" className="text-blue-400 hover:text-blue-600 transition-colors" title="Edit"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(note.id)} className="text-rose-400 hover:text-rose-600 transition-colors" title="Delete"><Trash2 size={14} /></button>
                    </div>
                </div>
                <div className="space-y-3 mt-4 text-sm">
                    <div className="flex gap-4">
                        <div className="w-8 font-bold text-blue-800">F</div>
                        <div className="flex-1 text-slate-900 font-medium">{note.focus}</div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 font-bold text-slate-500">D</div>
                        <div className="flex-1 text-slate-700">{note.data}</div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 font-bold text-slate-500">A</div>
                        <div className="flex-1 text-slate-700">{note.action}</div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 font-bold text-slate-500">R</div>
                        <div className="flex-1 text-slate-700">{note.response}</div>
                    </div>
                </div>
             </div>
           ))
        )}
      </div>
    </div>
  );
}
