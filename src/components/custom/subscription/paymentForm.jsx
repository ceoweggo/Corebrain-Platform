import React, { useState } from 'react';

/**
 * Componente de formulario de pago para suscripciones
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSubmit - Función a ejecutar al enviar el formulario
 * @param {Function} props.onCancel - Función a ejecutar al cancelar
 * @param {boolean} props.isProcessing - Indica si se está procesando el pago
 * @param {string} props.planType - Tipo de plan seleccionado
 * @param {number} props.planPrice - Precio del plan seleccionado
 * @param {string} props.error - Mensaje de error
 * @param {string} props.success - Mensaje de éxito
 * @returns {JSX.Element} - Componente renderizado
 */
const PaymentForm = ({ onSubmit, onCancel, isProcessing, planType, planPrice, error, success }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  
  // Estado de validación
  const [errors, setErrors] = useState({});
  
  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Sanitización básica dependiendo del campo
    let sanitizedValue = value;
    
    if (name === 'cardNumber') {
      // Solo permitir números y formatear con espacios cada 4 dígitos
      sanitizedValue = value
        .replace(/[^\d]/g, '')
        .substring(0, 16)
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .trim();
    } else if (name === 'cvv') {
      // Solo permitir 3 o 4 dígitos para el CVV
      sanitizedValue = value.replace(/[^\d]/g, '').substring(0, 4);
    } else if (name === 'expiryMonth') {
      // Solo permitir números del 1 al 12
      sanitizedValue = value.replace(/[^\d]/g, '').substring(0, 2);
      if (parseInt(sanitizedValue, 10) > 12) sanitizedValue = '12';
    } else if (name === 'expiryYear') {
      // Solo permitir años válidos (actual + 20 años)
      sanitizedValue = value.replace(/[^\d]/g, '').substring(0, 4);
      const currentYear = new Date().getFullYear();
      if (parseInt(sanitizedValue, 10) < currentYear && sanitizedValue.length === 4) {
        sanitizedValue = currentYear.toString();
      }
    }
    
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });
    
    // Limpiar el error del campo si existe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    // Validar número de tarjeta
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 15) {
      newErrors.cardNumber = 'El número de tarjeta debe tener al menos 15 dígitos';
    }
    
    // Validar titular
    if (!formData.cardHolder || formData.cardHolder.length < 3) {
      newErrors.cardHolder = 'Ingresa el nombre del titular de la tarjeta';
    }
    
    // Validar mes de expiración
    if (!formData.expiryMonth) {
      newErrors.expiryMonth = 'Ingresa el mes de expiración';
    } else if (parseInt(formData.expiryMonth, 10) < 1 || parseInt(formData.expiryMonth, 10) > 12) {
      newErrors.expiryMonth = 'El mes debe estar entre 1 y 12';
    }
    
    // Validar año de expiración
    if (!formData.expiryYear) {
      newErrors.expiryYear = 'Ingresa el año de expiración';
    } else if (
      parseInt(formData.expiryYear, 10) < currentYear || 
      parseInt(formData.expiryYear, 10) > currentYear + 20
    ) {
      newErrors.expiryYear = 'El año no es válido';
    }
    
    // Validar si la tarjeta ya expiró
    if (
      parseInt(formData.expiryYear, 10) === currentYear && 
      parseInt(formData.expiryMonth, 10) < currentMonth
    ) {
      newErrors.expiryMonth = 'La tarjeta ha expirado';
    }
    
    // Validar CVV
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'El código de seguridad debe tener al menos 3 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Formatear la información de la tarjeta para enviarla
      const paymentDetails = {
        paymentMethod: 'credit_card',
        cardDetails: {
          last4: formData.cardNumber.slice(-4),
          brand: detectCardBrand(formData.cardNumber),
          expiryMonth: formData.expiryMonth,
          expiryYear: formData.expiryYear
        }
      };
      
      onSubmit(paymentDetails);
    }
  };
  
  // Función para detectar la marca de la tarjeta basada en los primeros dígitos
  const detectCardBrand = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6(?:011|5)/.test(number)) return 'discover';
    
    return 'unknown';
  };
  
  // Mostrar logo de tarjeta según detección
  const cardBrand = detectCardBrand(formData.cardNumber);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Mensajes de error y éxito */}
      {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-2 text-sm">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 px-3 py-2 rounded mb-2 text-sm">{success}</div>}
      {/* Resumen de la suscripción */}
      <div className="p-4 bg-gray-50 rounded-lg mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Plan:</span>
          <span className="font-medium text-gray-600">{planType.charAt(0).toUpperCase() + planType.slice(1)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Precio:</span>
          <span className="font-medium text-gray-600">{planPrice}€/mes</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="text-gray-800 font-medium">Total a pagar hoy:</span>
          <span className="font-bold text-gray-600">{planPrice}€</span>
        </div>
      </div>
      
      {/* Número de tarjeta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número de tarjeta
        </label>
        <div className="relative">
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            className={`block w-full px-4 py-2 border rounded-lg ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
            disabled={isProcessing}
          />
          
          {/* Mostrar logo de tarjeta */}
          {formData.cardNumber && (
            <div className="absolute right-3 top-2">
              {cardBrand === 'visa' && <span className="text-blue-600 font-bold">VISA</span>}
              {cardBrand === 'mastercard' && <span className="text-red-600 font-bold">MC</span>}
              {cardBrand === 'amex' && <span className="text-blue-800 font-bold">AMEX</span>}
              {cardBrand === 'discover' && <span className="text-orange-600 font-bold">DISC</span>}
            </div>
          )}
        </div>
        {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
      </div>
      
      {/* Titular de la tarjeta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titular de la tarjeta
        </label>
        <input
          type="text"
          name="cardHolder"
          value={formData.cardHolder}
          onChange={handleChange}
          placeholder="Nombre completo como aparece en la tarjeta"
          className={`block w-full px-4 py-2 border rounded-lg ${
            errors.cardHolder ? 'border-red-500' : 'border-gray-300'
          } focus:ring-blue-500 focus:border-blue-500`}
          disabled={isProcessing}
        />
        {errors.cardHolder && <p className="mt-1 text-sm text-red-600">{errors.cardHolder}</p>}
      </div>
      
      {/* Fecha de expiración y CVV */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mes
          </label>
          <input
            type="text"
            name="expiryMonth"
            value={formData.expiryMonth}
            onChange={handleChange}
            placeholder="MM"
            className={`block w-full px-4 py-2 border rounded-lg ${
              errors.expiryMonth ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
            disabled={isProcessing}
          />
          {errors.expiryMonth && <p className="mt-1 text-sm text-red-600">{errors.expiryMonth}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año
          </label>
          <input
            type="text"
            name="expiryYear"
            value={formData.expiryYear}
            onChange={handleChange}
            placeholder="AAAA"
            className={`block w-full px-4 py-2 border rounded-lg ${
              errors.expiryYear ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
            disabled={isProcessing}
          />
          {errors.expiryYear && <p className="mt-1 text-sm text-red-600">{errors.expiryYear}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVV
          </label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            className={`block w-full px-4 py-2 border rounded-lg ${
              errors.cvv ? 'border-red-500' : 'border-gray-300'
            } focus:ring-blue-500 focus:border-blue-500`}
            disabled={isProcessing}
          />
          {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800 underline"
          disabled={isProcessing}
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          className={`px-6 py-2 rounded-lg font-medium
            ${isProcessing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </div>
          ) : (
            'Completar pago'
          )}
        </button>
      </div>
      
      {/* Información de seguridad */}
      <div className="text-xs text-gray-500 mt-4">
        <p>
          Tu información de pago está segura. Utilizamos encriptación de 256-bit para proteger tus datos.
          No almacenamos los datos completos de tu tarjeta en nuestros servidores.
        </p>
      </div>
    </form>
  );
};

export default PaymentForm;