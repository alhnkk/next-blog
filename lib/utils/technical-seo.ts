// Technical SEO utilities

// Mobile-first indexing kontrolü
export const checkMobileFirstIndexing = () => {
  const checks = {
    viewport: false,
    responsive: false,
    touchFriendly: false,
    mobileOptimized: false,
    fontSize: false,
    tapTargets: false,
  };

  const recommendations: string[] = [];

  // Viewport meta tag kontrolü
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta && viewportMeta.getAttribute('content')?.includes('width=device-width')) {
    checks.viewport = true;
  } else {
    recommendations.push('Viewport meta tag ekleyin: <meta name="viewport" content="width=device-width, initial-scale=1">');
  }

  // CSS media queries kontrolü (temel responsive kontrol)
  const hasMediaQueries = Array.from(document.styleSheets).some(sheet => {
    try {
      return Array.from(sheet.cssRules || []).some(rule => 
        rule.type === CSSRule.MEDIA_RULE
      );
    } catch {
      return false;
    }
  });

  if (hasMediaQueries) {
    checks.responsive = true;
  } else {
    recommendations.push('Responsive CSS media queries ekleyin');
  }

  // Touch-friendly meta kontrolü
  const msMobileFriendly = document.querySelector('meta[name="MobileOptimized"]');
  const handheldFriendly = document.querySelector('meta[name="HandheldFriendly"]');
  
  if (msMobileFriendly || handheldFriendly) {
    checks.touchFriendly = true;
  }

  // Font size kontrolü (minimum 16px)
  const bodyStyles = getComputedStyle(document.body);
  const fontSize = parseInt(bodyStyles.fontSize);
  if (fontSize >= 16) {
    checks.fontSize = true;
  } else {
    recommendations.push('Ana metin font boyutu en az 16px olmalıdır');
  }

  // Tap target size kontrolü (minimum 44px)
  const clickableElements = document.querySelectorAll('a, button, input[type="button"], input[type="submit"]');
  let tapTargetsOk = true;

  clickableElements.forEach(element => {
    const styles = getComputedStyle(element as Element);
    const height = parseInt(styles.height);
    const minHeight = parseInt(styles.minHeight);
    
    if (height < 44 && minHeight < 44) {
      tapTargetsOk = false;
    }
  });

  checks.tapTargets = tapTargetsOk;
  if (!tapTargetsOk) {
    recommendations.push('Tıklanabilir öğeler en az 44x44px boyutunda olmalıdır');
  }

  const score = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;

  return {
    score: Math.round((score / totalChecks) * 100),
    checks,
    recommendations,
    isOptimal: score >= totalChecks * 0.8 // %80 başarı oranı
  };
};

// HTTPS ve güvenlik kontrolü
export const checkHTTPSandSecurity = () => {
  const checks = {
    https: false,
    hsts: false,
    mixedContent: false,
    secureResources: false,
  };

  const recommendations: string[] = [];

  // HTTPS kontrolü
  if (window.location.protocol === 'https:') {
    checks.https = true;
  } else {
    recommendations.push('HTTPS kullanın (SSL sertifikası gerekli)');
  }

  // HSTS header kontrolü (JavaScript'ten direkt kontrol edilemez, meta tag ile simüle edelim)
  const hstsFeature = document.querySelector('meta[http-equiv="Strict-Transport-Security"]');
  if (hstsFeature) {
    checks.hsts = true;
  } else {
    recommendations.push('HSTS (HTTP Strict Transport Security) header ekleyin');
  }

  // Mixed content kontrolü
  const insecureResources = Array.from(document.querySelectorAll('img, script, link, iframe')).filter(element => {
    const src = element.getAttribute('src') || element.getAttribute('href');
    return src && src.startsWith('http://');
  });

  checks.mixedContent = insecureResources.length === 0;
  if (insecureResources.length > 0) {
    recommendations.push(`${insecureResources.length} adet güvensiz (HTTP) kaynak tespit edildi`);
  }

  // Güvenli kaynaklar kontrolü
  const externalResources = Array.from(document.querySelectorAll('script[src], link[href], img[src]')).filter(element => {
    const src = element.getAttribute('src') || element.getAttribute('href');
    return src && (src.startsWith('http://') || src.startsWith('https://')) && !src.includes(window.location.hostname);
  });

  const secureExternalResources = externalResources.filter(element => {
    const src = element.getAttribute('src') || element.getAttribute('href');
    return src && src.startsWith('https://');
  });

  checks.secureResources = externalResources.length === 0 || secureExternalResources.length === externalResources.length;
  
  if (!checks.secureResources) {
    recommendations.push('Tüm dış kaynaklar HTTPS üzerinden yüklenmelidir');
  }

  const score = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;

  return {
    score: Math.round((score / totalChecks) * 100),
    checks,
    recommendations,
    isOptimal: score >= totalChecks * 0.8
  };
};

// Sayfa performans kontrolü
export const checkPagePerformance = () => {
  const checks = {
    loadTime: false,
    firstContentfulPaint: false,
    largestContentfulPaint: false,
    cumulativeLayoutShift: false,
    firstInputDelay: false,
  };

  const recommendations: string[] = [];

  // Performance API kontrolü
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      // Sayfa yükleme süresi (3 saniye altı)
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      checks.loadTime = loadTime < 3000;
      if (!checks.loadTime) {
        recommendations.push(`Sayfa yükleme süresi ${Math.round(loadTime)}ms (3 saniyenin altında olmalı)`);
      }
    }

    // Core Web Vitals (eğer mevcut ise)
    if ('PerformanceObserver' in window) {
      try {
        // FCP kontrolü
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              checks.firstContentfulPaint = entry.startTime < 1800; // 1.8 saniye
              if (!checks.firstContentfulPaint) {
                recommendations.push('First Contentful Paint 1.8 saniyenin altında olmalı');
              }
            }
          }
        });
        observer.observe({entryTypes: ['paint']});
      } catch {
        // Performance Observer desteklenmiyor
      }
    }
  } else {
    recommendations.push('Performance API desteklenmiyor');
  }

  const score = Object.values(checks).filter(Boolean).length;
  const totalChecks = Object.keys(checks).length;

  return {
    score: Math.round((score / totalChecks) * 100),
    checks,
    recommendations,
    isOptimal: score >= totalChecks * 0.6 // Performance için %60 yeterli
  };
};

// Genel teknik SEO puanı
export const calculateTechnicalSEOScore = () => {
  const mobileCheck = checkMobileFirstIndexing();
  const securityCheck = checkHTTPSandSecurity();
  const performanceCheck = checkPagePerformance();

  const overallScore = Math.round(
    (mobileCheck.score + securityCheck.score + performanceCheck.score) / 3
  );

  const allRecommendations = [
    ...mobileCheck.recommendations,
    ...securityCheck.recommendations,
    ...performanceCheck.recommendations
  ];

  return {
    overallScore,
    mobile: mobileCheck,
    security: securityCheck,
    performance: performanceCheck,
    recommendations: allRecommendations,
    isOptimal: overallScore >= 80
  };
};

// Server-side kontrolü için Next.js middleware hook
export const checkServerSideRedirects = (req: Request) => {
  const url = new URL(req.url);
  const issues: string[] = [];

  // HTTP'den HTTPS'e yönlendirme kontrolü
  if (url.protocol === 'http:' && process.env.NODE_ENV === 'production') {
    issues.push('HTTP istekleri HTTPS\'e yönlendirilmelidir');
  }

  // Trailing slash kontrolü
  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    issues.push('Trailing slash tutarlılığı kontrol edilmelidir');
  }

  // WWW vs non-WWW kontrolü
  const hasWWW = url.hostname.startsWith('www.');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const preferredHasWWW = baseUrl.includes('www.');

  if (hasWWW !== preferredHasWWW) {
    issues.push('WWW vs non-WWW tercih tutarlılığı sağlanmalıdır');
  }

  return {
    hasIssues: issues.length > 0,
    issues
  };
};
