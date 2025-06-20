import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent mb-6">
            Wine & Spirits Market Trader
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            A compliant alcohol marketplace platform operating as a Third-Party Provider (TPP) 
            under TTB Circular 2023-1 and California ABC guidelines.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="wine" size="lg">
              Browse Marketplace
            </Button>
            <Button variant="outline" size="lg">
              Seller Portal
            </Button>
          </div>
        </div>

        {/* Compliance Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔒 No Title Transfer
              </CardTitle>
              <CardDescription>
                Marketplace never takes possession of alcohol inventory per TTB requirements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💳 Split Payments
              </CardTitle>
              <CardDescription>
                Seller receives funds first, marketplace fee deducted after (Stripe Connect)
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🆔 Age Verification
              </CardTitle>
              <CardDescription>
                KYC + ID verification for all buyers (21+) with adult signature delivery
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Sample Product Listings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Listings</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Wine Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>2019 Napa Valley Cabernet</CardTitle>
                <CardDescription>Premium estate wine from licensed seller</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">$89.99</span>
                  <span className="text-sm text-slate-500">750ml</span>
                </div>
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div>📍 Ships to: CA, NY, WA (+47 states)</div>
                  <div>🏷️ Licensed Seller: ABC Winery</div>
                  <div>🚚 Adult Signature Required</div>
                </div>
                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              </CardContent>
            </Card>

            {/* Sample Spirits Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Small Batch Bourbon</CardTitle>
                <CardDescription>Craft distillery limited release</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">$129.99</span>
                  <span className="text-sm text-slate-500">750ml</span>
                </div>
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div>📍 Ships to: TX, CO, FL (+35 states)</div>
                  <div>🏷️ Licensed Seller: XYZ Distillery</div>
                  <div>🚚 Adult Signature Required</div>
                </div>
                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              </CardContent>
            </Card>

            {/* Sample Rare Wine Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>2015 Bordeaux First Growth</CardTitle>
                <CardDescription>Investment-grade collectible wine</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">$449.99</span>
                  <span className="text-sm text-slate-500">750ml</span>
                </div>
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div>📍 Ships to: CA, NY, IL (+42 states)</div>
                  <div>🏷️ Licensed Seller: Premium Wines Inc</div>
                  <div>🚚 Adult Signature Required</div>
                </div>
                <Button className="w-full" variant="wine">
                  Place Bid
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Regulatory Compliance */}
        <Card className="bg-slate-50 border-2 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Regulatory Compliance</CardTitle>
            <CardDescription>
              Operating under federal and state alcohol regulations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Federal Compliance</h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• TTB Circular 2023-1 Third-Party Provider</li>
                  <li>• No tied-house violations</li>
                  <li>• Proper payment flow (27 C.F.R.)</li>
                  <li>• Age verification requirements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">State Compliance</h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• CA ABC Type 85 marketplace license</li>
                  <li>• 50-state shipping matrix validation</li>
                  <li>• Adult signature delivery enforcement</li>
                  <li>• Quarterly compliance reporting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
