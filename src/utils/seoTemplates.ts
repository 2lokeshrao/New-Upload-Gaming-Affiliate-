export const getGeoContext = (countryCode: string) => {
  const code = (countryCode || '').toUpperCase();
  switch (code) {
    case 'IN': return { country: 'India', payment: 'UPI & Paytm' };
    case 'BR': return { country: 'Brazil', payment: 'Pix' };
    case 'BD': return { country: 'Bangladesh', payment: 'bKash & Nagad' };
    case 'PK': return { country: 'Pakistan', payment: 'EasyPaisa & JazzCash' };
    case 'UZ': return { country: 'Uzbekistan', payment: 'Uzcard & Humo' };
    case 'AZ': return { country: 'Azerbaijan', payment: 'm10 & Bank Cards' };
    case 'MX': return { country: 'Mexico', payment: 'OXXO & SPEI' };
    case 'PE': return { country: 'Peru', payment: 'PagoEfectivo' };
    case 'CL': return { country: 'Chile', payment: 'Webpay' };
    case 'CO': return { country: 'Colombia', payment: 'PSE' };
    case 'CA': return { country: 'Canada', payment: 'Interac e-Transfer' };
    default: return { country: 'Global', payment: 'Crypto (USDT/BTC) & E-Wallets' };
  }
};

export const getSeoTemplates = (
  language: string,
  data: { brand: string; promoCode: string; country: string; payment: string; bonus: string }
) => {
  const { brand, promoCode, country, payment, bonus } = data;

  const templates: Record<string, any> = {
    en: {
      promoTitle: `${brand} Promo Code 2026: Claim ${bonus} Welcome Bonus in ${country}`,
      promoContent: `Looking for the best <strong>${brand} promo code today</strong>? Use our official and verified code <strong>${promoCode}</strong> to unlock a guaranteed <strong>${bonus} welcome bonus</strong> upon your first deposit. Whether you are using the mobile app or the desktop site, this exclusive promo code ensures you start with the highest possible balance. Registering is instant, and the bonus is credited immediately to your account.`,
      paymentTitle: `${brand} Minimum Deposit via ${payment} in ${country}: Complete Guide`,
      paymentContent: `Wondering how to deposit and withdraw money from ${brand} in ${country}? The most popular and secure method for local players is <strong>${payment}</strong>. The minimum deposit is extremely low, allowing you to start playing instantly. To deposit, navigate to the cashier section, select ${payment}, enter the amount, and confirm the transaction. Withdrawals are processed 24/7 and typically arrive in your account within 15 minutes!`,
      legalTitle: `Is ${brand} Legal and Safe in ${country}? Safety & Withdrawal Review`,
      legalContent: `Before playing, many users ask: <em>is ${brand} safe and legal in ${country}?</em> Yes, ${brand} operates under a verified international gaming license (e.g., Curacao/MGA), ensuring fair play and guaranteed payouts. The platform utilizes advanced SSL encryption to protect your financial data during <strong>${payment}</strong> transactions. Our team has independently verified their fast withdrawal speeds and excellent 24/7 customer support.`
    },
    pt: {
      promoTitle: `Código Promocional ${brand} 2026: Resgate ${bonus} no ${country}`,
      promoContent: `Procurando o melhor <strong>código bônus ${brand} hoje</strong>? Use nosso código oficial e verificado <strong>${promoCode}</strong> para desbloquear um bônus de boas-vindas garantido de <strong>${bonus}</strong> no seu primeiro depósito. Seja pelo aplicativo ou site, este código promocional exclusivo garante o maior saldo possível. O registro é rápido e o bônus é creditado instantaneamente!`,
      paymentTitle: `Como fazer depósito e saque na ${brand} via ${payment} (Guia 2026)`,
      paymentContent: `Quer saber como depositar e sacar dinheiro na ${brand} no ${country}? O método mais popular e seguro é o <strong>${payment}</strong>. O depósito mínimo é muito baixo. Para depositar, vá até a seção de caixa, selecione ${payment}, insira o valor e confirme a transação. Os saques via ${payment} são processados 24/7 e geralmente chegam em até 15 minutos!`,
      legalTitle: `A ${brand} é legal e confiável no ${country}? Análise de Segurança`,
      legalContent: `Muitos usuários perguntam: <em>a ${brand} é segura e legal no ${country}?</em> Sim, a ${brand} opera sob uma licença internacional verificada de jogos, garantindo pagamentos justos. A plataforma utiliza criptografia SSL avançada para proteger seus dados financeiros durante as transações via <strong>${payment}</strong>. Nossa equipe verificou independentemente a velocidade dos saques e o excelente suporte ao cliente.`
    },
    es: {
      promoTitle: `Código Promocional ${brand} 2026: Reclama tu Bono de ${bonus} en ${country}`,
      promoContent: `¿Buscas el mejor <strong>código promocional de ${brand}</strong>? Usa nuestro código oficial <strong>${promoCode}</strong> para desbloquear un bono de bienvenida de <strong>${bonus}</strong> en tu primer depósito. Regístrate de forma rápida y el bono se acreditará al instante en tu cuenta.`,
      paymentTitle: `Depósito mínimo en ${brand} con ${payment} en ${country}: Guía completa`,
      paymentContent: `¿Te preguntas cómo depositar y retirar dinero en ${brand}? El método más popular y seguro para los jugadores en ${country} es <strong>${payment}</strong>. Los depósitos son instantáneos y los retiros se procesan rápidamente en menos de 15 minutos.`,
      legalTitle: `¿Es ${brand} legal y seguro en ${country}? Reseña de Seguridad`,
      legalContent: `Antes de jugar, muchos usuarios se preguntan: <em>¿es ${brand} seguro en ${country}?</em> Sí, ${brand} opera bajo una licencia internacional verificada, asegurando juego limpio y pagos garantizados con tecnología de encriptación SSL.`
    },
    hi: {
      promoTitle: `${brand} Promo Code 2026: ${country} में ${bonus} वेलकम बोनस पाएं`,
      promoContent: `क्या आप <strong>${brand} promo code today</strong> खोज रहे हैं? हमारा आधिकारिक कोड <strong>${promoCode}</strong> इस्तेमाल करें और अपने पहले डिपॉजिट पर <strong>${bonus} वेलकम बोनस</strong> पाएं। अकाउंट बनाना बहुत आसान है और बोनस तुरंत क्रेडिट हो जाता है।`,
      paymentTitle: `${country} में ${payment} से ${brand} पर डिपॉजिट और विथड्रॉल कैसे करें`,
      paymentContent: `${brand} पर डिपॉजिट और विथड्रॉल करना बहुत आसान है। ${country} में सबसे लोकप्रिय तरीका <strong>${payment}</strong> है। कैशियर सेक्शन में जाएं, ${payment} चुनें और तुरंत अपना डिपॉजिट पूरा करें। विथड्रॉल 15 मिनट के अंदर प्रोसेस हो जाते हैं!`,
      legalTitle: `क्या ${country} में ${brand} लीगल और सुरक्षित है? सेफ्टी रिव्यू`,
      legalContent: `खेलने से पहले बहुत से लोग पूछते हैं: <em>क्या ${brand} ${country} में सुरक्षित है?</em> हाँ, ${brand} पूरी तरह से सुरक्षित है और इंटरनेशनल लाइसेंस के साथ काम करता है। आपके <strong>${payment}</strong> लेन-देन SSL एन्क्रिप्शन द्वारा पूरी तरह सुरक्षित हैं।`
    },
    ru: {
      promoTitle: `Промокод ${brand} 2026: Получите бонус ${bonus} в ${country}`,
      promoContent: `Ищете лучший <strong>промокод ${brand} на сегодня</strong>? Используйте наш официальный код <strong>${promoCode}</strong>, чтобы получить гарантированный <strong>бонус ${bonus}</strong> на первый депозит. Регистрация занимает всего минуту.`,
      paymentTitle: `Как пополнить счет и вывести деньги с ${brand} через ${payment}`,
      paymentContent: `Интересуетесь, как пополнить счет в ${brand} в ${country}? Самый популярный метод — <strong>${payment}</strong>. Минимальный депозит очень низкий, а вывод средств занимает не более 15 минут.`,
      legalTitle: `Законен ли и безопасен ${brand} в ${country}? Обзор безопасности`,
      legalContent: `Многие пользователи спрашивают, безопасен ли ${brand} в ${country}? Да, ${brand} работает по официальной международной лицензии, гарантируя честную игру и быстрые выплаты через <strong>${payment}</strong>.`
    }
  };

  return templates[language] || templates['en'];
};
