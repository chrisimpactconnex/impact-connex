import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch SROI calculation
  const { data: sroiData, error } = await supabase
    .from('sroi_calculations')
    .select(`
      id,
      total_investment,
      total_value_created,
      sroi_ratio,
      value_breakdown,
      confidence_score,
      validation_status,
      period_start,
      period_end,
      organization:organizations!sroi_calculations_organization_id_fkey(name),
      corporate_client:organizations!sroi_calculations_corporate_client_id_fkey(name)
    `)
    .eq('id', '00000000-2025-0001-0001-000000000001')
    .single()

  if (error) {
    console.error('Error fetching SROI data:', error)
    return <div>Error loading data</div>
  }

  const employmentValue = sroiData.value_breakdown?.employment?.value || 0
  const foodSecurityValue = sroiData.value_breakdown?.food_security?.value || 0
  const environmentalValue = sroiData.value_breakdown?.environmental?.value || 0
  const economicValue = sroiData.value_breakdown?.economic?.value || 0

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Impact Dashboard
          </h1>
          <p className="text-gray-600">
            {sroiData.organization?.name} → {sroiData.corporate_client?.name}
          </p>
        </div>

        {/* SROI Summary Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Investment</p>
              <p className="text-3xl font-bold text-gray-900">
                ${sroiData.total_investment.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Value Created</p>
              <p className="text-3xl font-bold text-green-600">
                ${sroiData.total_value_created.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">SROI Ratio</p>
              <p className="text-3xl font-bold text-blue-600">
                {sroiData.sroi_ratio}:1
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {sroiData.validation_status}
              </span>
              <span className="text-sm text-gray-600">
                Confidence: {(sroiData.confidence_score * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Period: {new Date(sroiData.period_start).toLocaleDateString()} - {new Date(sroiData.period_end).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Value Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Employment */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Employment</h3>
              <span className="text-2xl">💼</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              ${employmentValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              {((employmentValue / sroiData.total_value_created) * 100).toFixed(1)}% of total value
            </p>
          </div>

          {/* Food Security */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Food Security</h3>
              <span className="text-2xl">🍽️</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              ${foodSecurityValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              {((foodSecurityValue / sroiData.total_value_created) * 100).toFixed(1)}% of total value
            </p>
          </div>

          {/* Environmental */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Environmental</h3>
              <span className="text-2xl">🌱</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              ${environmentalValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              {((environmentalValue / sroiData.total_value_created) * 100).toFixed(1)}% of total value
            </p>
          </div>

          {/* Economic */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Economic</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              ${economicValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              {((economicValue / sroiData.total_value_created) * 100).toFixed(1)}% of total value
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}