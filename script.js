document.addEventListener('DOMContentLoaded', () => {
    
    // ======================================
    // 1. نظام التبديل بين الوضع الداكن والنهاري (Theme Toggle)
    // ======================================

    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle'); 
    const storedTheme = localStorage.getItem('theme');
    
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            }
        } else {
            body.classList.remove('dark-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        }
    };

    if (storedTheme) {
        applyTheme(storedTheme);
    } else {
        applyTheme('light'); 
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ======================================
    // 2. نظام الترجمة متعدد اللغات (Language Switcher)
    // ======================================
    
    const langButtons = document.querySelectorAll('.lang-btn');
    const defaultLang = 'fr';
    const cashFlowChartContext = document.getElementById('cashFlowChart'); 

    const applyTranslation = (lang) => {
        
        const html = document.documentElement;
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        html.setAttribute('lang', lang);

        document.querySelectorAll('[data-fr], [data-ar], [data-en]').forEach(element => {
            let finalTranslation = element.getAttribute(`data-${lang}`);

            if (!finalTranslation) {
                finalTranslation = element.getAttribute('data-fr');
            }

            if (!finalTranslation) {
                 finalTranslation = element.textContent;
            }
            
            // 🔥🔥🔥 الإصلاح الحاسم لاقتطاع النص (الباك سلاش) 🔥🔥🔥
            // يقوم بتحويل الرمز العكسي (\) إلى فاصلة علوية (')
            if (finalTranslation && lang !== 'ar') { 
                finalTranslation = finalTranslation.replace(/\\/g, "'"); 
            }
            // -----------------------------------------------------------------

            if (element.tagName === 'TITLE') {
                 if (finalTranslation) {
                    element.textContent = finalTranslation;
                }
            } else if (finalTranslation) {
                element.textContent = finalTranslation;
            }
        });
        
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
        
        localStorage.setItem('language', lang);
        body.setAttribute('data-current-lang', lang); 

        // إعادة تشغيل التوقع بعد تغيير اللغة
        if (cashFlowChartContext && typeof updateChart !== 'undefined') {
            const initialHistoricalData = [50000, 65000, 48000, 72000, 81000, 90000];
            const initialForecastData = performForecast(initialHistoricalData);
            updateChart(initialHistoricalData, initialForecastData);
        }

    };

    const savedLang = localStorage.getItem('language') || defaultLang;
    applyTranslation(savedLang);

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            applyTranslation(lang);
        });
    });

    // ======================================
    // 3. تفعيل أشرطة المهارات (Skill Bar Animation)
    // ======================================
    const skillBars = document.querySelectorAll('.progress-fill');
    const skillsSection = document.querySelector('.skills-section'); 

    const activateSkillBars = () => {
        skillBars.forEach(bar => {
            const level = bar.parentElement.getAttribute('data-level'); 
            if (level) {
                bar.style.width = level + '%';
            }
        });
    };

    if (skillsSection && skillBars.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activateSkillBars();
                    observer.unobserve(entry.target); 
                }
            });
        }, observerOptions);

        observer.observe(skillsSection);

    } else if (skillBars.length > 0) {
        activateSkillBars(); 
    }

    // ======================================
    // 4. نظام تصفية المشاريع (Portfolio Filtering)
    // ======================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const filterValue = e.target.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block'; 
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // =======================================================
    // 5. حماية الملكية الفكرية ومنع النسخ (IP Protection)
    // =======================================================
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault(); 
        console.log("Protected Content: Intellectual Property of Analytica Pro.");
    });

    document.addEventListener('copy', function(e) {
        e.preventDefault();
        const customMessage = 'هذا المحتوى محمي بحقوق النشر. Analytica Pro. لا يمكن نسخ المحتوى.';
        e.clipboardData.setData('text/plain', customMessage);
    });
    
    
    // =======================================================
    // 6. منطق التوقع للسيولة النقدية (Cashflow Forecasting)
    // =======================================================

    const cashflowForm = document.getElementById('cashflow-form');
    const forecastResult = document.getElementById('forecast-result');
    let cashFlowChart = null; 

    // دالة لجلب النصوص المناسبة للمبيان حسب اللغة
    const getChartTexts = (lang) => {
        const labels = {
            ar: ['الشهر -5', 'الشهر -4', 'الشهر -3', 'الشهر -2', 'الشهر -1', 'الشهر الحالي', 'الشهر +1', 'الشهر +2', 'الشهر +3', 'الشهر +4', 'الشهر +5', 'الشهر +6'],
            fr: ['Mois -5', 'Mois -4', 'Mois -3', 'Mois -2', 'Mois -1', 'Mois Actuel', 'Mois +1', 'Mois +2', 'Mois +3', 'Mois +4', 'Mois +5', 'Mois +6'],
            en: ['Month -5', 'Month -4', 'Month -3', 'Month -2', 'Month -1', 'Current Month', 'Month +1', 'Month +2', 'Month +3', 'Month +4', 'Month +5', 'Month +6'],
        };
        const chartLabel = {
            ar: 'صافي الإيرادات',
            fr: 'Revenu Net',
            en: 'Net Revenue'
        };
        const chartTitle = {
            ar: 'التوقع المالي', 
            fr: 'Prévision Financière', 
            en: 'Financial Forecast'
        };

        return {
            labels: labels[lang] || labels.fr,
            chartLabel: chartLabel[lang] || chartLabel.fr,
            chartTitle: chartTitle[lang] || chartTitle.fr
        };
    };


    // **التحقق أولاً: تنفيذ الكود فقط إذا كنا على صفحة السيولة**
    if (cashFlowChartContext) {
        
        // دالة محاكاة التوقع (Forecasting)
        const performForecast = (historicalData) => {
            const avg = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
            
            const forecastData = [];
            let trend = 1.05; 
            for (let i = 0; i < 6; i++) {
                const predictedValue = avg * trend + (Math.random() * avg * 0.05); 
                forecastData.push(Math.round(predictedValue));
                trend += 0.01; 
            }

            return forecastData;
        };

        // دالة تحديث وعرض الرسم البياني (تم نقلها لتكون عامة ليتم استخدامها في applyTranslation)
        const updateChart = (historicalData, forecastData) => {
            
            const currentLang = document.body.getAttribute('data-current-lang') || 'fr';
            
            // استخدام النصوص المترجمة للمبيان
            const texts = getChartTexts(currentLang); 
            const labels = texts.labels;
            
            const data = [...historicalData, ...forecastData];
            
            if (cashFlowChart) {
                cashFlowChart.destroy();
            }

            if (typeof Chart !== 'undefined') {
                 cashFlowChart = new Chart(cashFlowChartContext, {
                    type: 'line',
                    data: {
                        labels: labels, // الآن مترجم
                        datasets: [
                            {
                                label: texts.chartLabel, // الآن مترجم
                                data: data,
                                backgroundColor: (context) => {
                                    const index = context.dataIndex;
                                    return index < 6 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)';
                                },
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 2,
                                fill: false,
                                segment: {
                                    borderColor: (context) => {
                                        return context.p0DataIndex < 6 && context.p1DataIndex >= 6 ? 'red' : 'rgba(75, 192, 192, 1)';
                                    },
                                    borderDash: (context) => {
                                        return context.p0DataIndex >= 6 ? [6, 6] : []; 
                                    }
                                }
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: texts.chartTitle // الآن مترجم
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: false
                            }
                        }
                    }
                });
            }


            const totalForecast = forecastData.reduce((a, b) => a + b, 0);
            
            // جلب النص المترجم من الـ HTML وإضافة النتيجة
            const textKey = forecastResult.getAttribute(`data-${currentLang}`) || forecastResult.getAttribute('data-fr');
            
            // تحديد الفورمات المناسب لكل لغة
            let formattedTotal;
            if (currentLang === 'ar') {
                 formattedTotal = totalForecast.toLocaleString('ar-MA') + ' درهم.';
            } else if (currentLang === 'en') {
                 formattedTotal = totalForecast.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
            } else {
                 // الفرنسية
                 formattedTotal = totalForecast.toLocaleString('fr-FR') + ' DH.';
            }
            
            forecastResult.textContent = textKey + formattedTotal; // دمج النص المترجم مع الرقم
        };
        
        // الاستماع لزر التحليل
        if (cashflowForm) {
            cashflowForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const historicalData = [];
                for(let i = 1; i <= 6; i++){
                    const input = document.getElementById(`month${i}`);
                    historicalData.push(parseFloat(input.value));
                }
                
                const forecastData = performForecast(historicalData);
                updateChart(historicalData, forecastData);
            });
        }

        // تشغيل العرض الأولي عند تحميل الصفحة 
        const initialHistoricalData = [50000, 65000, 48000, 72000, 81000, 90000];
        const initialForecastData = performForecast(initialHistoricalData);
        updateChart(initialHistoricalData, initialForecastData);
    
    } 

    // ======================================
    // 7. تفعيل نموذج الاتصال (Contact Form Activation - AJAX)
    // ======================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // تحديد رسائل الحالة حسب اللغة الحالية
            const currentLangForForm = document.documentElement.getAttribute('lang') || 'fr';
            let waitMessage, successMessage, errorMessage, networkError;
            
            if (currentLangForForm === 'ar') {
                waitMessage = "جاري الإرسال...";
                successMessage = "تم إرسال رسالتك بنجاح. شكراً لك يا حسام!"; 
                errorMessage = "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.";
                networkError = "خطأ في الاتصال. يرجى التحقق من شبكة الإنترنت.";
            } else if (currentLangForForm === 'en') {
                waitMessage = "Sending...";
                successMessage = "Your message was sent successfully. Thank you, Hossam!"; 
                errorMessage = "An error occurred during submission. Please try again.";
                networkError = "Connection error. Please check your network.";
            } else {
                waitMessage = "Envoi en cours...";
                successMessage = "Votre message a été envoyé avec succès. Merci, Hossam !"; 
                errorMessage = "Une erreur s'est produite lors de l'envoi. Veuillez réessayer.";
                networkError = "Erreur de connexion. Veuillez vérifier votre réseau.";
            }
            
            const formStatus = document.createElement('div');
            // تنسيقات بسيطة لعرض حالة الإرسال
            formStatus.style.cssText = `
                padding: 15px; 
                margin-top: 20px; 
                border-radius: 5px; 
                text-align: center;
                font-weight: bold;
                transition: opacity 0.3s;
                opacity: 1; 
            `;
            
            formStatus.textContent = waitMessage;
            formStatus.style.backgroundColor = '#f3f3f3';
            formStatus.style.color = '#333';
            contactForm.append(formStatus);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                // إزالة رسالة الانتظار
                formStatus.remove();

                if (response.ok) {
                    formStatus.textContent = successMessage;
                    formStatus.style.backgroundColor = '#d4edda'; // لون أخضر فاتح
                    formStatus.style.color = '#155724';
                    contactForm.append(formStatus);
                    contactForm.reset();
                    
                    // إخفاء رسالة النجاح بعد 5 ثواني
                    setTimeout(() => formStatus.remove(), 5000); 

                } else {
                    formStatus.textContent = errorMessage;
                    formStatus.style.backgroundColor = '#f8d7da'; // لون أحمر فاتح
                    formStatus.style.color = '#721c24';
                    contactForm.append(formStatus);
                }
            } catch (error) {
                // إزالة رسالة الانتظار
                formStatus.remove();
                
                formStatus.textContent = networkError;
                formStatus.style.backgroundColor = '#f8d7da';
                formStatus.style.color = '#721c24';
                contactForm.append(formStatus);
            }
        });
    }


});