
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Code, 
  Copy, 
  FileCode, 
  Terminal, 
  CheckCircle,
  Laptop,
  Server,
  Database,
  FileJson,
  TerminalSquare
} from 'lucide-react';
import { toast } from 'sonner';
import ChatInterface from './ChatInterface';

export const CodeGenerator = () => {
  const [domain, setDomain] = useState('mi-sitio.com');
  const [apiKey, setApiKey] = useState('sk_live_1a2b3c4d5e6f7g8h9i0j');
  const [iframeCode, setIframeCode] = useState('');
  const [sdkImportCode, setSdkImportCode] = useState('');
  const [pythonCode, setPythonCode] = useState('');
  const [showChat, setShowChat] = useState(false);
  
  // Generar códigos de integración basados en dominio y API key
  React.useEffect(() => {
    // Iframe
    setIframeCode(`<iframe
  src="https://api.chatify-sdk.com/embed?key=${apiKey}&domain=${domain}"
  width="100%"
  height="600px"
  style="border:none;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);"
  allow="microphone; camera"
  title="Asistente de Chat"
></iframe>`);

    // SDK Import
    setSdkImportCode(`<!-- Añadir esto justo antes del cierre de </body> -->
<script>
  (function(c,h,a,t,i,f,y){
    c[i]=c[i]||function(){(c[i].q=c[i].q||[]).push(arguments)};
    c[i].l=1*new Date();f=h.createElement(a);
    f.async=1;f.src=t;y=h.getElementsByTagName(a)[0];
    y.parentNode.insertBefore(f,y);
  })(window,document,'script','https://cdn.chatify-sdk.com/chatify.js','chatify');
  
  chatify('init', '${apiKey}', { domain: '${domain}' });
</script>`);

    // Python
    setPythonCode(`import chatify

# Inicializa la conexión con el SDK
client = chatify.Client(api_key='${apiKey}')

# Configura la base de datos
client.config.database(
    url="postgresql://user:password@localhost:5432/mydb",
    tables=["products", "users", "orders"]
)

# Activa el asistente con acceso a la base de datos
assistant = client.assistants.create(
    name="DB Assistant",
    description="Asistente con acceso a la base de datos",
    model="gpt-4",
    tools=["database_query"]
)

# Ejemplo de uso en un servidor Flask
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    query = request.json.get('query')
    conversation = client.conversations.create(
        assistant_id=assistant.id
    )
    response = conversation.send_message(content=query)
    return jsonify({"response": response.content})

if __name__ == '__main__':
    app.run(debug=True)`);
  }, [domain, apiKey]);
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Código ${type} copiado al portapapeles`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Integración</h1>
        <p className="text-muted-foreground text-lg">
          Genera el código para integrar el chat en tu aplicación
        </p>
      </div>
      
      <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
        <CardHeader>
          <CardTitle>Configuración de la integración</CardTitle>
          <CardDescription>
            Personaliza los parámetros para generar el código de integración
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="domain">Dominio</Label>
              <Input 
                id="domain" 
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="ejemplo.com"
              />
              <p className="text-xs text-muted-foreground">Dominio donde se integrará el chat</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex">
                <Input 
                  id="api-key" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk_live_..."
                  className="font-mono text-sm"
                />
                <Button 
                  variant="ghost" 
                  className="ml-2"
                  onClick={() => {
                    const keys = [
                      'sk_live_1a2b3c4d5e6f7g8h9i0j',
                      'sk_live_9i8h7g6f5e4d3c2b1a0z',
                      'sk_test_q1w2e3r4t5y6u7i8o9p0'
                    ];
                    setApiKey(keys[Math.floor(Math.random() * keys.length)]);
                  }}
                >
                  <Terminal className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Utiliza una clave de API válida de tu cuenta</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowChat(!showChat)}
              className="flex items-center gap-2"
            >
              {showChat ? "Ocultar" : "Mostrar"} vista previa del chat 
              <Code className="h-4 w-4" />
            </Button>
          </div>
          
          {showChat && (
            <div className="py-4">
              <h3 className="text-sm font-semibold mb-4">Vista previa del chat con opciones predefinidas</h3>
              <ChatInterface />
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="iframe" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="iframe">
            <Laptop className="h-4 w-4 mr-2" />
            Iframe
          </TabsTrigger>
          <TabsTrigger value="sdk">
            <FileCode className="h-4 w-4 mr-2" />
            JavaScript
          </TabsTrigger>
          <TabsTrigger value="python">
            <TerminalSquare className="h-4 w-4 mr-2" />
            Python SDK
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="iframe" className="pt-6">
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
            <CardHeader>
              <div className="flex items-center">
                <Code className="mr-2 h-5 w-5" />
                <CardTitle>Código de Iframe</CardTitle>
              </div>
              <CardDescription>
                Copia y pega este código HTML en tu sitio web
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <pre className="p-4 rounded-md bg-secondary/50 border overflow-x-auto font-mono text-sm">
                  {iframeCode}
                </pre>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => copyToClipboard(iframeCode, 'iframe')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Vista previa</h3>
                <div className="border rounded-lg p-4 bg-white">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: `<div style="width:100%;height:300px;border:1px solid #e2e8f0;border-radius:8px;display:flex;align-items:center;justify-content:center;background-color:#f9fafb">
                        <div style="text-align:center">
                          <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background-color:#f3f4f6;margin-bottom:12px">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                          </div>
                          <p style="font-size:14px;color:#6b7280;margin:0">Vista previa del chat (modo simulación)</p>
                        </div>
                      </div>` 
                    }} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Instrucciones</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Copia el código de iframe mostrado arriba</li>
                  <li>Pega el código en el lugar de tu sitio web donde quieras que aparezca el chat</li>
                  <li>Puedes ajustar el ancho, alto y estilos según tus necesidades</li>
                  <li>El chat se cargará automáticamente cuando un usuario visite la página</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sdk" className="pt-6">
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
            <CardHeader>
              <div className="flex items-center">
                <FileCode className="mr-2 h-5 w-5" />
                <CardTitle>Integración con JavaScript</CardTitle>
              </div>
              <CardDescription>
                Integración avanzada mediante nuestro SDK de JavaScript
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <pre className="p-4 rounded-md bg-secondary/50 border overflow-x-auto font-mono text-sm">
                  {sdkImportCode}
                </pre>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => copyToClipboard(sdkImportCode, 'SDK')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Configuración avanzada</h3>
                <div className="relative">
                  <pre className="p-4 rounded-md bg-secondary/50 border overflow-x-auto font-mono text-sm">
{`// Personalización avanzada
chatify('config', {
  theme: {
    primaryColor: '#0284c7',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px'
  },
  position: 'right', // 'left', 'right', 'center'
  initialMessage: '¡Hola! ¿En qué puedo ayudarte?',
  labels: {
    headerTitle: 'Asistente',
    inputPlaceholder: 'Escribe un mensaje...',
    sendButtonLabel: 'Enviar'
  },
  analytics: true,
  predefinedOptions: true, // Habilitar opciones predefinidas
  reportTypes: ['sales', 'users', 'inventory'] // Tipos de informes disponibles
});

// Eventos personalizados
chatify('on', 'open', function() {
  console.log('Chat abierto');
});

chatify('on', 'message', function(message) {
  console.log('Nuevo mensaje:', message);
});

// API programática
document.querySelector('#help-button').addEventListener('click', function() {
  chatify('open'); // Abre el chat
  chatify('send', '¿Cómo puedo cambiar mi contraseña?');
});`}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => copyToClipboard(`// Personalización avanzada
chatify('config', {
  theme: {
    primaryColor: '#0284c7',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px'
  },
  position: 'right', // 'left', 'right', 'center'
  initialMessage: '¡Hola! ¿En qué puedo ayudarte?',
  labels: {
    headerTitle: 'Asistente',
    inputPlaceholder: 'Escribe un mensaje...',
    sendButtonLabel: 'Enviar'
  },
  analytics: true,
  predefinedOptions: true, // Habilitar opciones predefinidas
  reportTypes: ['sales', 'users', 'inventory'] // Tipos de informes disponibles
});

// Eventos personalizados
chatify('on', 'open', function() {
  console.log('Chat abierto');
});

chatify('on', 'message', function(message) {
  console.log('Nuevo mensaje:', message);
});

// API programática
document.querySelector('#help-button').addEventListener('click', function() {
  chatify('open'); // Abre el chat
  chatify('send', '¿Cómo puedo cambiar mi contraseña?');
});`, 'configuración')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Instrucciones</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Copia el código de integración del SDK</li>
                  <li>Pégalo justo antes del cierre de la etiqueta <code>&lt;/body&gt;</code> en tu sitio</li>
                  <li>Personaliza las opciones según tus necesidades</li>
                  <li>El botón del chat aparecerá automáticamente en tu sitio web</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="python" className="pt-6">
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
            <CardHeader>
              <div className="flex items-center">
                <TerminalSquare className="mr-2 h-5 w-5" />
                <CardTitle>SDK de Python</CardTitle>
              </div>
              <CardDescription>
                Integración avanzada con bases de datos mediante nuestro SDK de Python
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Instalación</span>
                </div>
                <div className="relative">
                  <pre className="p-4 rounded-md bg-secondary/50 border overflow-x-auto font-mono text-sm">
                    pip install chatify-sdk
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => copyToClipboard('pip install chatify-sdk', 'instalación')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Conexión a base de datos</span>
                </div>
                <div className="relative">
                  <pre className="p-4 rounded-md bg-secondary/50 border overflow-x-auto font-mono text-sm">
                    {pythonCode}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => copyToClipboard(pythonCode, 'Python')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FileJson className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Configuración avanzada</span>
                </div>
                <div className="relative">
                  <pre className="p-4 rounded-md bg-secondary/50 border overflow-x-auto font-mono text-sm">
{`# Configuración avanzada del SDK
client.config.set({
    "openai_api_key": "sk-...",  # Opcional: Usa tu propia clave de OpenAI
    "log_level": "info",
    "max_tokens": 8192,
    "context_window": 15,  # Número de mensajes anteriores a incluir
    "cache_ttl": 3600,     # Tiempo de caché en segundos
    "timeout": 30,         # Timeout para solicitudes API
    "database_schema": {   # Esquema DB para consultas automáticas
        "products": {
            "primary_key": "id",
            "searchable_fields": ["name", "description", "category"]
        },
        "users": {
            "primary_key": "user_id",
            "foreign_keys": {
                "last_order_id": "orders.order_id"
            }
        }
    },
    "predefined_report_options": {  # Opciones de informes predefinidos
        "sales": ["daily", "weekly", "monthly", "quarterly"],
        "users": ["new", "active", "retention", "churn"],
        "inventory": ["low_stock", "popular", "seasonal"]
    }
})`}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => copyToClipboard(`# Configuración avanzada del SDK
client.config.set({
    "openai_api_key": "sk-...",  # Opcional: Usa tu propia clave de OpenAI
    "log_level": "info",
    "max_tokens": 8192,
    "context_window": 15,  # Número de mensajes anteriores a incluir
    "cache_ttl": 3600,     # Tiempo de caché en segundos
    "timeout": 30,         # Timeout para solicitudes API
    "database_schema": {   # Esquema DB para consultas automáticas
        "products": {
            "primary_key": "id",
            "searchable_fields": ["name", "description", "category"]
        },
        "users": {
            "primary_key": "user_id",
            "foreign_keys": {
                "last_order_id": "orders.order_id"
            }
        }
    },
    "predefined_report_options": {  # Opciones de informes predefinidos
        "sales": ["daily", "weekly", "monthly", "quarterly"],
        "users": ["new", "active", "retention", "churn"],
        "inventory": ["low_stock", "popular", "seasonal"]
    }
})`, 'configuración avanzada')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Instrucciones</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Instala el SDK de Python con pip</li>
                  <li>Configura la conexión a tu base de datos</li>
                  <li>Implementa el código en tu servidor backend</li>
                  <li>Conecta tu frontend al backend a través de una API REST</li>
                  <li>El asistente puede ahora consultar y analizar datos de tu base de datos</li>
                  <li>Configura opciones predefinidas para mejorar la experiencia de usuario</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeGenerator;
