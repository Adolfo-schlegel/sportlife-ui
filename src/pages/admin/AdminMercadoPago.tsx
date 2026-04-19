import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import client from '../../api/client'
import { Save, Wifi, WifiOff, Eye, EyeOff, RefreshCw } from 'lucide-react'

interface MpConfig {
  accessToken: string
  publicKey: string
  webhookSecret: string
  notificationUrl: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
  isTestMode: boolean
  updatedAt: string
}

interface TestResult {
  connected: boolean
  error?: string
}

export default function AdminMercadoPago() {
  const [config, setConfig] = useState<MpConfig>({
    accessToken: '',
    publicKey: '',
    webhookSecret: '',
    notificationUrl: '',
    successUrl: '',
    failureUrl: '',
    pendingUrl: '',
    isTestMode: true,
    updatedAt: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [showToken, setShowToken] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  useEffect(() => {
    client.get('/configurations/mercadopago')
      .then(r => setConfig(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg(null)
    try {
      const res = await client.put('/configurations/mercadopago', config)
      setConfig(res.data)
      setSaveMsg({ ok: true, text: 'Configuración guardada correctamente.' })
    } catch {
      setSaveMsg({ ok: false, text: 'Error al guardar. Verificá los datos.' })
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await client.post('/configurations/mercadopago/test')
      setTestResult(res.data)
    } catch (err: unknown) {
      const data = (err as { response?: { data?: TestResult } })?.response?.data
      setTestResult(data ?? { connected: false, error: 'Error de conexión' })
    } finally {
      setTesting(false)
    }
  }

  const inputClass = 'w-full px-4 py-2.5 bg-background border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary transition-colors'
  const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2'

  if (loading) return <Layout><div className="text-gray-500 text-sm">Cargando configuración...</div></Layout>

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-white">MercadoPago</h1>
        <p className="text-gray-500 mt-1 text-sm">Configuración del sistema de pagos</p>
      </div>

      <div className="max-w-3xl space-y-6">

        {/* Modo sandbox/producción */}
        <div className="bg-surface border border-border-dark rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">Modo de operación</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setConfig(c => ({ ...c, isTestMode: true }))}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
                config.isTestMode
                  ? 'bg-warning text-black'
                  : 'bg-transparent border border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              🧪 Sandbox (pruebas)
            </button>
            <button
              onClick={() => setConfig(c => ({ ...c, isTestMode: false }))}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
                !config.isTestMode
                  ? 'bg-success text-black'
                  : 'bg-transparent border border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              ✅ Producción (real)
            </button>
          </div>
          {config.isTestMode && (
            <p className="text-warning text-xs mt-3">
              Modo sandbox activo — los pagos son simulados, no se mueve dinero real.
            </p>
          )}
          {!config.isTestMode && (
            <p className="text-success text-xs mt-3">
              Modo producción activo — los pagos son reales y el dinero va a tu cuenta de MercadoPago.
            </p>
          )}
        </div>

        {/* Credenciales */}
        <div className="bg-surface border border-border-dark rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">Credenciales</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Access Token</label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={config.accessToken}
                  onChange={e => setConfig(c => ({ ...c, accessToken: e.target.value }))}
                  placeholder={config.isTestMode ? 'TEST-xxxx...' : 'APP_USR-xxxx...'}
                  className={inputClass + ' pr-10'}
                />
                <button
                  onClick={() => setShowToken(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-gray-600 text-xs mt-1">
                {config.isTestMode
                  ? 'Usá el Access Token de SANDBOX (empieza con TEST-)'
                  : 'Usá el Access Token de PRODUCCIÓN (empieza con APP_USR-)'}
              </p>
            </div>

            <div>
              <label className={labelClass}>Public Key</label>
              <input
                type="text"
                value={config.publicKey}
                onChange={e => setConfig(c => ({ ...c, publicKey: e.target.value }))}
                placeholder={config.isTestMode ? 'TEST-xxxx...' : 'APP_USR-xxxx...'}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Webhook Secret</label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={config.webhookSecret}
                  onChange={e => setConfig(c => ({ ...c, webhookSecret: e.target.value }))}
                  placeholder="Secret para validar webhooks"
                  className={inputClass + ' pr-10'}
                />
                <button
                  onClick={() => setShowSecret(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* URLs */}
        <div className="bg-surface border border-border-dark rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">URLs de redirección</h3>
          <div className="space-y-4">
            {[
              { key: 'notificationUrl', label: 'Notification URL (Webhook)', placeholder: 'https://tudominio.com/api/webhooks/mercadopago' },
              { key: 'successUrl', label: 'Success URL', placeholder: 'https://tudominio.com/sportlife/payment/success' },
              { key: 'failureUrl', label: 'Failure URL', placeholder: 'https://tudominio.com/sportlife/payment/failure' },
              { key: 'pendingUrl', label: 'Pending URL', placeholder: 'https://tudominio.com/sportlife/payment/pending' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <input
                  type="url"
                  value={(config as unknown as Record<string, string>)[key]}
                  onChange={e => setConfig(c => ({ ...c, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={handleTest}
            disabled={testing}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {testing ? <RefreshCw size={16} className="animate-spin" /> : <Wifi size={16} />}
            {testing ? 'Probando...' : 'Probar conexión'}
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? 'Guardando...' : 'Guardar configuración'}
          </button>
        </div>

        {/* Test result */}
        {testResult && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
            testResult.connected
              ? 'bg-success/10 border-success/30 text-success'
              : 'bg-primary/10 border-primary/30 text-primary'
          }`}>
            {testResult.connected
              ? <><Wifi size={16} /> Conexión exitosa con MercadoPago ✅</>
              : <><WifiOff size={16} /> Error: {testResult.error}</>
            }
          </div>
        )}

        {/* Save message */}
        {saveMsg && (
          <div className={`px-4 py-3 rounded-xl border text-sm ${
            saveMsg.ok
              ? 'bg-success/10 border-success/30 text-success'
              : 'bg-primary/10 border-primary/30 text-primary'
          }`}>
            {saveMsg.text}
          </div>
        )}

        {/* Guía rápida */}
        <div className="bg-surface border border-border-dark rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">📋 Guía rápida</h3>
          <div className="space-y-4 text-sm text-gray-400">
            <div>
              <p className="text-white font-semibold mb-1">Para recibir pagos reales en tu cuenta:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-400">
                <li>Entrá a <span className="text-primary">developers.mercadopago.com</span></li>
                <li>Creá una aplicación</li>
                <li>Copiá el <span className="text-white">Access Token de PRODUCCIÓN</span> (empieza con APP_USR-)</li>
                <li>Pegalo arriba, activá modo Producción y guardá</li>
                <li>Asegurate que la Notification URL sea accesible desde internet</li>
              </ol>
            </div>

            <div>
              <p className="text-white font-semibold mb-1">Tarjetas de prueba (modo Sandbox):</p>
              <div className="bg-background rounded-lg p-4 space-y-2 font-mono text-xs">
                <div>
                  <span className="text-gray-600">Visa:</span>{' '}
                  <span className="text-white">4509 9535 6623 3704</span>{' '}
                  <span className="text-gray-600">CVV:</span>{' '}
                  <span className="text-white">123</span>{' '}
                  <span className="text-gray-600">Venc:</span>{' '}
                  <span className="text-white">11/25</span>
                </div>
                <div>
                  <span className="text-gray-600">Mastercard:</span>{' '}
                  <span className="text-white">5031 7557 3453 0604</span>{' '}
                  <span className="text-gray-600">CVV:</span>{' '}
                  <span className="text-white">123</span>{' '}
                  <span className="text-gray-600">Venc:</span>{' '}
                  <span className="text-white">11/25</span>
                </div>
                <div className="text-gray-500 mt-2">
                  Nombre del titular: <span className="text-success">APRO</span> (aprobar) /{' '}
                  <span className="text-primary">OTHE</span> (rechazar)
                </div>
              </div>
            </div>

            {config.updatedAt && (
              <p className="text-gray-600 text-xs">
                Última actualización: {new Date(config.updatedAt).toLocaleString('es-AR')}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
