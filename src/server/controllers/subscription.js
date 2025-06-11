// server/controllers/subscriptionController.js
const User = require('../models/User');
const { handleError } = require('../utils/errorHandler');

/**
 * Obtener la suscripción del usuario actual
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findOne({ id: userId })
      .select('subscription')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json(user.subscription || null);
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Actualizar la suscripción del usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.updateSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptionData = req.body;
    
    // Validar los datos de la suscripción
    if (!subscriptionData || !subscriptionData.status || !subscriptionData.plan) {
      return res.status(400).json({ message: 'Datos de suscripción incompletos' });
    }
    
    // Actualizar la suscripción del usuario
    const user = await User.findOneAndUpdate(
      { id: userId },
      { 
        $set: { 
          subscription: subscriptionData,
          updated_at: new Date()
        } 
      },
      { new: true }
    ).select('subscription');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json(user.subscription);
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Cancelar la suscripción del usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findOne({ id: userId });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    if (!user.subscription || user.subscription.status !== 'active') {
      return res.status(400).json({ message: 'No hay una suscripción activa para cancelar' });
    }
    
    // Actualizar el estado de la suscripción a 'cancelled'
    user.subscription.status = 'cancelled';
    user.subscription.auto_renew = false;
    user.subscription.updated_at = new Date();
    
    await user.save();
    
    res.status(200).json({ 
      message: 'Suscripción cancelada correctamente',
      subscription: user.subscription
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Cambiar el plan de suscripción del usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.changePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan } = req.body;
    
    if (!plan) {
      return res.status(400).json({ message: 'Debe especificar un plan' });
    }
    
    // Validar que el plan sea válido
    const validPlans = ['basic', 'premium', 'enterprise'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ message: 'Plan no válido' });
    }
    
    const user = await User.findOne({ id: userId });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    if (!user.subscription || user.subscription.status !== 'active') {
      return res.status(400).json({ message: 'No hay una suscripción activa para modificar' });
    }
    
    // Actualizar el plan de la suscripción
    user.subscription.plan = plan;
    user.subscription.updated_at = new Date();
    
    // Actualizar las características según el plan seleccionado
    switch (plan) {
      case 'basic':
        user.subscription.features = [
          'Acceso a contenido básico',
          'Soporte por email',
          '5 proyectos simultáneos'
        ];
        break;
      case 'premium':
        user.subscription.features = [
          'Acceso a todo el contenido',
          'Soporte prioritario',
          'Proyectos ilimitados',
          'Funcionalidades avanzadas'
        ];
        break;
      case 'enterprise':
        user.subscription.features = [
          'Todo lo incluido en Premium',
          'Soporte personalizado 24/7',
          'API dedicada',
          'Panel de administración',
          'Personalización de funcionalidades'
        ];
        break;
    }
    
    await user.save();
    
    res.status(200).json({ 
      message: 'Plan actualizado correctamente',
      subscription: user.subscription
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Verificar si el usuario tiene una suscripción activa
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.checkSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findOne({ id: userId })
      .select('subscription')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const hasActiveSubscription = user.subscription && user.subscription.status === 'active';
    
    res.status(200).json({ 
      active: hasActiveSubscription,
      plan: hasActiveSubscription ? user.subscription.plan : null
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Obtener el historial de pagos del usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findOne({ id: userId })
      .select('subscription.payment_history')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const paymentHistory = user.subscription?.payment_history || [];
    
    res.status(200).json(paymentHistory);
  } catch (error) {
    handleError(error, res);
  }
};

// server/routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Todas las rutas de suscripción requieren autenticación
router.use(authenticateJWT);

// Rutas para manejar suscripciones
router.get('/', subscriptionController.getSubscription);
router.put('/', subscriptionController.updateSubscription);
router.post('/cancel', subscriptionController.cancelSubscription);
router.post('/change-plan', subscriptionController.changePlan);
router.get('/check', subscriptionController.checkSubscription);
router.get('/payment-history', subscriptionController.getPaymentHistory);

module.exports = router;

// server/middleware/subscriptionMiddleware.js
/**
 * Middleware para verificar si el usuario tiene una suscripción activa
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar con la cadena de middleware
 */
exports.requireActiveSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findOne({ id: userId })
      .select('subscription')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const hasActiveSubscription = user.subscription && user.subscription.status === 'active';
    
    if (!hasActiveSubscription) {
      return res.status(403).json({ 
        message: 'Se requiere una suscripción activa para acceder a este recurso',
        subscriptionRequired: true
      });
    }
    
    // Añadir información de la suscripción a la solicitud para uso posterior
    req.subscription = user.subscription;
    
    next();
  } catch (error) {
    console.error('Error en middleware de suscripción:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Middleware para verificar si el usuario tiene una suscripción con un plan específico
 * @param {string|string[]} plans - Plan o planes requeridos
 * @returns {Function} Middleware para verificar el plan de suscripción
 */
exports.requireSubscriptionPlan = (plans) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      const user = await User.findOne({ id: userId })
        .select('subscription')
        .lean();
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      const hasActiveSubscription = user.subscription && user.subscription.status === 'active';
      
      if (!hasActiveSubscription) {
        return res.status(403).json({ 
          message: 'Se requiere una suscripción activa para acceder a este recurso',
          subscriptionRequired: true
        });
      }
      
      // Convertir plans a array si es un string
      const requiredPlans = Array.isArray(plans) ? plans : [plans];
      
      if (!requiredPlans.includes(user.subscription.plan)) {
        return res.status(403).json({ 
          message: `Se requiere uno de los siguientes planes para acceder a este recurso: ${requiredPlans.join(', ')}`,
          upgradeRequired: true,
          currentPlan: user.subscription.plan,
          requiredPlans
        });
      }
      
      // Añadir información de la suscripción a la solicitud para uso posterior
      req.subscription = user.subscription;
      
      next();
    } catch (error) {
      console.error('Error en middleware de plan de suscripción:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
};

// Ejemplo de uso en una ruta que requiere un plan específico
// router.get('/premium-content', 
//   authenticateJWT, 
//   requireSubscriptionPlan(['premium', 'enterprise']), 
//   premiumController.getContent
// );