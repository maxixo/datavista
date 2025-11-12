import Link from 'next/link'
import { ArrowRight, BarChart3, Database, Zap, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DataVista</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Analytics That Work
          <span className="text-blue-600"> Anywhere</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload, transform, and visualize your data with powerful tools that work 
          seamlessly online and offline.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Free Trial
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Database className="w-8 h-8 text-blue-600" />}
            title="Large Datasets"
            description="Handle up to 50,000 rows smoothly with virtual scrolling and optimized rendering."
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-purple-600" />}
            title="Real-time Updates"
            description="Apply filters, sorts, and aggregations with instant visual feedback."
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8 text-green-600" />}
            title="Interactive Charts"
            description="Create beautiful bar, line, pie, and scatter charts with a few clicks."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-orange-600" />}
            title="Offline First"
            description="Work without internet. Your data syncs automatically when you're back online."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-gray-600">
          <p>© 2025 DataVista. Built for the Stage 4C Challenge.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}