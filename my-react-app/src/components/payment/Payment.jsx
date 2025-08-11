import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLang from '../../hooks/useLang';
import './payment.css';

const Payment = () => {
  const lang = useLang();
  const isArabic = lang === 'ar';
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'monthly',
      name: isArabic ? 'اشتراك شهري' : 'Monthly Plan',
      price: isArabic ? '٥٠ ريال' : '50 SAR',
      originalPrice: isArabic ? '١٠٠ ريال' : '100 SAR',
      period: isArabic ? 'شهرياً' : 'per month',
      features: [
        isArabic ? 'الوصول إلى جميع الأسئلة' : 'Access to all questions',
        isArabic ? 'تحليلات مفصلة' : 'Detailed analytics',
        isArabic ? 'تتبع التقدم' : 'Progress tracking',
        isArabic ? 'دعم فني' : 'Technical support'
      ],
      popular: false
    },
    {
      id: 'annual',
      name: isArabic ? 'اشتراك سنوي' : 'Annual Plan',
      price: isArabic ? '٢٥٠ ريال' : '250 SAR',
      originalPrice: isArabic ? '٦٠٠ ريال' : '600 SAR',
      period: isArabic ? 'سنوياً' : 'per year',
      features: [
        isArabic ? 'الوصول إلى جميع الأسئلة' : 'Access to all questions',
        isArabic ? 'تحليلات مفصلة' : 'Detailed analytics',
        isArabic ? 'تتبع التقدم' : 'Progress tracking',
        isArabic ? 'دعم فني' : 'Technical support',
        isArabic ? 'توفير ٥٨٪' : 'Save 58%',
        isArabic ? 'الأكثر شعبية' : 'Most Popular'
      ],
      popular: true
    },
    {
      id: 'lifetime',
      name: isArabic ? 'اشتراك مدى الحياة' : 'Lifetime Access',
      price: isArabic ? '٥٠٠ ريال' : '500 SAR',
      originalPrice: isArabic ? '١٢٠٠ ريال' : '1200 SAR',
      period: isArabic ? 'مدى الحياة' : 'Lifetime',
      features: [
        isArabic ? 'الوصول إلى جميع الأسئلة' : 'Access to all questions',
        isArabic ? 'تحليلات مفصلة' : 'Detailed analytics',
        isArabic ? 'تتبع التقدم' : 'Progress tracking',
        isArabic ? 'دعم فني' : 'Technical support',
        isArabic ? 'تحديثات مجانية' : 'Free updates',
        isArabic ? 'أفضل قيمة' : 'Best Value'
      ],
      popular: false
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Here you would integrate with Stripe
      alert(isArabic ? 'سيتم إضافة Stripe قريباً' : 'Stripe integration coming soon');
    }, 2000);
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
        <h1>{isArabic ? 'اختر خطة الاشتراك' : 'Choose Your Subscription Plan'}</h1>
        <p className="payment-subtitle">
          {isArabic 
            ? 'احصل على الوصول الكامل إلى أكثر من 5000 سؤال مع تحليلات مفصلة' 
            : 'Get full access to 5000+ questions with detailed analytics'
          }
        </p>
      </div>

      <div className="payment-plans">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            {plan.popular && (
              <div className="popular-badge">
                {isArabic ? 'الأكثر شعبية' : 'Most Popular'}
              </div>
            )}
            
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <div className="plan-price">
                <span className="current-price">{plan.price}</span>
                <span className="original-price">{plan.originalPrice}</span>
                <span className="period">{plan.period}</span>
              </div>
            </div>

            <div className="plan-features">
              {plan.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="plan-savings">
              {plan.id === 'annual' && (
                <div className="savings-badge">
                  {isArabic ? 'توفير ٥٨٪' : 'Save 58%'}
                </div>
              )}
              {plan.id === 'lifetime' && (
                <div className="savings-badge">
                  {isArabic ? 'توفير ٥٨٪' : 'Save 58%'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="payment-actions">
        <button 
          onClick={handlePayment}
          className={`payment-button ${isProcessing ? 'processing' : ''}`}
          disabled={isProcessing}
        >
          {isProcessing 
            ? (isArabic ? 'جاري المعالجة...' : 'Processing...') 
            : (isArabic ? 'اشترك الآن' : 'Subscribe Now')
          }
        </button>
        
        <button onClick={handleContactUs} className="contact-button">
          {isArabic ? 'تواصل معنا' : 'Contact Us'}
        </button>
      </div>

      <div className="payment-features">
        <h3>{isArabic ? 'ماذا تحصل عليه:' : 'What You Get:'}</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h4>{isArabic ? '5000+ سؤال' : '5000+ Questions'}</h4>
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
