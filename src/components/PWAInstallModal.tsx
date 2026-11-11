import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  X,
  Share2,
  MoreVertical,
  Layers,
  Sparkles,
  Play,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../lib/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { canInstall, isInstalled, isIOS, triggerInstall } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'install' | 'playstore'>('install');
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (canInstall) {
      const outcome = await triggerInstall();
      if (outcome === 'accepted') {
        setInstallSuccess(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0a192f] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-amber-500/20 bg-[#050c18]/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-navy-950 shadow-md">
              <Smartphone className="w-6 h-6 text-[#050c18]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-amber-300">
                PregAI no seu Celular
              </h3>
              <p className="text-xs text-slate-400">
                Aplicativo Android, iOS & Google Play
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-[#071326] px-4 pt-2">
          <button
            onClick={() => setActiveTab('install')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'install'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Instalar no Celular</span>
          </button>
          <button
            onClick={() => setActiveTab('playstore')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'playstore'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Publicar na Play Store (APK)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm flex-1">
          {activeTab === 'install' ? (
            <>
              {isInstalled || installSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-200">Aplicativo já instalado!</p>
                    <p className="text-xs text-emerald-300/80">
                      Você pode abrir o PregAI direto da tela inicial do seu celular como um app nativo.
                    </p>
                  </div>
                </div>
              ) : canInstall ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent border border-amber-500/40">
                  <div className="flex items-start space-x-3 mb-3">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-200">
                        Instalação Rápida com 1 Clique
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Instale agora no seu celular Android. O app ganhará ícone na sua tela inicial e funcionará sem as barras do navegador.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#050c18] font-bold rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all transform active:scale-98"
                  >
                    <Download className="w-4 h-4" />
                    <span>Instalar Aplicativo PregAI Agora</span>
                  </button>
                </div>
              ) : null}

              {/* Step-by-step for Android */}
              <div className="bg-[#050c18]/60 p-4 rounded-xl border border-white/5 space-y-3">
                <h4 className="font-semibold text-amber-300 flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>Como instalar no Android (Chrome ou Samsung Internet):</span>
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="leading-relaxed">
                    Abra o app no <strong>Google Chrome</strong> do seu celular.
                  </li>
                  <li className="leading-relaxed">
                    Toque nos <strong>3 pontinhos (⋮)</strong> no canto superior direito.
                  </li>
                  <li className="leading-relaxed">
                    Toque em <strong className="text-amber-300">"Instalar aplicativo"</strong> ou <strong className="text-amber-300">"Adicionar à tela inicial"</strong>.
                  </li>
                  <li className="leading-relaxed">
                    Pronto! O PregAI aparecerá na sua lista de apps com ícone e tela cheia.
                  </li>
                </ol>
              </div>

              {/* iOS Instructions */}
              {isIOS && (
                <div className="bg-[#050c18]/60 p-4 rounded-xl border border-white/5 space-y-3">
                  <h4 className="font-semibold text-amber-300 flex items-center space-x-2">
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>Como instalar no iPhone / iPad (Safari):</span>
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                    <li>Toque no botão de <strong>Compartilhar</strong> (ícone do quadrado com a seta para cima no Safari).</li>
                    <li>Role para baixo e toque em <strong className="text-amber-300">"Adicionar à Tela de Início"</strong>.</li>
                    <li>Confirme tocando em <strong>"Adicionar"</strong>.</li>
                  </ol>
                </div>
              )}

              {/* Vantagens */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Tela Cheia:</strong> Sem a barra do navegador.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Leve e Rápido:</strong> Não consome gigas de memória.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Modo Púlpito:</strong> Ideal para pregar segurando o celular.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Sempre Atualizado:</strong> Novos sermões aparecem na hora.</span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                <p className="font-semibold text-amber-300 mb-1">
                  Sim! É totalmente possível gerar um APK / AAB para a Google Play Store.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Como este aplicativo já é uma <strong>PWA (Progressive Web App) completa</strong> com manifesto, ícones e service worker configurados, você pode transformá-lo em um app nativo para Android sem reescrever nenhuma linha de código.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-[#050c18] border border-white/10 rounded-lg">
                  <h5 className="font-bold text-white flex items-center space-x-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-[#050c18] font-mono text-xs flex items-center justify-center font-bold">1</span>
                    <span>Opção Recomendada: TWA via PWABuilder (Oficial Microsoft & Google)</span>
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2">
                    Gera o pacote <code className="text-amber-300 bg-white/5 px-1 py-0.5 rounded">.aab</code> assinado pronto para enviar ao Google Play Console.
                  </p>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    <li>Acesse <strong>pwabuilder.com</strong></li>
                    <li>Insira a URL do seu app PregAI</li>
                    <li>Clique em <strong>"Package for Android"</strong></li>
                    <li>Faça o download do arquivo <code>.apk</code> ou <code>.aab</code></li>
                  </ul>
                </div>

                <div className="p-3 bg-[#050c18] border border-white/10 rounded-lg">
                  <h5 className="font-bold text-white flex items-center space-x-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-[#050c18] font-mono text-xs flex items-center justify-center font-bold">2</span>
                    <span>Google Bubblewrap (Linha de Comando)</span>
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ferramenta oficial do Google para desenvolvedores: executa <code className="text-amber-300 bg-white/5 px-1 py-0.5 rounded">bubblewrap init --manifest=...</code> e compila direto com Android SDK.
                  </p>
                </div>

                <div className="p-3 bg-[#050c18] border border-white/10 rounded-lg">
                  <h5 className="font-bold text-white flex items-center space-x-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-[#050c18] font-mono text-xs flex items-center justify-center font-bold">3</span>
                    <span>Capacitor / Ionic (Híbrido Nativo Completo)</span>
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Cria uma pasta <code className="text-amber-300 bg-white/5 px-1 py-0.5 rounded">android/</code> com projeto Gradle no Android Studio, permitindo plugins nativos de Bluetooth, biometria e notificações push locais.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#050c18]/80 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            PregAI • PWA Standalone Ready
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-200 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
