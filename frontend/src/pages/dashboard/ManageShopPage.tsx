import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/config/supabase'
import DashboardLayout from '@/layouts/DashboardLayout'

export default function ManageShopPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  // Shop availability state
  const [isOpen, setIsOpen] = useState(true)
  const [openingTime, setOpeningTime] = useState('09:00')
  const [closingTime, setClosingTime] = useState('21:00')
  const [statusNote, setStatusNote] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const [statusSaved, setStatusSaved] = useState(false)

  // Shop info state
  const [shopName, setShopName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  
  // Location state
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'denied' | 'success'>('idle')
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [manualAddress, setManualAddress] = useState('')

  useEffect(() => {
    fetchShop()
  }, [])

  const fetchShop = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/login'); return }

      const { data: shopData } = await supabase
        .from('shops')
        .select('*')
        .eq('shopkeeper_id', session.user.id)
        .single()

      if (shopData) {
        setShopName(shopData.name || '')
        setDescription(shopData.description || '')
        setAddress(shopData.address || '')
        setCity(shopData.city || '')
        setIsOpen(shopData.is_open ?? true)
        setOpeningTime(shopData.opening_time || '09:00')
        setClosingTime(shopData.closing_time || '21:00')
        setStatusNote(shopData.status_note || '')
        setLat(shopData.latitude || null)
        setLng(shopData.longitude || null)
        setManualAddress(shopData.address || '')
      }
    } catch (err) {
      console.error('Error fetching shop:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGetLocation = async () => {
    setLocationStatus('detecting')
    
    if (!navigator.geolocation) {
      setLocationStatus('denied')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLat(latitude)
        setLng(longitude)

        // Reverse geocode using OpenStreetMap Nominatim
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'SmartFetch-App'
              }
            }
          )
          const data = await response.json()
          const detectedAddress = data.address?.road || data.address?.street || data.display_name || ''
          const detectedCity = data.address?.city || data.address?.town || data.address?.village || ''
          
          setManualAddress(detectedAddress)
          setCity(detectedCity)
          setLocationStatus('success')
        } catch (err) {
          console.error('Geocoding error:', err)
          setLocationStatus('success')
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        setLocationStatus('denied')
      }
    )
  }

  const handleSaveAvailability = async () => {
    setSavingStatus(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { error } = await supabase
        .from('shops')
        .update({
          is_open: isOpen,
          opening_time: openingTime,
          closing_time: closingTime,
          status_note: statusNote || null,
          address: manualAddress || address,
          city: city,
          latitude: lat,
          longitude: lng
        })
        .eq('shopkeeper_id', session.user.id)

      if (error) throw error
      setStatusSaved(true)
      setTimeout(() => setStatusSaved(false), 3000)
    } catch (err: any) {
      alert('Failed to save: ' + err.message)
    } finally {
      setSavingStatus(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <p style={{ color: '#9CA3AF' }}>Loading shop details...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '700px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            color: '#F9FAFB', fontSize: '1.75rem', fontWeight: 900,
            margin: '0 0 6px', letterSpacing: '-0.03em',
            fontFamily: 'Inter, sans-serif'
          }}>Manage Shop</h1>
          <p style={{ color: '#6B7280', margin: 0, fontSize: '0.875rem' }}>
            Update your shop details and availability
          </p>
        </div>

        {/* Shop Info Section */}
        <div style={{
          background: '#0C1120',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px', padding: '24px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            color: '#F9FAFB', fontWeight: 700,
            fontSize: '1rem', marginBottom: '20px'
          }}>📋 Shop Information</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{
                display: 'block', color: '#9CA3AF',
                fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.04em', marginBottom: '8px'
              }}>SHOP NAME</label>
              <input
                type="text"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                style={{
                  width: '100%', height: '44px', padding: '0 12px',
                  background: '#0F1829',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: '#F9FAFB',
                  fontSize: '0.9rem', outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block', color: '#9CA3AF',
                fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.04em', marginBottom: '8px'
              }}>CITY</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                style={{
                  width: '100%', height: '44px', padding: '0 12px',
                  background: '#0F1829',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: '#F9FAFB',
                  fontSize: '0.9rem', outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', color: '#9CA3AF',
              fontSize: '0.75rem', fontWeight: 600,
              letterSpacing: '0.04em', marginBottom: '8px'
            }}>ADDRESS</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              style={{
                width: '100%', height: '44px', padding: '0 12px',
                background: '#0F1829',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', color: '#F9FAFB',
                fontSize: '0.9rem', outline: 'none',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', color: '#9CA3AF',
              fontSize: '0.75rem', fontWeight: 600,
              letterSpacing: '0.04em', marginBottom: '8px'
            }}>DESCRIPTION</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '12px',
                background: '#0F1829',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', color: '#F9FAFB',
                fontSize: '0.9rem', outline: 'none',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Location Detection Section */}
        <div style={{
          background: '#0C1120',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px', padding: '24px',
          marginBottom: '20px'
        }}>
          <h3 style={{
            color: '#F9FAFB', fontWeight: 700,
            fontSize: '1rem', marginBottom: '20px'
          }}>📍 Shop Location</h3>

          {/* Auto-detect button */}
          <div style={{ marginBottom: '16px' }}>
            <button
              onClick={handleGetLocation}
              disabled={locationStatus === 'detecting'}
              style={{
                width: '100%', height: '44px',
                background: locationStatus === 'success' 
                  ? 'rgba(34,197,94,0.15)' 
                  : 'rgba(59,130,246,0.15)',
                border: locationStatus === 'success'
                  ? '1px solid rgba(34,197,94,0.3)'
                  : '1px solid rgba(59,130,246,0.3)',
                borderRadius: '10px',
                color: locationStatus === 'success' ? '#4ADE80' : '#3B82F6',
                fontWeight: 600, fontSize: '0.9rem',
                cursor: locationStatus === 'detecting' ? 'not-allowed' : 'pointer',
                opacity: locationStatus === 'detecting' ? 0.7 : 1,
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease'
              }}
            >
              {locationStatus === 'detecting' ? '🔄 Detecting location...' : 
               locationStatus === 'success' ? '✅ Location detected' :
               locationStatus === 'denied' ? '❌ Permission denied' :
               '📍 Auto-detect my location'}
            </button>
          </div>

          {/* Permission denied message */}
          {locationStatus === 'denied' && (
            <div style={{
              padding: '12px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px',
              marginBottom: '16px'
            }}>
              <p style={{ color: '#F87171', fontSize: '0.875rem', margin: 0 }}>
                📍 Location permission denied. Please enable location access in your browser settings to auto-detect your shop location. You can also enter it manually below.
              </p>
            </div>
          )}

          {/* Detected location info */}
          {locationStatus === 'success' && lat && lng && (
            <div style={{
              padding: '12px',
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '10px',
              marginBottom: '16px'
            }}>
              <p style={{ color: '#4ADE80', fontSize: '0.875rem', margin: '0 0 8px' }}>
                ✅ Location detected successfully
              </p>
              <p style={{ color: '#9CA3AF', fontSize: '0.8rem', margin: 0 }}>
                Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
              </p>
            </div>
          )}

          {/* Manual address input */}
          <div>
            <label style={{
              display: 'block', color: '#9CA3AF',
              fontSize: '0.75rem', fontWeight: 600,
              letterSpacing: '0.04em', marginBottom: '8px'
            }}>SHOP ADDRESS (Manual Entry)</label>
            <textarea
              value={manualAddress}
              onChange={e => setManualAddress(e.target.value)}
              placeholder="Enter your shop address here..."
              rows={3}
              style={{
                width: '100%', padding: '12px',
                background: '#0F1829',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', color: '#F9FAFB',
                fontSize: '0.9rem', outline: 'none',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* Shop Availability Section */}
        <div style={{
          background: '#0C1120',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px', padding: '24px',
          marginTop: '20px'
        }}>
          <h3 style={{
            color: '#F9FAFB', fontWeight: 700,
            fontSize: '1rem', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            🏪 Shop Availability
            <span style={{
              padding: '3px 10px', borderRadius: '99px', fontSize: '0.72rem',
              fontWeight: 700,
              background: isOpen ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              color: isOpen ? '#4ADE80' : '#F87171',
              border: `1px solid ${isOpen ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
            }}>
              {isOpen ? '🟢 Open' : '🔴 Closed'}
            </span>
          </h3>

          {/* Toggle */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px', marginBottom: '16px'
          }}>
            <div>
              <p style={{ color: '#F9FAFB', fontWeight: 600, margin: '0 0 4px', fontSize: '0.9rem' }}>
                Shop Status
              </p>
              <p style={{ color: '#6B7280', margin: 0, fontSize: '0.8rem' }}>
                {isOpen ? 'Customers can place orders' : 'Ordering is disabled for customers'}
              </p>
            </div>
            {/* Toggle switch */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              style={{
                width: '52px', height: '28px', borderRadius: '99px',
                background: isOpen ? '#3B82F6' : 'rgba(255,255,255,0.1)',
                cursor: 'pointer', position: 'relative',
                transition: 'all 0.3s ease', flexShrink: 0,
                boxShadow: isOpen ? '0 0 12px rgba(59,130,246,0.4)' : 'none'
              }}
            >
              <div style={{
                position: 'absolute', top: '4px',
                left: isOpen ? '28px' : '4px',
                width: '20px', height: '20px',
                borderRadius: '50%', background: '#fff',
                transition: 'left 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }} />
            </div>
          </div>

          {/* Opening/Closing time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{
                display: 'block', color: '#9CA3AF',
                fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.04em', marginBottom: '8px'
              }}>OPENING TIME</label>
              <input
                type="time"
                value={openingTime}
                onChange={e => setOpeningTime(e.target.value)}
                style={{
                  width: '100%', height: '44px', padding: '0 12px',
                  background: '#0F1829',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: '#F9FAFB',
                  fontSize: '0.9rem', outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block', color: '#9CA3AF',
                fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.04em', marginBottom: '8px'
              }}>CLOSING TIME</label>
              <input
                type="time"
                value={closingTime}
                onChange={e => setClosingTime(e.target.value)}
                style={{
                  width: '100%', height: '44px', padding: '0 12px',
                  background: '#0F1829',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', color: '#F9FAFB',
                  fontSize: '0.9rem', outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Status note - shown only when closed */}
          {!isOpen && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block', color: '#9CA3AF',
                fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.04em', marginBottom: '8px'
              }}>REASON FOR CLOSING (optional)</label>
              <input
                value={statusNote}
                onChange={e => setStatusNote(e.target.value)}
                placeholder="e.g. Back in 2 hours, Holiday today..."
                style={{
                  width: '100%', height: '44px', padding: '0 14px',
                  background: '#0F1829',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '10px', color: '#F9FAFB',
                  fontSize: '0.875rem', outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {statusSaved && (
            <p style={{ color: '#4ADE80', fontSize: '0.875rem', marginBottom: '12px' }}>
              ✅ Shop status updated!
            </p>
          )}

          <button
            onClick={handleSaveAvailability}
            disabled={savingStatus}
            style={{
              width: '100%', height: '46px',
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
              border: 'none', borderRadius: '12px',
              color: '#fff', fontWeight: 700, fontSize: '0.9rem',
              cursor: savingStatus ? 'not-allowed' : 'pointer',
              opacity: savingStatus ? 0.7 : 1,
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {savingStatus ? 'Saving...' : 'Save Availability'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
