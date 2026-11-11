import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Bookmark, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../lib/authContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccessNavigate?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccessNavigate,
}) => {
  const { signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      onClose();
      if (onSuccessNavigate) {
        onSuccessNavigate();
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      setError(
        err?.message?.includes('popup-closed-by-user')
          ? 'O login foi cancelado antes da conclusão.'
          : 'Não foi possível completar o login. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-md bg-[#0a192f] border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-white relative shadow-2xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 mx-auto shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#0a192f] rounded-[14px] flex items-center justify-center">
              {mode === 'login' ? (
                <LogIn className="w-7 h-7 text-amber-400" />
              ) : (
                <UserPlus className="w-7 h-7 text-amber-400" />
              )}
            </div>
          </div>

          <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Entrar na minha conta' : 'Criar minha conta'}
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {mode === 'login'
              ? 'Acesse seus sermões prediletos e recursos de estudo.'
              : 'Cadastre-se para salvar estudos, esboços e ilustrações.'}
          </p>
        </div>

        {/* Benefits List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Salve seus sermões e esboços favoritos com 1 clique</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Acesse seus estudos salvos no celular, tablet ou púlpito</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Acesso 100% gratuito e seguro pelo Firebase</span>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Authentication Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>
              {loading
                ? 'Conectando ao Firebase...'
                : mode === 'login'
                ? 'Continuar com Google'
                : 'Cadastrar com Google'}
            </span>
          </button>
        </div>

        {/* Switch between Login and Register */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>
              Ainda não tem conta?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-amber-400 hover:text-amber-300 font-bold underline"
              >
                Criar minha conta
              </button>
            </p>
          ) : (
            <p>
              Já possui conta?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-amber-400 hover:text-amber-300 font-bold underline"
              >
                Fazer login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
