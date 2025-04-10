
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Download, 
  Plus, 
  ClipboardCheck, 
  Gift, 
  Clock, 
  ChevronsUpDown,
  CheckCircle,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

// Datos de ejemplo
const invoices = [
  { 
    id: 'INV-001', 
    date: '10 Nov 2023', 
    amount: '29.99€', 
    status: 'paid' 
  },
  { 
    id: 'INV-002', 
    date: '10 Dic 2023', 
    amount: '29.99€', 
    status: 'paid' 
  },
  { 
    id: 'INV-003', 
    date: '10 Ene 2024', 
    amount: '29.99€', 
    status: 'paid' 
  },
  { 
    id: 'INV-004', 
    date: '10 Feb 2024', 
    amount: '29.99€', 
    status: 'pending' 
  },
];

const plans = [
  {
    name: 'Básico',
    price: '0€',
    priceDetail: 'gratis para siempre',
    description: 'Para desarrolladores y proyectos personales',
    features: [
      '1.000 mensajes/mes',
      '1 token de API',
      'Personalización básica',
      'Soporte por email'
    ],
    current: false,
    popular: false
  },
  {
    name: 'Pro',
    price: '29€',
    priceDetail: 'por mes',
    description: 'Para equipos y empresas pequeñas',
    features: [
      '50.000 mensajes/mes',
      'Tokens de API ilimitados',
      'Personalización avanzada',
      'Soporte prioritario',
      'Análisis avanzado',
      'Integración con bases de datos'
    ],
    current: true,
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Personalizado',
    priceDetail: 'contactar',
    description: 'Para grandes organizaciones',
    features: [
      'Volumen ilimitado',
      'Tokens de API ilimitados',
      'Personalización total',
      'Soporte 24/7',
      'Despliegue on-premise',
      'Acuerdo de nivel de servicio',
      'Conformidad GDPR/HIPAA'
    ],
    current: false,
    popular: false
  }
];

export const Billing = () => {
  const saveBillingInfo = () => {
    toast.success('Información de facturación actualizada');
  };
  
  const copyApiKey = () => {
    toast.success('Código promocional copiado');
  };
  
  const downloadInvoice = (invoiceId: string) => {
    toast.success(`Factura ${invoiceId} descargada`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Facturación</h1>
        <p className="text-muted-foreground text-lg">
          Gestiona tu suscripción, método de pago e historial de facturas
        </p>
      </div>
      
      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="subscription">Suscripción</TabsTrigger>
          <TabsTrigger value="payment">Pago</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription" className="space-y-6 pt-6">
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Plan actual</CardTitle>
                  <CardDescription>
                    Información detallada de tu plan actual
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="ml-4">Pro</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Mensajes</span>
                  <span className="font-medium">23,456 / 50,000</span>
                </div>
                <Progress value={46} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>50,000</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pt-2">
                  <div className="space-y-1">
                    <h4 className="font-medium">Ciclo de facturación</h4>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      Renovación: 10 de marzo, 2024
                    </div>
                  </div>
                  <Badge variant="outline">Mensual</Badge>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="space-y-1">
                    <h4 className="font-medium">Método de pago</h4>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <CreditCard className="mr-1 h-4 w-4" />
                      •••• •••• •••• 4242
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Cambiar</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline">Cancelar suscripción</Button>
              <Button>Cambiar plan</Button>
            </CardFooter>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative transition-all duration-300 hover:shadow-md ${
                  plan.current 
                    ? 'border-primary ring-1 ring-primary' 
                    : 'hover:border-primary/30'
                } ${plan.popular ? 'animate-pulse-light' : 'animate-slide-up'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-0 w-full flex justify-center">
                    <Badge className="bg-primary">Popular</Badge>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Actual
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {' '}
                    <span className="text-muted-foreground">{plan.priceDetail}</span>
                  </div>
                  
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={plan.current ? "secondary" : "default"} 
                    className="w-full"
                    disabled={plan.current}
                  >
                    {plan.current ? 'Plan actual' : `Elegir ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.3s'}}>
            <CardHeader>
              <div className="flex items-center">
                <Gift className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>Código promocional</CardTitle>
              </div>
              <CardDescription>
                ¿Tienes un código promocional? Aplícalo a tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input placeholder="Ingresa tu código promocional" />
                <Button>Aplicar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-6 pt-6">
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
            <CardHeader>
              <div className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                <CardTitle>Métodos de pago</CardTitle>
              </div>
              <CardDescription>
                Administra tus métodos de pago
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center mr-4">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Visa terminada en 4242</p>
                    <p className="text-sm text-muted-foreground">Expira 12/25</p>
                  </div>
                </div>
                <Badge>Predeterminada</Badge>
              </div>
              
              <Button variant="outline" className="w-full flex items-center justify-center">
                <Plus className="mr-2 h-4 w-4" />
                Añadir método de pago
              </Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.1s'}}>
            <CardHeader>
              <CardTitle>Información de facturación</CardTitle>
              <CardDescription>
                Datos para tus facturas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nombre de empresa</Label>
                  <Input id="company-name" defaultValue="Empresa Demo, S.L." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-id">NIF/CIF</Label>
                  <Input id="tax-id" defaultValue="B12345678" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" defaultValue="Calle Principal 123" />
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" defaultValue="Madrid" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Código postal</Label>
                  <Input id="postal-code" defaultValue="28001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <select 
                    id="country" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue="ES"
                  >
                    <option value="ES">España</option>
                    <option value="US">Estados Unidos</option>
                    <option value="FR">Francia</option>
                    <option value="DE">Alemania</option>
                    <option value="IT">Italia</option>
                    <option value="PT">Portugal</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={saveBillingInfo}>Guardar información</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-6 pt-6">
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
            <CardHeader>
              <div className="flex items-center">
                <ClipboardCheck className="mr-2 h-5 w-5" />
                <CardTitle>Historial de facturas</CardTitle>
              </div>
              <CardDescription>
                Ver y descargar facturas anteriores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Importe</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        {invoice.status === 'paid' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Pagada
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Pendiente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => downloadInvoice(invoice.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Billing;
