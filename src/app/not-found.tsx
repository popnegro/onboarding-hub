import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pxsol-light px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-pxsol-dark mb-4">404</h1>
        <p className="text-2xl text-pxsol-gray mb-8">Página no encontrada</p>
        <p className="text-pxsol-gray mb-8">
          La página que buscas no existe o ha sido removida.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-pxsol-blue text-white rounded-lg font-bold hover:bg-blue-700 transition"
        >
          Ir al Inicio
        </Link>
      </div>
    </div>
  )
}
