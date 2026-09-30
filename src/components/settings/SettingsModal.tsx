import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Mic,
  Tv,
  Wifi,
  Keyboard,
  Check,
  AlertCircle,
  Radio,
} from 'lucide-react';
import { mediaService } from '../../services/mediaService';
import { AudioLevelMonitor } from '../../services/audioAnalyser';
import { ScreenShareProfile } from '../../types';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    closeSettings,
    audioSettings,
    updateAudioSettings,
    streamSettings,
    updateStreamSettings,
    networkStats,
    connectionStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'audio' | 'stream' | 'network' | 'shortcuts'>('audio');
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [isRecordingKey, setIsRecordingKey] = useState(false);

  // Real mic test state
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [testMicLevel, setTestMicLevel] = useState(0);
  const micTesterRef = useRef<AudioLevelMonitor>(new AudioLevelMonitor());
  const testStreamRef = useRef<MediaStream | null>(null);

  // Load available devices
  useEffect(() => {
    if (isSettingsOpen) {
      mediaService.enumerateDevices().then(({ inputs, outputs }) => {
        setInputDevices(inputs);
        setOutputDevices(outputs);
      });
    } else {
      // Clean up mic test on modal close
      stopMicTest();
    }
  }, [isSettingsOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isSettingsOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isRecordingKey) {
        closeSettings();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, isRecordingKey, closeSettings]);

  // Push to talk key listener
  useEffect(() => {
    if (!isRecordingKey) return;

    const handleKeyCapture = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const key = e.key.toLowerCase();
      updateAudioSettings({ pushToTalkKey: key });
      setIsRecordingKey(false);
    };

    window.addEventListener('keydown', handleKeyCapture, { once: true });
    return () => window.removeEventListener('keydown', handleKeyCapture);
  }, [isRecordingKey, updateAudioSettings]);

  const startMicTest = async () => {
    try {
      setIsTestingMic(true);
      const stream = await mediaService.getMicrophoneStream(audioSettings);
      testStreamRef.current = stream;

      micTesterRef.current.start(
        stream,
        (level) => {
          setTestMicLevel(level);
        },
        undefined,
        10
      );
    } catch (err) {
      console.error('[Settings] Mic test failed:', err);
      setIsTestingMic(false);
    }
  };

  const stopMicTest = () => {
    micTesterRef.current.stop();
    if (testStreamRef.current) {
      testStreamRef.current.getTracks().forEach((t) => t.stop());
      testStreamRef.current = null;
    }
    setIsTestingMic(false);
    setTestMicLevel(0);
  };

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0e1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] h-[540px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-52 bg-[#0a0c10] p-3 border-r border-white/5 flex flex-row md:flex-col gap-1 shrink-0 overflow-x-auto">
          <div className="hidden md:block px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Configurações
          </div>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mic className="w-4 h-4 text-[#00e5ff]" />
            <span>Áudio & Voz</span>
          </button>

          <button
            onClick={() => setActiveTab('stream')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeTab === 'stream'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Tv className="w-4 h-4 text-[#38bdf8]" />
            <span>Vídeo & Stream</span>
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeTab === 'network'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>Conexão & RTC</span>
          </button>

          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeTab === 'shortcuts'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Keyboard className="w-4 h-4 text-purple-400" />
            <span>Atalhos</span>
          </button>
        </div>

        {/* Content Panel */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0e1117]">
          {/* Header */}
          <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between shrink-0">
            <h3 className="text-sm font-bold text-white capitalize">
              {activeTab === 'audio' && 'Configurações de Áudio'}
              {activeTab === 'stream' && 'Qualidade de Compartilhamento de Tela'}
              {activeTab === 'network' && 'Status da Rede WebRTC'}
              {activeTab === 'shortcuts' && 'Atalhos de Teclado'}
            </h3>
            <button
              onClick={closeSettings}
              aria-label="Fechar configurações"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* AUDIO TAB */}
            {activeTab === 'audio' && (
              <div className="space-y-6">
                {/* Input device */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Dispositivo de Entrada (Microfone)
                  </label>
                  <select
                    value={audioSettings.audioInputDeviceId}
                    onChange={(e) => updateAudioSettings({ audioInputDeviceId: e.target.value })}
                    className="w-full bg-[#151921] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#00e5ff]"
                  >
                    <option value="default">Padrão do Sistema</option>
                    {inputDevices.map((d) => (
                      <option key={d.deviceId} value={d.deviceId}>
                        {d.label || `Microfone ${d.deviceId.slice(0, 6)}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Output device if available */}
                {outputDevices.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Dispositivo de Saída (Alto-falante / Fone)
                    </label>
                    <select
                      value={audioSettings.audioOutputDeviceId}
                      onChange={(e) => updateAudioSettings({ audioOutputDeviceId: e.target.value })}
                      className="w-full bg-[#151921] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#00e5ff]"
                    >
                      <option value="default">Padrão do Sistema</option>
                      {outputDevices.map((d) => (
                        <option key={d.deviceId} value={d.deviceId}>
                          {d.label || `Saída ${d.deviceId.slice(0, 6)}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Real Microphone Level Meter Test */}
                <div className="bg-[#12161f] border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Teste de Microfone</div>
                      <div className="text-[11px] text-slate-400">
                        Fale no microfone para verificar a captação real.
                      </div>
                    </div>
                    <button
                      onClick={isTestingMic ? stopMicTest : startMicTest}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isTestingMic
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-[#00e5ff] text-slate-950 hover:bg-[#38bdf8]'
                      }`}
                    >
                      {isTestingMic ? 'Parar Teste' : 'Iniciar Teste'}
                    </button>
                  </div>

                  {/* Volume Level Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-3 bg-[#0a0c10] rounded-full overflow-hidden border border-white/5 relative">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-[#00e5ff] to-cyan-400 transition-all duration-75 rounded-full"
                        style={{ width: `${testMicLevel}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Silêncio</span>
                      <span>{testMicLevel}%</span>
                      <span>Máximo</span>
                    </div>
                  </div>
                </div>

                {/* Input Mode: Activity vs Push to Talk */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Modo de Entrada de Voz
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateAudioSettings({ inputMode: 'activity' })}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        audioSettings.inputMode === 'activity'
                          ? 'bg-[#00e5ff]/10 border-[#00e5ff] text-white'
                          : 'bg-[#12161f] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold mb-1">Detecção de Voz</div>
                      <div className="text-[11px] text-slate-400">
                        Transmite áudio automaticamente ao falar.
                      </div>
                    </button>

                    <button
                      onClick={() => updateAudioSettings({ inputMode: 'push-to-talk' })}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        audioSettings.inputMode === 'push-to-talk'
                          ? 'bg-[#00e5ff]/10 border-[#00e5ff] text-white'
                          : 'bg-[#12161f] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold mb-1">Push to Talk</div>
                      <div className="text-[11px] text-slate-400">
                        Segure uma tecla designada para falar.
                      </div>
                    </button>
                  </div>

                  {/* Push-to-talk key setup */}
                  {audioSettings.inputMode === 'push-to-talk' && (
                    <div className="mt-3 flex items-center justify-between p-3 bg-[#12161f] rounded-xl border border-white/5">
                      <span className="text-xs text-slate-300 font-medium">Tecla Push-to-Talk:</span>
                      <button
                        onClick={() => setIsRecordingKey(true)}
                        className="px-3 py-1 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-xs font-mono font-bold text-[#00e5ff] uppercase cursor-pointer"
                      >
                        {isRecordingKey ? 'Pressione a tecla...' : audioSettings.pushToTalkKey.toUpperCase()}
                      </button>
                    </div>
                  )}
                </div>

                {/* Noise suppression and Echo cancellation toggles */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Cancelamento de Eco</div>
                      <div className="text-[11px] text-slate-400">Evita retorno de áudio em chamadas</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={audioSettings.echoCancellation}
                      onChange={(e) => updateAudioSettings({ echoCancellation: e.target.checked })}
                      className="w-4 h-4 accent-[#00e5ff] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Supressão de Ruído</div>
                      <div className="text-[11px] text-slate-400">Filtra ruídos de fundo como teclado e vento</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={audioSettings.noiseSuppression}
                      onChange={(e) => updateAudioSettings({ noiseSuppression: e.target.checked })}
                      className="w-4 h-4 accent-[#00e5ff] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STREAM TAB */}
            {activeTab === 'stream' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Resolução & Taxa de Quadros Alvo
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: '1080p60', label: '1080p 60 FPS', desc: 'Máxima fluidez e nitidez' },
                      { id: '1080p30', label: '1080p 30 FPS', desc: 'Alta definição equilibrada' },
                      { id: '720p60', label: '720p 60 FPS', desc: 'Leve e fluido' },
                      { id: '720p30', label: '720p 30 FPS', desc: 'Economia de banda' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => updateStreamSettings({ profile: p.id as ScreenShareProfile })}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          streamSettings.profile === p.id
                            ? 'bg-[#00e5ff]/10 border-[#00e5ff] text-white'
                            : 'bg-[#12161f] border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold flex items-center justify-between">
                          <span>{p.label}</span>
                          {streamSettings.profile === p.id && <Check className="w-3.5 h-3.5 text-[#00e5ff]" />}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">{p.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* Mandatory disclaimer as required by prompt requirement 26 */}
                  <div className="mt-3 flex items-start gap-2 p-3 bg-white/5 border border-white/5 rounded-xl text-[11px] text-slate-400">
                    <AlertCircle className="w-4 h-4 text-[#00e5ff] shrink-0 mt-0.5" />
                    <span>
                      Qualidade máxima solicitada. A resolução real pode variar conforme dispositivo, navegador e conexão.
                    </span>
                  </div>
                </div>

                {/* Audio capture */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Capturar Áudio da Aba / Sistema</div>
                      <div className="text-[11px] text-slate-400">
                        Quando suportado pelo navegador e sistema operacional
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={streamSettings.captureAudio}
                      onChange={(e) => updateStreamSettings({ captureAudio: e.target.checked })}
                      className="w-4 h-4 accent-[#00e5ff] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* NETWORK TAB */}
            {activeTab === 'network' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#12161f] border border-white/5 rounded-xl">
                    <div className="text-[11px] text-slate-400">Status do WebSocket</div>
                    <div className="text-sm font-bold text-white capitalize mt-0.5 flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          connectionStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      <span>{connectionStatus}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#12161f] border border-white/5 rounded-xl">
                    <div className="text-[11px] text-slate-400">Qualidade da Conexão RTC</div>
                    <div className="text-sm font-bold text-[#00e5ff] mt-0.5">
                      {networkStats?.quality || 'Disponível em chamada'}
                    </div>
                  </div>

                  <div className="p-3 bg-[#12161f] border border-white/5 rounded-xl">
                    <div className="text-[11px] text-slate-400">Latência / RTT Médio</div>
                    <div className="text-sm font-mono font-bold text-white mt-0.5">
                      {networkStats ? `${networkStats.rttMs} ms` : '—'}
                    </div>
                  </div>

                  <div className="p-3 bg-[#12161f] border border-white/5 rounded-xl">
                    <div className="text-[11px] text-slate-400">Pacotes Perdidos</div>
                    <div className="text-sm font-mono font-bold text-white mt-0.5">
                      {networkStats ? `${networkStats.packetsLost}` : '—'}
                    </div>
                  </div>

                  <div className="p-3 bg-[#12161f] border border-white/5 rounded-xl">
                    <div className="text-[11px] text-slate-400">Jitter</div>
                    <div className="text-sm font-mono font-bold text-white mt-0.5">
                      {networkStats ? `${networkStats.jitterMs} ms` : '—'}
                    </div>
                  </div>

                  <div className="p-3 bg-[#12161f] border border-white/5 rounded-xl">
                    <div className="text-[11px] text-slate-400">Codec de Voz Ativo</div>
                    <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                      Opus (48 kHz)
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-400">
                  <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#00e5ff]" />
                    <span>STUN / TURN Servers</span>
                  </div>
                  <p className="text-[11px]">
                    Sinalização WebRTC integrada com Google Public STUN. Suporte a TURN seguro configurado via backend.
                  </p>
                </div>
              </div>
            )}

            {/* SHORTCUTS TAB */}
            {activeTab === 'shortcuts' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-400 mb-2">
                  Atalhos globais rápidos (desativados automaticamente ao digitar em caixas de texto):
                </div>

                {[
                  { key: 'M', action: 'Mutar / Desmutar microfone' },
                  { key: 'D', action: 'Ensurdecer / Reativar áudio' },
                  {
                    key: audioSettings.pushToTalkKey.toUpperCase(),
                    action: 'Push-to-Talk (quando ativado)',
                  },
                  { key: 'ESC', action: 'Fechar modal / Sair da tela cheia' },
                ].map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between p-3 bg-[#12161f] border border-white/5 rounded-xl"
                  >
                    <span className="text-xs text-slate-300 font-medium">{s.action}</span>
                    <span className="px-2.5 py-1 bg-white/10 rounded-lg text-xs font-mono font-bold text-[#00e5ff]">
                      {s.key}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
