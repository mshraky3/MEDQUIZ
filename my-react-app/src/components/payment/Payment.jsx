import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLang from '../../hooks/useLang';
import PayButton from './PayButton';
import './payment.css';

const Payment = () => {
  const lang = useLang();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('special');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'special',
      name: isArabic ? 'اشتراك سنوي - خطة خاصة' : 'ANNUAL Subscription - Special Offer',
      price: isArabic ? '٥٠ ريال' : '50 SAR',
      originalPrice: isArabic ? '٢٥٠ ريال' : '250 SAR',
      period: isArabic ? 'لمدة سنة كاملة' : 'FOR 1 FULL YEAR',
      features: [
        isArabic ? 'الوصول إلى جميع الأسئلة' : 'Access to all questions',
        isArabic ? 'تحليلات مفصلة' : 'Detailed analytics',
        isArabic ? 'تتبع التقدم' : 'Progress tracking',
        isArabic ? 'دعم فني' : 'Technical support',
        isArabic ? 'توفير ٨٠٪' : 'Save 80%',
        isArabic ? 'عرض محدود' : 'Limited Time Offer',
        isArabic ? 'اشتراك لمدة سنة كاملة' : 'FULL YEAR ACCESS',
        isArabic ? 'ليس شهرياً - سنة كاملة' : 'NOT MONTHLY - FULL YEAR'
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

  return (
    <div className="payment-page">
      <div className="payment-header">
        <button onClick={handleBackToHome} className="back-button">
          {isArabic ? '← العودة' : '← Back'}
        </button>
        <h1>{isArabic ? 'اشتراك سنوي - سنة كاملة' : 'Annual Subscription - Full Year'}</h1>
        <p className="payment-subtitle">
          {isArabic 
            ? 'احصل على الوصول الكامل إلى أكثر من 8000 سؤال مع تحليلات مفصلة' 
            : 'Get full access to 8000+ questions with detailed analytics'
          }
        </p>
      </div>

      <div className="single-plan-container">
        <div className="plan-highlight">
          <div className="popular-badge">
            {isArabic ? ' عرض محدود ' : ' Limited Offer '}
          </div>
          
          <div className="plan-pricing">
            <div className="price-display">
              <span className="current-price">50 SAR</span>
              <span className="original-price">250 SAR</span>
            </div>
            <div className="savings-badge">
              {isArabic ? 'توفير 80%' : 'Save 80%'}
            </div>
            <div className="period-text">
              {isArabic ? 'لمدة سنة كاملة' : 'FOR 1 FULL YEAR'}
            </div>
          </div>

          <div className="plan-features">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>{isArabic ? 'الوصول إلى جميع الأسئلة' : 'Access to all questions'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>{isArabic ? 'تحليلات مفصلة' : 'Detailed analytics'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>{isArabic ? 'تتبع التقدم' : 'Progress tracking'}</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>{isArabic ? 'دعم فني' : 'Technical support'}</span>
            </div>
          </div>

          <div className="payment-actions">
            <PayButton 
              amount={50} 
              description={isArabic ? 'اشتراك سنوي - سنة كاملة' : 'Full Year'}
            />
            
            <button onClick={handleContactUs} className="contact-button">
              {isArabic ? 'تواصل معنا' : 'Contact Us'}
            </button>
          </div>
        </div>
      </div>

      <div className="payment-features">
        <h3>{isArabic ? 'ماذا تحصل عليه:' : 'What You Get:'}</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h4>{isArabic ? '8000+ سؤال' : '8000+ Questions'}</h4>
            <p>{isArabic ? 'بنك أسئلة شامل لاختبار البرومترك' : 'Comprehensive question bank for Prometric exam'}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h4>{isArabic ? 'تحليلات مفصلة' : 'Detailed Analytics'}</h4>
            <p>{isArabic ? 'تتبع أدائك وتحديد نقاط الضعف' : 'Track your performance and identify weak areas'}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h4>{isArabic ? 'تدريب مستهدف' : 'Targeted Practice'}</h4>
            <p>{isArabic ? 'ركز على المواضيع التي تحتاج تحسين' : 'Focus on topics that need improvement'}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h4>{isArabic ? 'متوفر على جميع الأجهزة' : 'Available on All Devices'}</h4>
            <p>{isArabic ? 'ادرس من أي مكان وفي أي وقت' : 'Study anywhere, anytime'}</p>
          </div>
        </div>
      </div>

      <div className="payment-guarantee">
        <div className="guarantee-content">
          <div className="guarantee-icon">🛡️</div>
          <div className="guarantee-text">
            <h4>{isArabic ? 'ضمان استرداد الأموال' : 'Money-Back Guarantee'}</h4>
            <p>{isArabic ? 'إذا لم تكن راضياً، سنعيد لك أموالك خلال 30 يوماً' : 'If you\'re not satisfied, we\'ll refund your money within 30 days'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
