'use client';

import { useEffect, useRef, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

type Leader = {
  name: string;
  score: number;
};

const MAX_FLOATING = 12;
const TAPS_PER_THEME = 10_000;
const THEME_NAMES = ['Synthwave', 'Outrun', 'Neon Arcade', 'Vaporwave'];

const BASE_CHAIN_ID = '0x2105'; // 8453
const BASE_CHAIN_PARAMS = {
  chainId: BASE_CHAIN_ID,
  chainName: 'Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org']
};

type WalletOption = { id: string; name: string; provider: unknown };

declare global {
  interface Window {
    ethereum?: {
      request(args: { method: string; params?: unknown[] }): Promise<unknown>;
      providers?: unknown[];
      isMetaMask?: boolean;
      isRabby?: boolean;
      isCoinbaseWallet?: boolean;
    };
  }
}

export default function HomePage() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [tapsPerSession, setTapsPerSession] = useState(0);
  const [nickname, setNickname] = useState('');
  const [savedNick, setSavedNick] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<Leader[]>([]);
  const [floating, setFloating] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const tapIdRef = useRef(0);
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const audioIndexRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletProvider, setWalletProvider] = useState<Window['ethereum'] | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletOption[]>([]);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [gmTxHash, setGmTxHash] = useState<string | null>(null);
  const [gmPending, setGmPending] = useState(false);
  const [gmError, setGmError] = useState<string | null>(null);
  const [musicOn, setMusicOn] = useState(true);

  const themeIndex = Math.floor(score / TAPS_PER_THEME) % THEME_NAMES.length;
  const themeName = THEME_NAMES[themeIndex];

  useEffect(() => {
    async function ready() {
      try {
        await sdk.actions.ready();
      } catch (e) {
        // локально вне Base – можно игнорировать
      }
    }
    ready();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedNick = window.localStorage.getItem('retro_tapper_nick');
    const storedBest = window.localStorage.getItem('retro_tapper_best');
    const storedMusic = window.localStorage.getItem('retro_tapper_music');
    if (storedNick) {
      setSavedNick(storedNick);
      setNickname(storedNick);
    }
    if (storedBest) {
      const n = Number(storedBest);
      if (!Number.isNaN(n)) setBestScore(n);
    }
    if (storedMusic !== null) setMusicOn(storedMusic === '1');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (savedNick) {
      window.localStorage.setItem('retro_tapper_nick', savedNick);
    }
  }, [savedNick]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('retro_tapper_best', String(bestScore));
  }, [bestScore]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('retro_tapper_music', musicOn ? '1' : '0');
  }, [musicOn]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const variants = ['/sounds/tap1.mp3', '/sounds/tap2.mp3', '/sounds/tap3.mp3'];
    audioRefs.current = variants.map((src) => {
      const a = new Audio(src);
      a.preload = 'auto';
      a.volume = 0.6;
      return a;
    });
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', String(themeIndex));
  }, [themeIndex]);

  useEffect(() => {
    async function loadLb() {
      try {
        const res = await fetch('/api/leaderboard', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as { leaderboard: Leader[] };
        setLeaderboard(data.leaderboard);
      } catch {
        // ignore
      }
    }
    loadLb();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    const eth = window.ethereum;
    const rawProviders = eth.providers ? [...eth.providers] : [eth];
    const options: WalletOption[] = [];
    for (const p of rawProviders) {
      const prov = p as Window['ethereum'];
      if (prov?.isRabby) options.push({ id: 'rabby', name: 'Rabby Wallet', provider: prov });
      else if (prov?.isCoinbaseWallet) options.push({ id: 'base', name: 'Base Wallet', provider: prov });
      else if (prov?.isMetaMask) options.push({ id: 'metamask', name: 'MetaMask', provider: prov });
    }
    if (options.length === 0 && eth) {
      options.push({ id: 'default', name: 'Browser Wallet', provider: eth });
    }
    setAvailableWallets(options);
  }, []);

  const connectWallet = async (option: WalletOption) => {
    const prov = option.provider as Window['ethereum'];
    if (!prov?.request) return;
    setGmError(null);
    try {
      const accounts = (await prov.request({ method: 'eth_requestAccounts' })) as string[];
      if (!accounts?.[0]) return;
      const chainId = (await prov.request({ method: 'eth_chainId' })) as string;
      if (chainId !== BASE_CHAIN_ID) {
        try {
          await prov.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_CHAIN_ID }]
          });
        } catch {
          await prov.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_CHAIN_PARAMS]
          });
        }
      }
      setWalletAddress(accounts[0]);
      setWalletProvider(prov);
      setShowWalletModal(false);
    } catch (e) {
      setGmError(e instanceof Error ? e.message : 'Connection failed');
    }
  };

  const switchToBase = async (): Promise<boolean> => {
    if (!walletProvider?.request) return false;
    const chainId = (await walletProvider.request({ method: 'eth_chainId' })) as string;
    if (chainId === BASE_CHAIN_ID) return true;
    try {
      await walletProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID }]
      });
      return true;
    } catch {
      try {
        await walletProvider.request({
          method: 'wallet_addEthereumChain',
          params: [BASE_CHAIN_PARAMS]
        });
        return true;
      } catch {
        return false;
      }
    }
  };

  const sendGM = async () => {
    if (!walletAddress || !walletProvider?.request) {
      setShowWalletModal(true);
      return;
    }
    setGmError(null);
    setGmTxHash(null);
    setGmPending(true);
    try {
      const onBase = await switchToBase();
      if (!onBase) {
        setGmError('Switch to Base network in your wallet');
        return;
      }
      const hash = (await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: walletAddress,
          to: walletAddress,
          value: '0x0',
          data: '0x',
          gas: '0x5208'
        }]
      })) as string;
      setGmTxHash(hash);
    } catch (e) {
      setGmError(e instanceof Error ? e.message : 'Transaction failed');
    } finally {
      setGmPending(false);
    }
  };

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : null;

  const playTapSound = () => {
    if (!musicOn) return;
    if (audioRefs.current.length) {
      const idx = audioIndexRef.current++ % audioRefs.current.length;
      const audio = audioRefs.current[idx];
      audio.currentTime = 0;
      audio.play().catch(() => playTapSoundFallback());
    } else {
      playTapSoundFallback();
    }
  };

  const playTapSoundFallback = () => {
    try {
      const ctx = audioCtxRef.current ?? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (!audioCtxRef.current) audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.05);
      osc.type = 'square';
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  };

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    setScore((s) => s + 1);
    setTapsPerSession((t) => t + 1);
    playTapSound();

    const rect =
      (e.target as HTMLElement).getBoundingClientRect?.() ??
      ({ left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 } as DOMRect);
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const id = tapIdRef.current++;
    const x = centerX + (Math.random() - 0.5) * 40;
    const y = centerY + (Math.random() - 0.5) * 40;

    setFloating((prev) => {
      const next = [...prev, { id, x, y }];
      if (next.length > MAX_FLOATING) {
        next.shift();
      }
      return next;
    });

    setTimeout(() => {
      setFloating((prev) => prev.filter((f) => f.id !== id));
    }, 650);
  };

  const handleSaveScore = async () => {
    const name = (nickname || savedNick || '').trim();
    if (!name || score <= 0) return;

    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        body: JSON.stringify({ name, score })
      });
      if (!res.ok) return;
      const data = (await res.json()) as { leaderboard: Leader[] };
      setLeaderboard(data.leaderboard);
      setSavedNick(name);
      if (score > bestScore) setBestScore(score);
      setScore(0);
      setTapsPerSession(0);
    } catch {
      // ignore
    }
  };

  const displayNick = savedNick ?? 'anon';

  return (
    <main style={{ position: 'relative', zIndex: 1, width: '100%' }}>
      <div className="game-card">
        <div className="game-header">
          <div>
            <div className="game-title">BASE TAP 1986</div>
            <div className="game-subtitle">Retro coin tap · {themeName}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 10 }}>
            <div style={{ color: '#5cffe0', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              On Base
            </div>
            <div style={{ color: '#b3a9ff' }}>Season 1</div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-pill">
            <span>Score</span>
            <strong>{score}</strong>
          </div>
          <div className="stat-pill">
            <span>Best</span>
            <strong>{bestScore}</strong>
          </div>
          <div className="stat-pill">
            <span>Taps</span>
            <strong>{tapsPerSession}</strong>
          </div>
        </div>

        <div className="music-toggle-row">
          <span className="music-toggle-label">Music</span>
          <button
            type="button"
            role="switch"
            aria-checked={musicOn}
            className={`music-tumbler ${musicOn ? 'on' : 'off'}`}
            onClick={() => setMusicOn((v) => !v)}
          >
            <span className="music-tumbler-track">
              <span className="music-tumbler-thumb" />
            </span>
            <span className="music-tumbler-text on">On</span>
            <span className="music-tumbler-text off">Off</span>
          </button>
        </div>

        <div className="game-panel">
          <button
            className="tap-button"
            onClick={handleTap}
            onTouchStart={handleTap}
            type="button"
          >
            <div className="tap-button-inner">
              <div className="tap-button-label">TAP</div>
            </div>
          </button>

          {floating.map((f) => (
            <div
              key={f.id}
              className="float-tap"
              style={{
                left: f.x,
                top: f.y
              }}
            >
              +1
            </div>
          ))}

          <div className="info-line">Tap the coin. Every tap has sound.</div>

          <div className="gm-section">
            <button
              type="button"
              className="gm-plaque"
              onClick={walletAddress ? sendGM : () => setShowWalletModal(true)}
              disabled={gmPending}
            >
              <span className="gm-plaque-label">GM</span>
              {walletAddress ? (
                <span className="gm-plaque-hint">
                  {gmPending ? 'Confirm in wallet…' : 'Send tx on Base'}
                </span>
              ) : (
                <span className="gm-plaque-hint">Connect wallet</span>
              )}
            </button>
            {walletAddress && (
              <div className="gm-wallet-row">
                <span className="gm-address">{shortAddress}</span>
                <button
                  type="button"
                  className="gm-disconnect"
                  onClick={() => {
                    setWalletAddress(null);
                    setWalletProvider(null);
                    setGmTxHash(null);
                    setGmError(null);
                  }}
                >
                  Disconnect
                </button>
              </div>
            )}
            {gmTxHash && (
              <a
                href={`https://basescan.org/tx/${gmTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="gm-tx-link"
              >
                View tx on Base
              </a>
            )}
            {gmError && <div className="gm-error">{gmError}</div>}
          </div>

          {showWalletModal && (
            <div className="wallet-modal-backdrop" onClick={() => setShowWalletModal(false)}>
              <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
                <div className="wallet-modal-header">
                  <span>Connect wallet</span>
                  <button type="button" className="wallet-modal-close" onClick={() => setShowWalletModal(false)}>×</button>
                </div>
                <p className="wallet-modal-desc">Choose wallet to use on Base</p>
                <ul className="wallet-list">
                  {availableWallets.map((opt) => (
                    <li key={opt.id}>
                      <button
                        type="button"
                        className="wallet-option"
                        onClick={() => connectWallet(opt)}
                      >
                        {opt.name}
                      </button>
                    </li>
                  ))}
                </ul>
                {availableWallets.length === 0 && (
                  <p className="wallet-modal-desc">Install Rabby, Base Wallet or MetaMask.</p>
                )}
              </div>
            </div>
          )}

          <div className="leaderboard">
            <div className="leaderboard-header">
              <span>Leaderboard</span>
              <span>All-time</span>
            </div>
            <ul className="leaderboard-list">
              {leaderboard.slice(0, 10).map((entry, index) => {
                const isMe = entry.name === displayNick;
                return (
                  <li
                    key={entry.name + index}
                    className={`leaderboard-item${isMe ? ' me' : ''}`}
                  >
                    <span className="leaderboard-rank">{index + 1}.</span>
                    <span className="leaderboard-name">{entry.name}</span>
                    <span className="leaderboard-score">{entry.score}</span>
                  </li>
                );
              })}
              {leaderboard.length === 0 && (
                <li className="leaderboard-item">
                  <span className="leaderboard-rank">–</span>
                  <span className="leaderboard-name">No scores yet</span>
                  <span className="leaderboard-score">0</span>
                </li>
              )}
            </ul>

            <div className="nick-row">
              <input
                className="nick-input"
                placeholder="Your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <button className="nick-button" type="button" onClick={handleSaveScore}>
                Save
              </button>
            </div>
            <div className="info-line">Score goes to leaderboard + local best.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
