import React from 'react';
import { useBilling } from '@/auth/BillingContext';
import { ProductType, IndustryVertical, SubscriptionType } from '@/types/billing';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ProductSelection = () => {
  const { billingState, setBillingState } = useBilling();

  const products = [
    {
      type: ProductType.COREBRAIN,
      name: 'CoreBrain',
      description: 'Conecta bases de datos con IA para analizar datos y generar insights',
      price: 0, // Included in subscription
      features: [
        'Análisis de datos con IA',
        'Generación de insights',
        'Consultas en lenguaje natural',
        'Integración con múltiples fuentes de datos'
      ]
    },
    {
      type: ProductType.DATAVAULT,
      name: 'DataVault',
      description: 'Almacenamiento seguro y estructurado de datos con encriptación',
      price: 19.99,
      features: [
        'Almacenamiento seguro',
        'Encriptación de datos',
        'Backup automático',
        'Control de acceso granular'
      ]
    },
    {
      type: ProductType.INSIGHTENGINE,
      name: 'InsightEngine',
      description: 'Motor de análisis predictivo e informes avanzados con IA',
      price: 39.99,
      features: [
        'Análisis predictivo',
        'Generación de informes',
        'Visualización de datos',
        'Alertas personalizadas'
      ]
    },
    {
      type: ProductType.CHATCONNECT,
      name: 'ChatConnect',
      description: 'Integración de chat con IA para websites y aplicaciones',
      price: 29.99,
      features: [
        'Chatbot con IA',
        'Integración web',
        'Personalización de respuestas',
        'Análisis de conversaciones'
      ]
    }
  ];

  const verticals = [
    {
      type: IndustryVertical.HOSPITALITY,
      name: 'Hospitality Suite',
      description: 'Solución especializada para el sector hotelero',
      price: 49.99,
      features: [
        'Conectores PMS',
        'Análisis de satisfacción',
        'Optimización de precios',
        'Dashboard específico'
      ]
    },
    {
      type: IndustryVertical.AGRICULTURE,
      name: 'Agriculture Suite',
      description: 'Solución especializada para el sector agrícola',
      price: 59.99,
      features: [
        'Análisis de cultivos',
        'Integración sensores',
        'Previsión de cosechas',
        'Trazabilidad'
      ]
    }
  ];

  const handleProductToggle = (productType: ProductType) => {
    setBillingState(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productType)
        ? prev.selectedProducts.filter(p => p !== productType)
        : [...prev.selectedProducts, productType]
    }));
  };

  const handleVerticalToggle = (verticalType: IndustryVertical) => {
    setBillingState(prev => ({
      ...prev,
      selectedVerticals: prev.selectedVerticals.includes(verticalType)
        ? prev.selectedVerticals.filter(v => v !== verticalType)
        : [...prev.selectedVerticals, verticalType]
    }));
  };

  const handleAdditionalUsersChange = (value: number) => {
    setBillingState(prev => ({
      ...prev,
      addOns: {
        ...prev.addOns,
        additionalUsers: value
      }
    }));
  };

  const handleAddOnToggle = (addOn: keyof typeof billingState.addOns) => {
    setBillingState(prev => ({
      ...prev,
      addOns: {
        ...prev.addOns,
        [addOn]: !prev.addOns[addOn]
      }
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Selección de Productos</h1>
        <p className="text-xl text-gray-600">
          Personaliza tu plan con los productos y complementos que necesites
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Productos principales */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Productos Principales</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.type}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                  {product.price > 0 && (
                    <div className="mt-2">
                      <span className="text-xl font-bold">€{product.price}</span>
                      <span className="text-gray-500">/mes</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Switch
                    checked={billingState.selectedProducts.includes(product.type)}
                    onCheckedChange={() => handleProductToggle(product.type)}
                    disabled={product.type === ProductType.COREBRAIN}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Verticales de industria */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Verticales de Industria</h2>
          <div className="space-y-4">
            {verticals.map((vertical) => (
              <Card key={vertical.type}>
                <CardHeader>
                  <CardTitle>{vertical.name}</CardTitle>
                  <CardDescription>{vertical.description}</CardDescription>
                  <div className="mt-2">
                    <span className="text-xl font-bold">€{vertical.price}</span>
                    <span className="text-gray-500">/mes</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {vertical.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Switch
                    checked={billingState.selectedVerticals.includes(vertical.type)}
                    onCheckedChange={() => handleVerticalToggle(vertical.type)}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Add-ons */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Complementos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios Adicionales</CardTitle>
              <CardDescription>
                Añade más miembros a tu equipo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  min="0"
                  value={billingState.addOns.additionalUsers || 0}
                  onChange={(e) => handleAdditionalUsersChange(parseInt(e.target.value))}
                  className="w-24"
                />
                <Label>
                  €{billingState.subscriptionType === SubscriptionType.PRO ? '14.99' : '12.99'}/usuario/mes
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modelos Personalizados</CardTitle>
              <CardDescription>
                Fine-tuning específico para tu caso de uso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>
                  €{billingState.subscriptionType === SubscriptionType.PRO ? '199.99' : '149.99'}/mes
                </Label>
                <Switch
                  checked={billingState.addOns.customModels}
                  onCheckedChange={() => handleAddOnToggle('customModels')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acceso GPT-4 Premium</CardTitle>
              <CardDescription>
                Acceso a modelos avanzados de IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>
                  €{billingState.subscriptionType === SubscriptionType.PRO ? '99.99' : '49.99'}/mes
                </Label>
                <Switch
                  checked={billingState.addOns.priorityGPT}
                  onCheckedChange={() => handleAddOnToggle('priorityGPT')}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Infraestructura Dedicada</CardTitle>
              <CardDescription>
                Servidores exclusivos para rendimiento óptimo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>€499.99/mes</Label>
                <Switch
                  checked={billingState.addOns.dedicatedInfrastructure}
                  onCheckedChange={() => handleAddOnToggle('dedicatedInfrastructure')}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button size="lg" className="px-8">
          Continuar con el pago
        </Button>
      </div>
    </div>
  );
};

export default ProductSelection; 