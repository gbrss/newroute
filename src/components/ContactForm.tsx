import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '../data/newrouteData';
import { createContactMessage } from '../lib/storage';

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Por favor completa todos los campos requeridos (*).');
      return;
    }

    createContactMessage({
      name,
      email,
      phone,
      subject: subject || 'Consulta general desde sitio web',
      message,
    });

    setSubmitted(true);
  };

  return (
    <section id="contacto" className="py-20 lg:py-28 bg-stone-100/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Authentic Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-700">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>Contacto Directo 24/7</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-display text-stone-900 tracking-tight">
              Estamos a tu Servicio en Todo Momento
            </h2>

            <p className="text-stone-600 text-sm leading-relaxed font-light">
              Ponte en contacto con nuestro equipo de operaciones para coordinar traslados ejecutivos, cotizar flotas para congresos o resolver cualquier duda sobre itinerarios turísticos.
            </p>

            {/* Contact Details Cards */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Oficina Central
                  </div>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    {COMPANY_INFO.address}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Santiago Centro, Región Metropolitana
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Teléfonos de Operaciones
                  </div>
                  <div className="text-sm font-bold text-stone-900 mt-0.5 flex flex-col gap-0.5">
                    <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="hover:text-amber-700 transition-colors">
                      Fijo: {COMPANY_INFO.phone}
                    </a>
                    <a href={`https://wa.me/${COMPANY_INFO.whatsappRaw}`} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">
                      WhatsApp: {COMPANY_INFO.whatsapp}
                    </a>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Línea continua 24 horas del día
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Correo Electrónico
                  </div>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-amber-700 transition-colors">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Respuesta en menos de 2 horas hábiles
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-stone-200 shadow-sm">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Horario de Atención
                  </div>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    Continuo 24 Horas / 365 Días
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Monitoreo constante de llegadas aéreas
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-md">
              <div className="mb-6">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block mb-1">
                  Formulario de Contacto & Consultas
                </span>
                <h3 className="text-2xl font-bold font-display text-stone-900">
                  Envíanos un Mensaje
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Escríbenos para consultas de tarifas a medida o traslados especiales.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-3 text-emerald-900">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    <h4 className="font-bold text-sm">¡Mensaje enviado con éxito!</h4>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Gracias por comunicarte con New Route Chile. Tu mensaje ha sido recibido por nuestra central de operaciones. Te responderemos a la brevedad al correo <strong>{email}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="mt-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-medium">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Nombre y Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Tu nombre completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="tu.correo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Asunto
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Cotización Van Grupal / Tour Personalizado"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Mensaje o Requerimiento *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Indícanos fechas estimadas, número de pasajeros, destinos deseados..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>Tus datos son tratados bajo estricta confidencialidad</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 rounded-lg bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar Mensaje</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
