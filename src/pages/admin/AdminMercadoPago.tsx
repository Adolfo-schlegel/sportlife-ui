import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import client from '../../api/client'
import { Save, Wifi, WifiOff, Eye, EyeOff, RefreshCw } from 'lucide-react'
import styles from './AdminMercadoPago.module.css'

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
    accessToken: '', publicKey: '', webhookSecret: '',
    notificationUrl: '', successUrl: '', failureUrl: '', pendingUrl: '',
    isTestMode: true, updatedAt: '',
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
    setSaving(true); setSaveMsg(null)
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
    setTesting(true); setTestResult(null)
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

  const urlFields = [
    { key: 'notificationUrl', label: 'Notification URL (Webhook)', placeholder: 'https://tmntech.ddns.net/sportlife-api/api/webhooks/mercadopago' },
    { key: 'successUrl',      label: 'Success URL',                placeholder: 'https://tmntech.ddns.net/sportlife/payment/success' },
    { key: 'failureUrl',      label: 'Failure URL',                placeholder: 'https://tmntech.ddns.net/sportlife/payment/failure' },
    { key: 'pendingUrl',      label: 'Pending URL',                placeholder: 'https://tmntech.ddns.net/sportlife/payment/pending' },
  ]

  if (loading) return <Layout><div className={styles.loading}>Cargando configuración...</div></Layout>

  return (
    <Layout>
      <div className={styles.header}>
        <h1 className={styles.title}>MercadoPago</h1>
        <p className={styles.subtitle}>Configuración del sistema de pagos</p>
      </div>

      <div className={styles.sections}>
        {/* Modo */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Modo de Operación</h3>
          <div className={styles.modeRow}>
            <button
              onClick={() => setConfig(c => ({ ...c, isTestMode: true }))}
              className={`${styles.modeBtn} ${config.isTestMode ? styles.modeSandboxActive : ''}`}
            >
              Sandbox (pruebas)
            </button>
            <button
              onClick={() => setConfig(c => ({ ...c, isTestMode: false }))}
              className={`${styles.modeBtn} ${!config.isTestMode ? styles.modeProdActive : ''}`}
            >
              Producción (real)
            </button>
          </div>
          {config.isTestMode  && <p className={`${styles.modeNote} ${styles.modeNoteSandbox}`}>Modo sandbox activo — los pagos son simulados.</p>}
          {!config.isTestMode && <p className={`${styles.modeNote} ${styles.modeNoteProd}`}>Modo producción activo — los pagos son reales.</p>}
        </div>

        {/* Credenciales */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Credenciales</h3>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label className={styles.label}>Access Token</label>
              <div className={styles.inputWrap}>
                <input
                  type={showToken ? 'text' : 'password'}
                  value={config.accessToken}
                  onChange={e => setConfig(c => ({ ...c, accessToken: e.target.value }))}
                  placeholder={config.isTestMode ? 'TEST-xxxx...' : 'APP_USR-xxxx...'}
                  className={`${styles.input} ${styles.inputWithBtn}`}
                />
                <button onClick={() => setShowToken(v => !v)} className={styles.eyeBtn}>
                  {showToken ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className={styles.fieldHint}>
                {config.isTestMode ? 'Usá el Access Token de SANDBOX (empieza con TEST-)' : 'Usá el Access Token de PRODUCCIÓN (empieza con APP_USR-)'}
              </p>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Public Key</label>
              <input
                type="text"
                value={config.publicKey}
                onChange={e => setConfig(c => ({ ...c, publicKey: e.target.value }))}
                placeholder={config.isTestMode ? 'TEST-xxxx...' : 'APP_USR-xxxx...'}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Webhook Secret</label>
              <div className={styles.inputWrap}>
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={config.webhookSecret}
                  onChange={e => setConfig(c => ({ ...c, webhookSecret: e.target.value }))}
                  placeholder="Secret para validar webhooks"
                  className={`${styles.input} ${styles.inputWithBtn}`}
                />
                <button onClick={() => setShowSecret(v => !v)} className={styles.eyeBtn}>
                  {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* URLs */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>URLs de Redirección</h3>
          <div className={styles.fields}>
            {urlFields.map(({ key, label, placeholder }) => (
              <div key={key} className={styles.field}>
                <label className={styles.label}>{label}</label>
                <input
                  type="url"
                  value={(config as unknown as Record<string, string>)[key]}
                  onChange={e => setConfig(c => ({ ...c, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className={styles.input}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button onClick={handleTest} disabled={testing} className={styles.btnTest}>
            {testing
              ? <RefreshCw size={15} className={styles.spinIcon} />
              : <Wifi size={15} />
            }
            {testing ? 'Probando...' : 'Probar conexión'}
          </button>
          <button onClick={handleSave} disabled={saving} className={styles.btnSave}>
            <Save size={15} />
            {saving ? 'Guardando...' : 'Guardar configuración'}
          </button>
        </div>

        {testResult && (
          <div className={testResult.connected ? styles.alertOk : styles.alertErr}>
            {testResult.connected
              ? <><Wifi size={15} /> Conexión exitosa con MercadoPago</>
              : <><WifiOff size={15} /> Error: {testResult.error}</>
            }
          </div>
        )}

        {saveMsg && (
          <div className={saveMsg.ok ? styles.alertOk : styles.alertErr}>
            {saveMsg.text}
          </div>
        )}

        {/* Guía */}
        <div className={styles.guide}>
          <h3 className={styles.guideTitle}>Guía Rápida</h3>
          <div className={styles.guideSection}>
            <p className={styles.guideSectionTitle}>Para recibir pagos reales en tu cuenta:</p>
            <ol className={styles.guideOl}>
              <li>Entrá a <span>developers.mercadopago.com</span></li>
              <li>Creá una aplicación</li>
              <li>Copiá el Access Token de PRODUCCIÓN (empieza con APP_USR-)</li>
              <li>Pegalo arriba, activá modo Producción y guardá</li>
              <li>Asegurate que la Notification URL sea accesible desde internet</li>
            </ol>
          </div>

          <div className={styles.guideSection}>
            <p className={styles.guideSectionTitle}>Tarjetas de prueba (modo Sandbox):</p>
            <div className={styles.cards}>
              <div className={styles.cardRow}>Visa: <span>4509 9535 6623 3704</span> CVV: <span>123</span> Venc: <span>11/25</span></div>
              <div className={styles.cardRow}>Mastercard: <span>5031 7557 3453 0604</span> CVV: <span>123</span> Venc: <span>11/25</span></div>
              <div>Titular: <span className={styles.cardApprove}>APRO</span> (aprobar) / <span className={styles.cardReject}>OTHE</span> (rechazar)</div>
            </div>
          </div>

          {config.updatedAt && (
            <p className={styles.guideFooter}>
              Última actualización: {new Date(config.updatedAt).toLocaleString('es-AR')}
            </p>
          )}
        </div>
      </div>
    </Layout>
  )
}
