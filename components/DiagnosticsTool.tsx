'use client';

import { useState } from 'react';
import { HotType, GithubPeriod } from '@/types/hot';
import axios from 'axios';

export function DiagnosticsTool() {
  const [apiUrl, setApiUrl] = useState('/api/hot-list');
  const [type, setType] = useState<HotType>('github');
  const [period, setPeriod] = useState<GithubPeriod>('weekly');
  const [force, setForce] = useState(true);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(apiUrl, { type, period, force });
      setResponse(res.data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 bg-slate-900 text-white border border-gray-700 rounded-md overflow-hidden">
      <div className="p-4 border-b border-gray-700 bg-slate-800">
        <h2 className="text-xl font-bold">API诊断工具</h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm">API URL</label>
          <input
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full p-2 rounded bg-slate-800 border border-gray-700 text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm">热榜类型</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as HotType)}
              className="w-full p-2 rounded bg-slate-800 border border-gray-700 text-white"
            >
              <option value="github">GitHub</option>
              <option value="juejin">掘金</option>
              <option value="weibo">微博</option>
              <option value="bilibili">B站</option>
              <option value="ithome">IT之家</option>
              <option value="sspai">少数派</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm">时间周期</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as GithubPeriod)}
              className="w-full p-2 rounded bg-slate-800 border border-gray-700 text-white"
            >
              <option value="daily">日榜</option>
              <option value="weekly">周榜</option>
              <option value="monthly">月榜</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm">强制刷新</label>
            <select
              value={force ? 'true' : 'false'}
              onChange={(e) => setForce(e.target.value === 'true')}
              className="w-full p-2 rounded bg-slate-800 border border-gray-700 text-white"
            >
              <option value="true">是</option>
              <option value="false">否</option>
            </select>
          </div>
        </div>

        <button
          onClick={testApi}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
        >
          {loading ? '请求中...' : '测试API'}
        </button>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-700 rounded-md">
            <h3 className="font-medium text-red-400">错误:</h3>
            <p className="text-sm text-white">{error}</p>
          </div>
        )}

        {response && (
          <div className="p-4 bg-slate-800 border border-slate-700 rounded-md">
            <h3 className="font-medium mb-2">响应:</h3>
            <div className="overflow-auto max-h-96">
              <pre className="text-xs">{JSON.stringify(response, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-800 text-xs text-gray-400 text-center">
        此工具仅在开发环境可见
      </div>
    </div>
  );
}
