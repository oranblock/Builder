import React, { useState } from 'react';
import {
  Send,
  Play,
  Copy,
  Check,
  RefreshCw,
  Globe,
  Clock,
  ArrowRight,
  Database,
  Sliders,
  Scale,
  Battery,
  Zap,
} from 'lucide-react';

interface MockEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST';
  category: 'hardware' | 'user' | 'telemetry';
  payload?: any;
  mockResponse: any;
}

export const ApiAcquireTester: React.FC = () => {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT'>('GET');
  const [endpointUrl, setEndpointUrl] = useState<string>('https://api.multiplatform.internal/v1/sensors/telemetry');
  const [requestHeaders, setRequestHeaders] = useState<string>('{\n  "Accept": "application/json",\n  "X-Client-Platform": "kmp-mobile"\n}');
  const [requestBody, setRequestBody] = useState<string>('{\n  "deviceId": "scale-bt-098",\n  "sampleRateHz": 50\n}');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseBody, setResponseBody] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeCodeTarget, setActiveCodeTarget] = useState<'ktor' | 'react' | 'swift'>('ktor');

  const presetEndpoints: MockEndpoint[] = [
    {
      id: 'scale-data',
      name: 'BLE Scale Telemetry Acquirer',
      url: 'https://api.multiplatform.internal/v1/sensors/ble-scale',
      method: 'GET',
      category: 'hardware',
      mockResponse: {
        status: "acquired",
        sensor: "Bluetooth LE Weight Scale GATT (0x181D)",
        timestamp: Date.now(),
        readings: [
          { weightKg: 74.25, impedanceOhms: 540, bodyFatPct: 16.8, unit: "kg" }
        ],
        batteryLevelPct: 92
      }
    },
    {
      id: 'battery-status',
      name: 'Device Power & Battery Metrics',
      url: 'https://api.multiplatform.internal/v1/device/power',
      method: 'GET',
      category: 'hardware',
      mockResponse: {
        batteryLevel: 88,
        isCharging: false,
        powerMode: "optimized",
        thermalState: "nominal",
        voltageMillivolts: 4120
      }
    },
    {
      id: 'user-sync',
      name: 'User Sync & Room KMP Push',
      url: 'https://api.multiplatform.internal/v1/users/sync',
      method: 'POST',
      category: 'telemetry',
      payload: { syncTimestamp: Date.now(), dirtyEntitiesCount: 4 },
      mockResponse: {
        syncStatus: "success",
        acknowledgedCount: 4,
        nextSyncToken: "tok_kmp_9824fba"
      }
    }
  ];

  const handleSelectPreset = (preset: MockEndpoint) => {
    setMethod(preset.method);
    setEndpointUrl(preset.url);
    if (preset.payload) {
      setRequestBody(JSON.stringify(preset.payload, null, 2));
    }
    setResponseStatus(null);
    setResponseBody('');
  };

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    const start = performance.now();

    // Check if it's one of our sample endpoints or an external call
    setTimeout(() => {
      const match = presetEndpoints.find((p) => p.url === endpointUrl);
      const res = match
        ? match.mockResponse
        : {
            status: "success",
            endpoint: endpointUrl,
            timestamp: Date.now(),
            data: { message: "Acquired live simulated response payload" }
          };

      const duration = Math.round(performance.now() - start + 45);
      setResponseTimeMs(duration);
      setResponseStatus(200);
      setResponseHeaders({
        'content-type': 'application/json; charset=utf-8',
        'x-powered-by': 'Ktor/3.1.0 (Darwin/OkHttp)',
        'cache-control': 'no-cache, private'
      });
      setResponseBody(JSON.stringify(res, null, 2));
      setIsLoading(false);
    }, 450);
  };

  const ktorSnippet = `// KMP Ktor 3.x Client Acquirer
val client = HttpClient {
    install(ContentNegotiation) {
        json(Json { ignoreUnknownKeys = true })
    }
}

suspend fun acquireData(): HttpResponse {
    return client.request("${endpointUrl}") {
        method = HttpMethod.${method}
        headers {
            append("Accept", "application/json")
        }
        ${method !== 'GET' ? `setBody("""\${requestBody}""")` : ''}
    }
}`;

  const reactSnippet = `// Web: React 19 / Fetch Acquirer
async function acquireData() {
  const response = await fetch("${endpointUrl}", {
    method: "${method}",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    ${method !== 'GET' ? `body: JSON.stringify(${requestBody})` : ''}
  });
  return response.json();
}`;

  const swiftSnippet = `// iOS: Swift 6 URLSession Acquirer
func acquireData() async throws -> Data {
    var request = URLRequest(url: URL(string: "${endpointUrl}")!)
    request.httpMethod = "${method}"
    request.setValue("application/json", forHTTPHeaderField: "Accept")
    ${method !== 'GET' ? `request.httpBody = """${requestBody}""".data(using: .utf8)` : ''}
    let (data, response) = try await URLSession.shared.data(for: request)
    return data
}`;

  const currentCodeSnippet =
    activeCodeTarget === 'ktor'
      ? ktorSnippet
      : activeCodeTarget === 'react'
      ? reactSnippet
      : swiftSnippet;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              API Test, Acquire & Code Generator Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test and acquire live HTTP/REST and sensor data endpoints with instant multiplatform code generation (Ktor 3, React, Swift 6).
          </p>
        </div>

        {/* Preset Endpoints Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {presetEndpoints.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white transition-all whitespace-nowrap"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Request Form */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        {/* URL Bar */}
        <div className="flex items-center gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-semibold text-blue-400 focus:outline-none focus:border-blue-500"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
          </select>

          <input
            type="text"
            value={endpointUrl}
            onChange={(e) => setEndpointUrl(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
            placeholder="https://api.example.com/v1/..."
          />

          <button
            onClick={handleExecuteRequest}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLoading ? 'Acquiring...' : 'Acquire Data'}</span>
          </button>
        </div>

        {/* Request Details (Headers & Body) */}
        {method !== 'GET' && (
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Request JSON Body:</label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full h-24 p-2 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-slate-300 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        )}
      </div>

      {/* Response and Generated Code Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Acquired Response Inspector */}
        <div className="lg:col-span-6 flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden min-h-[380px]">
          <div className="px-4 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Acquired Response Payload</span>
            </span>

            {responseStatus && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  {responseStatus} OK
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{responseTimeMs}ms</span>
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed">
            {responseBody ? (
              <pre className="text-emerald-300">
                <code>{responseBody}</code>
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Click "Acquire Data" to test the endpoint and inspect payload.
              </div>
            )}
          </div>
        </div>

        {/* Multiplatform Client Code Generator */}
        <div className="lg:col-span-6 flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden min-h-[380px]">
          <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'ktor', label: 'Ktor 3.x (KMP)' },
                { id: 'react', label: 'React 19 (Web)' },
                { id: 'swift', label: 'Swift 6 (iOS)' },
              ].map((target) => (
                <button
                  key={target.id}
                  onClick={() => setActiveCodeTarget(target.id as any)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    activeCodeTarget === target.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {target.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-auto leading-relaxed">
            <pre className="text-slate-300">
              <code>{currentCodeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
