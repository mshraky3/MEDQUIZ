import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLang from '../../hooks/useLang';
import CreditCardForm from './CreditCardForm';
import Globals from '../../global.js';
import './payment.css';

const Payment = () => {
  const lang = useLang();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('special');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-show instructions modal after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructionsModal(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const plans = [
    {
      id: 'special',
      name: 'اشتراك سنوي - خطة خاصة',
      price: '٧٥ ريال',
      originalPrice: '٢٥٠ ريال',
      period: 'لمدة سنة كاملة - عرض خاص لليوم الوطني',
      features: [
        'الوصول إلى جميع الأسئلة',
        'تحليلات مفصلة',
        'تتبع التقدم',
        'دعم فني',
        'توفير ٧٠٪ - اليوم الوطني',
        'عرض محدود',
        'اشتراك لمدة سنة كاملة',
        'ليس شهرياً - سنة كاملة'
      ],
      popular: true
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handlePayment = async () => {
    // Redirect to waiting page after payment initiation
    navigate('/waiting-for-payment');
  };

  const handleContactUs = () => {
    window.open('https://wa.link/pzhg6j', '_blank');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const closeInstructionsModal = () => {
    setShowInstructionsModal(false);
  };

  return (
    <div className="payment-page">
      <div className="payment-header">

        <h1>اشتراك سنوي - سنة كاملة</h1>
        <p className="payment-subtitle">
          احصل على الوصول الكامل إلى أكثر من 8000 سؤال مع تحليلات مفصلة
        </p>
      </div>

      <div className="single-plan-container">
        <div className="plan-highlight">
          <div className="popular-badge">
            🎉 عرض اليوم الوطني 🎉
          </div>
          
          <div className="plan-pricing">
            <div className="price-display">
              <span className="current-price">٧٥ ريال</span>
              <span className="original-price">٢٥٠ ريال</span>
            </div>
            <div className="savings-badge">
              توفير ٧٠٪ - اليوم الوطني
            </div>
            <div className="period-text">
              لمدة سنة كاملة - عرض خاص لليوم الوطني
            </div>
          </div>

          <div className="plan-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>الوصول إلى جميع الأسئلة</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>تحليلات مفصلة</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>تتبع التقدم</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>دعم فني</span>
            </div>
          </div>

          {/* Instructions Button */}
          <div className="instructions-button-container">
            <button 
              onClick={() => setShowInstructionsModal(true)} 
              className="instructions-button"
            >
              <span className="instructions-icon">📍</span>
              تعليمات مهمة للدفع
            </button>
          </div>

          <div className="payment-actions">
            <CreditCardForm 
              amount={19.1} 
              description="اشتراك سنوي - سنة كاملة"
              onSuccess={async (details) => {
                console.log('Payment successful:', details);
                // Generate a unique user ID for the paid user
                const userId = `paid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                try {
                  // Create user record in database with 'paid' status
                  const response = await fetch(`${Globals.URL}/api/payment/create-user`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userId: userId,
                      paymentDetails: details
                    })
                  });

                  if (response.ok) {
                    // Store userId in localStorage for signup page
                    localStorage.setItem('paidUserId', userId);
                    
                    // Redirect to signup page with payment confirmation
                    navigate('/signup', { 
                      state: { 
                        paymentConfirmed: true,
                        userId: userId,
                        paymentDetails: details,
                        amount: 19.1,
                        currency: 'USD'
                      } 
                    });
                  } else {
                    throw new Error('Failed to create user record');
                  }
                } catch (error) {
                  console.error('Error creating user record:', error);
                  // Still redirect to signup but show error
                  localStorage.setItem('paidUserId', userId);
                  navigate('/signup', { 
                    state: { 
                      paymentConfirmed: true,
                      userId: userId,
                      paymentDetails: details,
                        amount: 19.1,
                        currency: 'USD',
                      error: 'Payment successful but account setup failed. Please contact support.'
                    } 
                  });
                }
              }}
              onError={(error) => {
                console.error('Payment error:', error);
                // Handle error (show message, etc.)
              }}
            />
            
            <button onClick={handleContactUs} className="contact-button">
              تواصل معنا
            </button>
          </div>
        </div>
      </div>

      <div className="payment-features">
        <h3>ماذا نقدم لك ؟ </h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h4>٨٠٠٠+ سؤال</h4>
            <p>بنك أسئلة شامل لاختبار البرومترك</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h4>تحليلات مفصلة</h4>
            <p>تتبع أدائك وتحديد نقاط الضعف</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h4>تدريب مستهدف</h4>
            <p>ركز على المواضيع التي تحتاج تحسين</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h4>متوفر على جميع الأجهزة</h4>
            <p>ادرس من أي مكان وفي أي وقت</p>
          </div>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructionsModal && (
        <div className="modal-overlay" onClick={closeInstructionsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>تعليمات مهمة للدفع</h3>
              <button className="modal-close" onClick={closeInstructionsModal}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="instructions-content">
                <p className="modal-warning">
                  ⚠️ يرجى تغيير الدولة في نموذج الفواتير إلى "السعودية" قبل إتمام الدفع
                </p>
                
                <div className="instruction-steps">
                  <div className="step">
                    <span className="step-number">1</span>
                    <div className="step-content">
                      <span>اضغط على الزر الأسود "بطاقة ائتمان" وليس بايبال</span>
                      <div className="step-image">
                        <img src="/src/components/payment/imgs/blackButton.png" alt="الزر الأسود للبطاقة الائتمانية" className="instruction-img" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="step">
                    <span className="step-number">2</span>
                    <div className="step-content">
                      <span>اختر "السعودية" من قائمة الدولة</span>
                      <div className="step-image">
                        <img src="/src/components/payment/imgs/changeToKSA.png" alt="تغيير الدولة إلى السعودية" className="instruction-img" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="step">
                    <span className="step-number">3</span>
                    <span>أدخل باقي البيانات </span>
                  </div>
                  
                  <div className="step">
                    <span className="step-number">4</span>
                    <span>أكمل عملية الدفع</span>
                  </div>
                  
                  <div className="step">
                    <span className="step-number">5</span>
                    <span>تواصل مع الدعم الفني إذا احتجت مساعدة</span>
                  </div>
                  
                  <div className="step">
                    <span className="step-number">6</span>
                    <span>نرحب بك ونتمنى لك تجربة ممتعة</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button onClick={closeInstructionsModal} className="modal-ok-button">
                فهمت، شكراً
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Payment;
