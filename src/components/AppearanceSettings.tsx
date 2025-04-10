
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  PaintBucket, 
  Circle, 
  Type, 
  Save, 
  RotateCcw, 
  Layout, 
  MessageSquare, 
  MonitorSmartphone,
  ChevronRight,
  BarChart,
  User,
  FileText,
  LineChart,
  Database,
  ArrowRight,
  Check,
  Calendar,
  Search,
  Building,
  PieChart,
  Download
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

export const AppearanceSettings = () => {
  // Estados para la personalización del chat
  const [primaryColor, setPrimaryColor] = useState('#0284c7');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#1e293b');
  const [borderRadius, setBorderRadius] = useState(12);
  const [width, setWidth] = useState(380);
  const [height, setHeight] = useState(500);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [chatPosition, setChatPosition] = useState('right');
  const [buttonStyle, setButtonStyle] = useState('circle');
  const [buttonIcon, setButtonIcon] = useState('chat');
  
  // Nuevo estado para manejar los mensajes del chat en la simulación
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Hola, ¿en qué puedo ayudarte hoy?',
      options: [
        { id: 'sales', icon: <BarChart className="h-3 w-3 mr-2" />, text: 'Informe de ventas' },
        { id: 'users', icon: <User className="h-3 w-3 mr-2" />, text: 'Análisis de usuarios' },
        { id: 'db', icon: <Database className="h-3 w-3 mr-2" />, text: 'Estado de la base de datos' }
      ]
    }
  ]);
  
  // Función para simular respuestas del chatbot
  const handleOptionClick = (optionId) => {
    // Añadir mensaje del usuario
    let userMessage = '';
    let botResponse = {};
    
    switch(optionId) {
      case 'sales':
        userMessage = 'Necesito ver el informe de ventas';
        botResponse = {
          sender: 'bot',
          text: '¿Qué tipo de informe de ventas te gustaría consultar?',
          options: [
            { id: 'monthly', icon: <Calendar className="h-3 w-3 mr-1" />, text: 'Mensual', variant: 'secondary' },
            { id: 'quarterly', icon: <PieChart className="h-3 w-3 mr-1" />, text: 'Trimestral', variant: 'secondary' },
            { id: 'annual', icon: <BarChart className="h-3 w-3 mr-1" />, text: 'Anual', variant: 'secondary' },
          ]
        };
        break;
      case 'users':
        userMessage = 'Quiero analizar los datos de usuarios';
        botResponse = {
          sender: 'bot',
          text: '¿Qué análisis de usuarios necesitas?',
          options: [
            { id: 'active', icon: <User className="h-3 w-3 mr-1" />, text: 'Usuarios activos', variant: 'secondary' },
            { id: 'new', icon: <User className="h-3 w-3 mr-1" />, text: 'Nuevos registros', variant: 'secondary' },
            { id: 'behavior', icon: <LineChart className="h-3 w-3 mr-1" />, text: 'Comportamiento', variant: 'secondary' },
          ]
        };
        break;
      case 'db':
        userMessage = 'Necesito información sobre la base de datos';
        botResponse = {
          sender: 'bot',
          text: '¿Qué información de la base de datos necesitas consultar?',
          options: [
            { id: 'status', icon: <Database className="h-3 w-3 mr-1" />, text: 'Estado actual', variant: 'secondary' },
            { id: 'performance', icon: <LineChart className="h-3 w-3 mr-1" />, text: 'Rendimiento', variant: 'secondary' },
            { id: 'backup', icon: <Download className="h-3 w-3 mr-1" />, text: 'Copias de seguridad', variant: 'secondary' },
          ]
        };
        break;
      case 'monthly':
      case 'quarterly':
      case 'annual':
        userMessage = `Quiero ver el informe ${optionId === 'monthly' ? 'mensual' : optionId === 'quarterly' ? 'trimestral' : 'anual'} de ventas`;
        botResponse = {
          sender: 'bot',
          text: `Aquí tienes el informe ${optionId === 'monthly' ? 'mensual' : optionId === 'quarterly' ? 'trimestral' : 'anual'} de ventas.`,
          chart: true,
          options: [
            { id: 'download', icon: <Download className="h-3 w-3 mr-1" />, text: 'Descargar informe', variant: 'outline' },
            { id: 'back', icon: <ArrowRight className="h-3 w-3 mr-1" />, text: 'Más opciones', variant: 'outline' },
          ]
        };
        break;
      case 'active':
      case 'new':
      case 'behavior':
        userMessage = `Quiero ver el análisis de ${optionId === 'active' ? 'usuarios activos' : optionId === 'new' ? 'nuevos registros' : 'comportamiento'}`;
        botResponse = {
          sender: 'bot',
          text: `Aquí tienes el análisis de ${optionId === 'active' ? 'usuarios activos' : optionId === 'new' ? 'nuevos registros' : 'comportamiento'}.`,
          chart: true,
          options: [
            { id: 'download', icon: <Download className="h-3 w-3 mr-1" />, text: 'Descargar análisis', variant: 'outline' },
            { id: 'back', icon: <ArrowRight className="h-3 w-3 mr-1" />, text: 'Más opciones', variant: 'outline' },
          ]
        };
        break;
      case 'status':
      case 'performance':
      case 'backup':
        userMessage = `Quiero ver ${optionId === 'status' ? 'el estado actual' : optionId === 'performance' ? 'el rendimiento' : 'las copias de seguridad'} de la base de datos`;
        botResponse = {
          sender: 'bot',
          text: `Aquí tienes la información sobre ${optionId === 'status' ? 'el estado actual' : optionId === 'performance' ? 'el rendimiento' : 'las copias de seguridad'} de la base de datos.`,
          chart: true,
          options: [
            { id: 'download', icon: <Download className="h-3 w-3 mr-1" />, text: 'Descargar informe', variant: 'outline' },
            { id: 'back', icon: <ArrowRight className="h-3 w-3 mr-1" />, text: 'Más opciones', variant: 'outline' },
          ]
        };
        break;
      case 'download':
        userMessage = 'Quiero descargar este informe';
        botResponse = {
          sender: 'bot',
          text: 'El informe se ha descargado correctamente. ¿Puedo ayudarte con algo más?',
          options: [
            { id: 'restart', icon: <RotateCcw className="h-3 w-3 mr-1" />, text: 'Nueva consulta', variant: 'secondary' },
          ]
        };
        break;
      case 'back':
      case 'restart':
        userMessage = 'Quiero ver más opciones';
        // Reiniciar la conversación
        setChatMessages([
          {
            sender: 'bot',
            text: 'Hola, ¿en qué más puedo ayudarte hoy?',
            options: [
              { id: 'sales', icon: <BarChart className="h-3 w-3 mr-2" />, text: 'Informe de ventas' },
              { id: 'users', icon: <User className="h-3 w-3 mr-2" />, text: 'Análisis de usuarios' },
              { id: 'db', icon: <Database className="h-3 w-3 mr-2" />, text: 'Estado de la base de datos' }
            ]
          }
        ]);
        return;
      default:
        userMessage = 'Necesito información sobre sus servicios';
        botResponse = {
          sender: 'bot',
          text: '¿Qué tipo de información te interesa?',
          options: [
            { id: 'pricing', icon: <FileText className="h-3 w-3 mr-1" />, text: 'Precios', variant: 'secondary' },
            { id: 'plans', icon: <LineChart className="h-3 w-3 mr-1" />, text: 'Planes', variant: 'secondary' },
            { id: 'support', icon: <User className="h-3 w-3 mr-1" />, text: 'Soporte', variant: 'secondary' },
          ]
        };
    }
    
    // Actualizar los mensajes del chat
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: userMessage },
      botResponse
    ]);
    
    // Scroll hacia abajo automático (para simular)
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-body');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  };
  
  const saveSettings = () => {
    toast.success('Configuración guardada correctamente');
  };
  
  const resetSettings = () => {
    setPrimaryColor('#0284c7');
    setBackgroundColor('#ffffff');
    setTextColor('#1e293b');
    setBorderRadius(12);
    setWidth(380);
    setHeight(500);
    setFontFamily('Inter');
    setChatPosition('right');
    setButtonStyle('circle');
    setButtonIcon('chat');
    
    // Reiniciar el chat
    setChatMessages([
      {
        sender: 'bot',
        text: 'Hola, ¿en qué puedo ayudarte hoy?',
        options: [
          { id: 'sales', icon: <BarChart className="h-3 w-3 mr-2" />, text: 'Informe de ventas' },
          { id: 'users', icon: <User className="h-3 w-3 mr-2" />, text: 'Análisis de usuarios' },
          { id: 'db', icon: <Database className="h-3 w-3 mr-2" />, text: 'Estado de la base de datos' }
        ]
      }
    ]);
    
    toast.success('Configuración restablecida');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Personalización</h1>
        <p className="text-muted-foreground text-lg">
          Personaliza la apariencia del chat para integrarlo en tu aplicación
        </p>
      </div>
      
      {/* Nueva estructura con diseño adaptable */}
      <div className="flex flex-col xl:flex-row gap-8 min-h-[calc(100vh-250px)]">
        {/* Panel de Vista Previa - Flotante en pantallas grandes, arriba en móviles */}
        <div className="xl:sticky xl:top-24 xl:self-start xl:flex-shrink-0 xl:w-[400px] order-2 xl:order-1">
          <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MonitorSmartphone className="mr-2 h-5 w-5" />
                Vista previa
              </CardTitle>
              <CardDescription>
                Así se verá tu chat en tu aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div 
                className="border rounded-lg p-4 aspect-auto bg-gradient-to-br from-slate-50 to-gray-100 shadow-inner overflow-hidden"
                style={{ height: "450px" }} // Altura fija para el contenedor de la vista previa
              >
                {/* Simulación de la interfaz web/móvil */}
                <div className="w-full h-8 bg-gray-200 rounded-md mb-2"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded-md mb-4"></div>
                
                {/* El Chat */}
                <div 
                  className="absolute transition-all duration-300"
                  style={{
                    bottom: '20px',
                    ...(chatPosition === 'left' ? { left: '20px' } : 
                       chatPosition === 'right' ? { right: '20px' } : 
                       { left: '50%', transform: 'translateX(-50%)' }),
                  }}
                >
                  {/* Botón del chat */}
                  <div 
                    className="transition-all duration-300 shadow-lg flex items-center justify-center animate-pulse"
                    style={{
                      backgroundColor: primaryColor,
                      borderRadius: buttonStyle === 'circle' ? '100%' : '8px',
                      width: buttonStyle === 'circle' ? '56px' : '120px',
                      height: '56px',
                      marginBottom: '10px',
                      marginLeft: 'auto',
                    }}
                  >
                    <MessageSquare className="h-6 w-6 text-white" />
                    {buttonStyle !== 'circle' && (
                      <span className="ml-2 text-white font-medium">Chat</span>
                    )}
                  </div>
                  
                  {/* Ventana del chat */}
                  <div 
                    className="transition-all duration-300 shadow-lg flex flex-col"
                    style={{
                      width: `${width}px`,
                      height: `${height}px`,
                      backgroundColor: backgroundColor,
                      borderRadius: `${borderRadius}px`,
                      border: '1px solid #e2e8f0',
                      maxWidth: '100%',
                      maxHeight: '70vh',
                    }}
                  >
                    {/* Cabecera del chat */}
                    <div 
                      className="p-4 border-b flex items-center"
                      style={{
                        backgroundColor: primaryColor,
                        borderTopLeftRadius: `${borderRadius}px`,
                        borderTopRightRadius: `${borderRadius}px`,
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-white font-medium">Asistente</div>
                        <div className="text-white/80 text-xs">En línea</div>
                      </div>
                    </div>
                    
                    {/* Cuerpo del chat */}
                    <div className="flex-1 p-4 overflow-y-auto chat-body">
                      <div className="space-y-4">
                        {chatMessages.map((message, index) => (
                          <div key={index} className={`flex items-start ${message.sender === 'user' ? 'justify-end' : ''}`}>
                            <div 
                              className={`max-w-[80%] rounded-lg p-3 text-sm ${
                                message.sender === 'user' 
                                  ? 'bg-primary text-white' 
                                  : `${primaryColor}20`
                              }`}
                              style={{
                                backgroundColor: message.sender === 'user' ? primaryColor : `${primaryColor}20`,
                                color: message.sender === 'user' ? 'white' : textColor,
                                borderRadius: `${borderRadius/2}px`,
                              }}
                            >
                              <p className="mb-3">{message.text}</p>
                              
                              {/* Gráfico simulado si es necesario */}
                              {message.chart && (
                                <div className="my-2 bg-white/70 rounded p-2 flex items-center justify-center">
                                  <div className="h-20 w-full flex items-end space-x-1">
                                    {[40, 65, 45, 80, 55, 70, 50, 60, 75].map((height, i) => (
                                      <div 
                                        key={i} 
                                        className="flex-1 rounded-t" 
                                        style={{
                                          height: `${height}%`,
                                          backgroundColor: primaryColor,
                                          opacity: 0.7 + (i * 0.03)
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Opciones si existen */}
                              {message.options && message.options.length > 0 && (
                                <div className={`${message.options[0].variant === 'secondary' ? 'flex flex-wrap gap-2' : 'space-y-2'} pt-2`}>
                                  {message.options.map((option, optionIndex) => (
                                    option.variant === 'secondary' ? (
                                      <Button 
                                        key={optionIndex}
                                        size="sm" 
                                        variant="secondary" 
                                        className="flex items-center text-xs"
                                        style={{
                                          backgroundColor: `${primaryColor}30`,
                                        }}
                                        onClick={() => handleOptionClick(option.id)}
                                      >
                                        {option.icon}
                                        <span>{option.text}</span>
                                      </Button>
                                    ) : option.variant === 'outline' ? (
                                      <Button 
                                        key={optionIndex}
                                        size="sm" 
                                        variant="outline" 
                                        className="flex items-center text-xs"
                                        style={{
                                          borderColor: `${primaryColor}40`,
                                        }}
                                        onClick={() => handleOptionClick(option.id)}
                                      >
                                        {option.icon}
                                        <span>{option.text}</span>
                                      </Button>
                                    ) : (
                                      <Button 
                                        key={optionIndex}
                                        size="sm" 
                                        variant="outline" 
                                        className="flex items-center justify-between w-full text-xs"
                                        style={{
                                          borderColor: `${primaryColor}40`,
                                          color: textColor,
                                        }}
                                        onClick={() => handleOptionClick(option.id)}
                                      >
                                        <div className="flex items-center">
                                          {option.icon}
                                          <span>{option.text}</span>
                                        </div>
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                      </Button>
                                    )
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Pie del chat */}
                    <div className="p-4 border-t">
                      <div className="flex items-center">
                        <Input 
                          placeholder="Escribe un mensaje..." 
                          className="rounded-full"
                          style={{
                            borderColor: `${primaryColor}40`,
                          }}
                        />
                        <Button 
                          size="icon" 
                          className="ml-2 rounded-full"
                          style={{
                            backgroundColor: primaryColor,
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Opciones de Configuración */}
        <div className="flex-1 order-1 xl:order-2">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="button">Botón</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
                <CardHeader>
                  <CardTitle>Configuración general</CardTitle>
                  <CardDescription>
                    Personaliza las características generales del chat
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="width">Ancho (px)</Label>
                        <div className="flex items-center space-x-2">
                          <Slider 
                            id="width" 
                            min={300} 
                            max={500} 
                            step={10}
                            value={[width]}
                            onValueChange={(value) => setWidth(value[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-center text-sm">{width}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Alto (px)</Label>
                        <div className="flex items-center space-x-2">
                          <Slider 
                            id="height" 
                            min={400} 
                            max={800} 
                            step={10}
                            value={[height]}
                            onValueChange={(value) => setHeight(value[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-center text-sm">{height}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="radius">Radio de borde</Label>
                      <div className="flex items-center space-x-2">
                        <Slider 
                          id="radius" 
                          min={0} 
                          max={24} 
                          step={2}
                          value={[borderRadius]}
                          onValueChange={(value) => setBorderRadius(value[0])}
                          className="flex-1"
                        />
                        <span className="w-12 text-center text-sm">{borderRadius}px</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="font">Tipo de fuente</Label>
                      <select 
                        id="font" 
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Montserrat">Montserrat</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Posición del chat</Label>
                      <RadioGroup 
                        defaultValue={chatPosition} 
                        onValueChange={setChatPosition}
                        className="grid grid-cols-3 gap-4"
                      >
                        <Label 
                          htmlFor="position-right" 
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${chatPosition === 'right' ? 'border-primary' : ''}`}
                        >
                          <RadioGroupItem value="right" id="position-right" className="sr-only" />
                          <div className="relative w-full h-16 border rounded">
                            <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-primary"></div>
                          </div>
                          <span className="mt-2 text-center block text-xs">Derecha</span>
                        </Label>
                        <Label 
                          htmlFor="position-center" 
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${chatPosition === 'center' ? 'border-primary' : ''}`}
                        >
                          <RadioGroupItem value="center" id="position-center" className="sr-only" />
                          <div className="relative w-full h-16 border rounded">
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                          </div>
                          <span className="mt-2 text-center block text-xs">Centro</span>
                        </Label>
                        <Label 
                          htmlFor="position-left" 
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${chatPosition === 'left' ? 'border-primary' : ''}`}
                        >
                          <RadioGroupItem value="left" id="position-left" className="sr-only" />
                          <div className="relative w-full h-16 border rounded">
                            <div className="absolute bottom-1 left-1 w-4 h-4 rounded-full bg-primary"></div>
                          </div>
                          <span className="mt-2 text-center block text-xs">Izquierda</span>
                        </Label>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="transition-all duration-300 hover:shadow-md animate-slide-up" style={{animationDelay: '0.1s'}}>
                <CardHeader>
                  <CardTitle>Colores</CardTitle>
                  <CardDescription>
                    Personaliza los colores del chat
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color" className="flex items-center">
                        <Circle className="h-4 w-4 mr-2 fill-primary stroke-none" />
                        Color primario
                      </Label>
                      <div className="flex">
                        <Input 
                          id="primary-color" 
                          type="color" 
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input 
                          type="text" 
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="background-color" className="flex items-center">
                        <Circle className="h-4 w-4 mr-2 fill-background stroke-[1px] stroke-border" />
                        Color de fondo
                      </Label>
                      <div className="flex">
                        <Input 
                          id="background-color" 
                          type="color" 
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input 
                          type="text" 
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="text-color" className="flex items-center">
                        <Type className="h-4 w-4 mr-2" />
                        Color de texto
                      </Label>
                      <div className="flex">
                        <Input 
                          id="text-color" 
                          type="color" 
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input 
                          type="text" 
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-sm font-medium mb-3">Temas preestablecidos</h3>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {['#0284c7', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#84cc16', '#14b8a6'].map((color) => (
                        <button
                          key={color}
                          className="w-full aspect-square rounded-md border p-1 cursor-pointer transition-all hover:scale-105"
                          style={{ backgroundColor: color }}
                          onClick={() => setPrimaryColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="chat" className="space-y-6">
              <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
                <CardHeader>
                  <CardTitle>Configuración del chat</CardTitle>
                  <CardDescription>
                    Personaliza la interfaz y funcionamiento del chat
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Accordion type="single" collapsible defaultValue="messages">
                    <AccordionItem value="messages">
                      <AccordionTrigger>Mensajes</AccordionTrigger>
                      <AccordionContent className="pt-4 pb-2">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium">Mensajes de bienvenida</h4>
                              <p className="text-sm text-muted-foreground">Mensaje inicial al abrir el chat</p>
                            </div>
                            <Switch id="welcome-message" defaultChecked />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="welcome-text">Texto de bienvenida</Label>
                            <Input id="welcome-text" defaultValue="Hola, ¿en qué puedo ayudarte hoy?" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="message-align">Alineación de mensajes del bot</Label>
                            <select id="message-align" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                              <option value="left">Izquierda</option>
                              <option value="right">Derecha</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium">Mostrar avatar</h4>
                              <p className="text-sm text-muted-foreground">Muestra avatar en mensajes</p>
                            </div>
                            <Switch id="show-avatar" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium">Indicador de escritura</h4>
                              <p className="text-sm text-muted-foreground">Mostrar cuando el bot escribe</p>
                            </div>
                            <Switch id="typing-indicator" defaultChecked />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="header">
                      <AccordionTrigger>Cabecera</AccordionTrigger>
                      <AccordionContent className="pt-4 pb-2">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium">Mostrar cabecera</h4>
                              <p className="text-sm text-muted-foreground">Cabecera con título y opciones</p>
                            </div>
                            <Switch id="show-header" defaultChecked />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="chat-title">Título del chat</Label>
                            <Input id="chat-title" defaultValue="Asistente" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="chat-subtitle">Subtítulo</Label>
                            <Input id="chat-subtitle" defaultValue="En línea" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium">Botón de minimizar</h4>
                              <p className="text-sm text-muted-foreground">Permite minimizar el chat</p>
                            </div>
                            <Switch id="show-minimize" defaultChecked />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="input">
                      <AccordionTrigger>Campo de entrada</AccordionTrigger>
                      <AccordionContent className="pt-4 pb-2">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="placeholder">Texto de placeholder</Label>
                            <Input id="placeholder" defaultValue="Escribe un mensaje..." />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium">Autocompletado</h4>
                              <p className="text-sm text-muted-foreground">Sugerencias mientras escribe</p>
                            </div>
                            <Switch id="autocomplete" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium">Envío con Enter</h4>
                              <p className="text-sm text-muted-foreground">Enviar mensaje con Enter</p>
                            </div>
                            <Switch id="enter-send" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium">Adjuntar archivos</h4>
                              <p className="text-sm text-muted-foreground">Permitir subir archivos</p>
                            </div>
                            <Switch id="file-upload" />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="button" className="space-y-6">
              <Card className="transition-all duration-300 hover:shadow-md animate-slide-up">
                <CardHeader>
                  <CardTitle>Botón del chat</CardTitle>
                  <CardDescription>
                    Personaliza el botón para abrir el chat
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Estilo del botón</Label>
                      <RadioGroup 
                        defaultValue={buttonStyle} 
                        onValueChange={setButtonStyle}
                        className="grid grid-cols-2 gap-4"
                      >
                        <Label 
                          htmlFor="button-circle" 
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${buttonStyle === 'circle' ? 'border-primary' : ''}`}
                        >
                          <RadioGroupItem value="circle" id="button-circle" className="sr-only" />
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-white" />
                          </div>
                          <span className="mt-2 text-center block text-xs">Circular</span>
                        </Label>
                        <Label 
                          htmlFor="button-pill" 
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${buttonStyle === 'pill' ? 'border-primary' : ''}`}
                        >
                          <RadioGroupItem value="pill" id="button-pill" className="sr-only" />
                          <div className="w-32 h-12 rounded-full bg-primary flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-white mr-2" />
                            <span className="text-white font-medium">Chat</span>
                          </div>
                          <span className="mt-2 text-center block text-xs">Con texto</span>
                        </Label>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Icono del botón</Label>
                      <RadioGroup 
                        defaultValue={buttonIcon} 
                        onValueChange={setButtonIcon}
                        className="grid grid-cols-4 gap-4"
                      >
                        <Label 
                          htmlFor="icon-chat" 
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${buttonIcon === 'chat' ? 'border-primary' : ''}`}
                        >
                          <RadioGroupItem value="chat" id="icon-chat" className="sr-only" />
                          <MessageSquare className="h-8 w-8" />
                        </Label>
                        <Label 
                          htmlFor="icon-message" 
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${buttonIcon === 'message' ? 'border-primary' : ''}`}
                        >
                          <RadioGroupItem value="message" id="icon-message" className="sr-only" />
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        </Label>
                        <Label 
                          htmlFor="icon-help" 
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${buttonIcon === 'help' ? 'border-primary' : ''}`}
                        >
                          <RadioGroupItem value="help" id="icon-help" className="sr-only" />
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                        </Label>
                        <Label 
                          htmlFor="icon-bot" 
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${buttonIcon === 'bot' ? 'border-primary' : ''}`}
                        >
                          <RadioGroupItem value="bot" id="icon-bot" className="sr-only" />
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8"><rect width="18" height="10" x="3" y="11" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" x2="8" y1="16" y2="16" /><line x1="16" x2="16" y1="16" y2="16" /></svg>
                        </Label>
                      </RadioGroup>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-1">
                        <h4 className="font-medium">Animación del botón</h4>
                        <p className="text-sm text-muted-foreground">Efecto pulsante en el botón</p>
                      </div>
                      <Switch id="button-animation" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">Mensaje de burbuja</h4>
                        <p className="text-sm text-muted-foreground">Pequeño mensaje sobre el botón</p>
                      </div>
                      <Switch id="button-bubble" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bubble-text">Texto de la burbuja</Label>
                      <Input id="bubble-text" defaultValue="¿Necesitas ayuda?" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={resetSettings} className="flex items-center">
              <RotateCcw className="mr-2 h-4 w-4" />
              Restablecer
            </Button>
            <Button onClick={saveSettings} className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
