import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-wine-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-premium">
            Premium Wine & Spirits Marketplace
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Connect with licensed sellers and discover exceptional wines and spirits. 
            Experience transparent pricing, real-time trading, and full regulatory compliance.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              TTB Compliant
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              50-State Licensed
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Age Verified (21+)
            </div>
          </div>
          
          <Link href="/marketplace">
            <button className="btn-premium px-10 py-4 rounded-full text-lg font-semibold shadow-lg">
              Enter Marketplace
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-premium mb-16">
            Why Choose Our Platform?
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Link href="/marketplace" className="group">
              <div className="card-premium rounded-xl p-6 h-full">
                <div className="text-4xl mb-4">🍷</div>
                <h3 className="text-xl font-bold text-wine-800 mb-3">
                  Curated Product Catalog
                </h3>
                <p className="text-slate-600 text-sm">
                  Browse premium wines and spirits from verified, licensed sellers with detailed provenance.
                </p>
              </div>
            </Link>
            
            <Link href="/marketplace" className="group">
              <div className="card-premium rounded-xl p-6 h-full">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-wine-800 mb-3">
                  Real-Time Order Book
                </h3>
                <p className="text-slate-600 text-sm">
                  Experience transparent trading with our advanced order matching system.
                </p>
              </div>
            </Link>
            
            <Link href="/marketplace" className="group">
              <div className="card-premium rounded-xl p-6 h-full">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold text-wine-800 mb-3">
                  Full Compliance
                </h3>
                <p className="text-slate-600 text-sm">
                  Every transaction is fully compliant with TTB regulations and state laws.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-wine-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-wine-200 mb-6">
            Join collectors and industry professionals on our trusted platform.
          </p>
          
          <Link href="/marketplace">
            <button className="btn-gold px-8 py-3 rounded-full font-semibold">
              Browse Marketplace
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
