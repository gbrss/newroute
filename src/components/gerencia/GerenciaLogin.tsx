import React from 'react';
import { AlertCircle, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';
import logoImg from '../../assets/images/logo.png';

interface Props {
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  handleLogin: (e: React.FormEvent) => void;
  loginError: string;
}

export const GerenciaLogin: React.FC<Props> = ({
  username, setUsername, password, setPassword,
  showPassword, setShowPassword, handleLogin, loginError
}) => {
  return (
    <div className="min-h-[100dvh] w-screen overflow-hidden bg-stone-950 flex flex-col justify-center items-center p-4 selection:bg-amber-800 selection:text-white overflow-y-auto">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl relative my-auto">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex justify-center">
            <img src={logoImg.src} alt="New Route Chile" className="h-20 w-auto object-contain" />
          </div>
          <span className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase">Iniciar Sesión</span>
          <h1 className="text-2xl font-bold font-display text-white mt-1">Portal de Gerencia</h1>
        </div>
        {loginError && (
          <div className="mb-5 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" /><span>{loginError}</span>
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">Usuario</label>
            <input type="text" required autoFocus placeholder="gerencia" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">Contraseña</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-3.5 pr-10 py-2.5 text-xs text-white focus:border-amber-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase flex items-center justify-center gap-2 mt-2">
            <KeyRound className="w-4 h-4" /><span>Ingresar</span>
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white"><ArrowLeft className="w-3.5 h-3.5" /> Volver a la web</a>
        </div>
      </div>
    </div>
  );
};