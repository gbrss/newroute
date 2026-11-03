import React from 'react';
import { Trash2, MessageCircle } from 'lucide-react';
import { ContactMessage } from '../../types';

interface Props {
  contacts: ContactMessage[];
  handleToggleContactRead: (id: string, currentRead: boolean) => void;
  handleDeleteContact: (id: string) => void;
}

export const TabContacts: React.FC<Props> = ({ contacts, handleToggleContactRead, handleDeleteContact }) => {
  return (
    <div className="space-y-4">
      <div className="text-xs text-stone-500 dark:text-stone-400 mb-2">Mensajes recibidos a través del formulario público.</div>
      {contacts.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-xs">No hay mensajes en la bandeja de entrada.</div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className={`p-5 rounded-2xl border text-xs transition-colors bg-white dark:bg-stone-900 ${c.read ? 'border-stone-200 dark:border-stone-800' : 'border-amber-400 dark:border-amber-600 bg-amber-50/30 dark:bg-amber-900/10'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <strong className="text-stone-900 dark:text-white text-sm font-display">{c.name}</strong>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-500 dark:text-stone-400">{new Date(c.createdAt).toLocaleString('es-CL')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggleContactRead(c.id, c.read)} className="text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white text-[11px] underline cursor-pointer">{c.read ? 'Marcar no leído' : 'Marcar leído'}</button>
                  <button onClick={() => handleDeleteContact(c.id)} className="text-rose-500 dark:text-rose-400 hover:text-rose-700 p-1 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="text-stone-800 dark:text-stone-200 font-bold mb-1.5">Asunto: {c.subject}</div>
              <div className="p-3.5 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 leading-relaxed">{c.message}</div>
              <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-400">
                <span>📧 {c.email}</span>
                {c.phone && <span>📞 {c.phone}</span>}
                {c.phone && (<a href={`https://wa.me/${c.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /><span>Responder WhatsApp</span></a>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};