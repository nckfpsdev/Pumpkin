/**
 * pumpkin - GitHub API Service
 * Fetches repository stars, forks, open issues, and contributor count via the GitHub API.
 * Uses sessionStorage caching to respect GitHub's unauthenticated rate limits.
 */

import { useState, useEffect, useCallback } from 'react';
import { project } from '../config/project';

export interface GitHubMetrics {
  owner: string;
  repo: string;
  stars: number;
  forks: number;
  openIssues: number;
  contributorsCount: number;
  lastPushedAt?: string;
  defaultBranch: string;
  license?: string;
  avatarUrl?: string;
  profileUrl: string;
  isLive: boolean;
  statusMessage?: string;
}

const CACHE_KEY_PREFIX = 'pumpkin_gh_metrics_';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export function parseGitHubRepo(url?: string): { owner: string; repo: string } {
  const defaultOwner = project.githubOwner || 'nckfpsdev';
  const defaultRepo = project.repositoryName || 'pumpkin';

  if (!url) {
    return { owner: defaultOwner, repo: defaultRepo };
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('github.com')) {
      const parts = parsed.pathname.replace(/^\/+|\/+$/g, '').split('/');
      if (parts.length >= 2) {
        return { owner: parts[0], repo: parts[1] };
      }
      if (parts.length === 1 && parts[0]) {
        return { owner: parts[0], repo: defaultRepo };
      }
    }
  } catch {
    const parts = url.replace(/^\/+|\/+$/g, '').split('/');
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
    if (parts.length === 1 && parts[0]) {
      return { owner: parts[0], repo: defaultRepo };
    }
  }

  return { owner: defaultOwner, repo: defaultRepo };
}

export async function fetchGitHubMetrics(repoUrl?: string): Promise<GitHubMetrics> {
  const targetUrl = repoUrl || project.repositoryUrl || project.githubProfileUrl;
  const { owner, repo } = parseGitHubRepo(targetUrl);
  const cacheKey = `${CACHE_KEY_PREFIX}${owner}_${repo}`;

  // Check sessionStorage cache
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const item = JSON.parse(cached) as { timestamp: number; data: GitHubMetrics };
        if (Date.now() - item.timestamp < CACHE_TTL_MS) {
          return item.data;
        }
      }
    } catch {}
  }

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  try {
    // 1. Try fetching repository details from GitHub API
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
    });

    if (repoRes.ok) {
      const repoData = await repoRes.json();

      // Fetch contributors count
      let contributorsCount = 1;
      try {
        const contributorsRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100&anon=true`,
          { headers }
        );
        if (contributorsRes.ok) {
          const contributorsData = await contributorsRes.json();
          if (Array.isArray(contributorsData)) {
            contributorsCount = Math.max(1, contributorsData.length);
          }
        }
      } catch {
        // Keep default contributors
      }

      const metrics: GitHubMetrics = {
        owner,
        repo,
        stars: Number(repoData.stargazers_count ?? 0),
        forks: Number(repoData.forks_count ?? 0),
        openIssues: Number(repoData.open_issues_count ?? 0),
        contributorsCount,
        lastPushedAt: repoData.pushed_at || repoData.updated_at,
        defaultBranch: repoData.default_branch || 'main',
        license: repoData.license?.spdx_id || repoData.license?.name || 'MIT',
        avatarUrl: repoData.owner?.avatar_url,
        profileUrl: `https://github.com/${owner}`,
        isLive: true,
        statusMessage: 'Conectado à API do GitHub',
      };

      // Cache result
      if (typeof window !== 'undefined' && window.sessionStorage) {
        try {
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({ timestamp: Date.now(), data: metrics })
          );
        } catch {}
      }

      return metrics;
    }

    // 2. Fallback: If repo is 404 (e.g. pending initial push), fetch the user profile
    const userRes = await fetch(`https://api.github.com/users/${owner}`, {
      headers,
    });

    if (userRes.ok) {
      const userData = await userRes.json();
      const metrics: GitHubMetrics = {
        owner,
        repo,
        stars: 0,
        forks: 0,
        openIssues: 0,
        contributorsCount: 1,
        defaultBranch: 'main',
        license: 'MIT',
        avatarUrl: userData.avatar_url,
        profileUrl: `https://github.com/${owner}`,
        isLive: true,
        statusMessage: `@${owner} verificado no GitHub`,
      };

      if (typeof window !== 'undefined' && window.sessionStorage) {
        try {
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({ timestamp: Date.now(), data: metrics })
          );
        } catch {}
      }

      return metrics;
    }

    throw new Error('Falha ao comunicar com a API do GitHub');
  } catch (err) {
    console.warn('[GitHubService] Could not retrieve live metrics, using defaults:', err);
    return {
      owner,
      repo,
      stars: 0,
      forks: 0,
      openIssues: 0,
      contributorsCount: 1,
      defaultBranch: 'main',
      license: 'MIT',
      profileUrl: `https://github.com/${owner}`,
      isLive: false,
      statusMessage: 'Offline / Modo padrão',
    };
  }
}

export function useGitHubMetrics(repoUrl?: string) {
  const [metrics, setMetrics] = useState<GitHubMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchGitHubMetrics(repoUrl);
      setMetrics(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Falha ao buscar dados');
    } finally {
      setIsLoading(false);
    }
  }, [repoUrl]);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  return { metrics, isLoading, error, refresh: loadMetrics };
}
