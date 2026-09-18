import PCModel3D from '@/components/PCModel3D'

export default function Test3DPage() {
  return (
    <main style={{ 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#111', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
        Test Modèle 3D PC
      </h1>
      <div style={{ width: '100%', height: '80vh' }}>
        <PCModel3D />
      </div>
    </main>
  )
}
