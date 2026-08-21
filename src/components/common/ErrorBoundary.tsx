import React, { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Portfolio App Crash:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F7F7F5',
            color: '#0A0A0A',
            padding: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #DCDCDC',
              borderRadius: '8px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>
              Memuat Halaman Portofolio
            </h2>
            <p style={{ fontSize: '14px', color: '#6F6F6F', marginBottom: '24px', lineHeight: 1.5 }}>
              {this.state.error?.message || 'Terjadi kesalahan saat memuat aplikasi.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.href = '/'
              }}
              style={{
                backgroundColor: '#0A0A0A',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                cursor: 'pointer'
              }}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
