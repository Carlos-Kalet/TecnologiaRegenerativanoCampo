// ==================== AGUARDAR DOM CARREGAR ====================
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initMobileMenu();
    animateNumbers();
    initTechTabs();
    initAccordion();
    initCalculadoraCarbono();
    initFormContato();
    initFooterNewsletter();
    initRelatorioBotao();
    initSwiperCases();
    initCharts();
});

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#" || targetId === "") return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se aberto
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

// ==================== MENU MOBILE ====================
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (toggle && navMenu) {
        toggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        
        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = toggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    }
}

// ==================== ANIMAÇÃO DOS NÚMEROS (STATS) ====================
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: "0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-target'));
                if (!el.classList.contains('animated') && !isNaN(target)) {
                    el.classList.add('animated');
                    
                    let current = 0;
                    const increment = target / 60;
                    const isDecimal = target % 1 !== 0;
                    
                    const updateNumber = () => {
                        current += increment;
                        if (current < target) {
                            if (isDecimal) {
                                el.innerText = current.toFixed(1);
                            } else {
                                el.innerText = Math.floor(current);
                            }
                            requestAnimationFrame(updateNumber);
                        } else {
                            if (isDecimal) {
                                el.innerText = target.toFixed(1);
                            } else {
                                el.innerText = Math.floor(target);
                            }
                        }
                    };
                    updateNumber();
                }
                observer.unobserve(el);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// ==================== TABS DAS TECNOLOGIAS ====================
function initTechTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabBtns.length === 0) return;
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remover active de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adicionar active ao clicado
            btn.classList.add('active');
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

// ==================== ACCORDION FAQ ====================
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fechar todos
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Abrir o clicado se não estava aberto
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Abrir primeiro item por padrão
    if (accordionItems.length > 0) {
        accordionItems[0].classList.add('active');
    }
}

// ==================== CALCULADORA DE CARBONO ====================
function initCalculadoraCarbono() {
    const calcularBtn = document.getElementById('calcularBtn');
    const resultadoDiv = document.getElementById('resultadoCalculadora');
    
    if (!calcularBtn || !resultadoDiv) return;
    
    calcularBtn.addEventListener('click', () => {
        const area = parseFloat(document.getElementById('areaHa')?.value) || 0;
        const sistemaAtual = document.getElementById('sistemaAtual')?.value;
        const tecnologia = document.getElementById('tecnologiaEscolhida')?.value;
        
        if (area <= 0) {
            resultadoDiv.innerHTML = `
                <div class="resultado-content">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff9800;"></i>
                    <p style="margin-top: 16px;">Por favor, insira uma área válida (maior que 0 hectares)</p>
                </div>
            `;
            return;
        }
        
        // Cálculos baseados em dados científicos
        let fatorSequestro = 0;
        let fatorProdutividade = 0;
        
        // Fator base conforme sistema atual
        if (sistemaAtual === 'convencional') {
            fatorSequestro = 2.5;
            fatorProdutividade = 1.35;
        } else if (sistemaAtual === 'pastagem') {
            fatorSequestro = 3.8;
            fatorProdutividade = 1.85;
        } else {
            fatorSequestro = 1.2;
            fatorProdutividade = 1.15;
        }
        
        // Multiplicador conforme tecnologia
        let tecnologiaMultiplicador = 1;
        if (tecnologia === 'bioinsumos') {
            tecnologiaMultiplicador = 1.3;
        } else if (tecnologia === 'ilpf') {
            tecnologiaMultiplicador = 1.8;
        } else if (tecnologia === 'saf') {
            tecnologiaMultiplicador = 2.2;
        }
        
        const carbonoAnual = area * fatorSequestro * tecnologiaMultiplicador;
        const produtividadeAumento = ((fatorProdutividade * tecnologiaMultiplicador) - 1) * 100;
        const valorCreditoCarbono = carbonoAnual * 25; // US$ 25 por tonelada
        const valorReal = valorCreditoCarbono * 5.7; // Conversão para Real
        
        resultadoDiv.innerHTML = `
            <div class="resultado-content">
                <i class="fas fa-chart-line" style="font-size: 2.5rem; color: #8bc34a;"></i>
                <h3>Seu potencial regenerativo</h3>
                <div class="resultado-numbers">
                    <div>🌍 ${carbonoAnual.toFixed(0)} ton CO₂/ano</div>
                    <div>📈 +${produtividadeAumento.toFixed(0)}% produtividade</div>
                    <div>💰 R$ ${valorReal.toLocaleString('pt-BR')}/ano em créditos</div>
                </div>
                <p style="font-size: 0.85rem; opacity: 0.8;">*Estimativa baseada em dados médios de propriedades regenerativas</p>
                <button class="btn btn-outline" style="margin-top: 20px; background: transparent; border-color: white;" onclick="document.getElementById('contato')?.scrollIntoView({behavior:'smooth'})">
                    Quero saber mais <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
    });
}

// ==================== FORMULÁRIO DE CONTATO PRINCIPAL ====================
function initFormContato() {
    const form = document.getElementById('formContatoFinal');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('contatoNome')?.value.trim();
        const email = document.getElementById('contatoEmail')?.value.trim();
        const telefone = document.getElementById('contatoTel')?.value.trim();
        const cidade = document.getElementById('contatoCidade')?.value.trim();
        const area = document.getElementById('contatoArea')?.value;
        const mensagem = document.getElementById('contatoMsg')?.value.trim();
        const msgDiv = document.getElementById('formFinalMessage');
        
        // Validações
        if (!nome || nome.length < 3) {
            showFormMessage(msgDiv, '❌ Por favor, insira seu nome completo', 'error');
            return;
        }
        
        if (!email || !email.includes('@') || !email.includes('.')) {
            showFormMessage(msgDiv, '❌ Insira um e-mail válido', 'error');
            return;
        }
        
        if (!area) {
            showFormMessage(msgDiv, '❌ Selecione o tamanho da sua propriedade', 'error');
            return;
        }
        
        // Simular envio
        showFormMessage(msgDiv, `✅ Obrigado ${nome}! Recebemos sua solicitação. Um especialista entrará em contato em até 24h.`, 'success');
        
        form.reset();
        
        // Enviar para analytics/simulação
        console.log('Formulário enviado:', { nome, email, telefone, cidade, area, mensagem });
        
        // Limpar mensagem após 5 segundos
        setTimeout(() => {
            if (msgDiv) msgDiv.innerHTML = '';
        }, 5000);
    });
}

function showFormMessage(element, message, type) {
    if (!element) return;
    element.innerHTML = `<span style="color: ${type === 'error' ? '#f44336' : '#4caf50'}">${message}</span>`;
}

// ==================== NEWSLETTER FOOTER ====================
function initFooterNewsletter() {
    const subscribeBtn = document.getElementById('footerSubscribe');
    const emailInput = document.getElementById('footerEmail');
    
    if (!subscribeBtn || !emailInput) return;
    
    subscribeBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const msgContainer = document.querySelector('.footer-newsletter');
        
        if (!email || !email.includes('@')) {
            showTemporaryMessage(msgContainer, '❌ E-mail inválido', 'error');
            return;
        }
        
        showTemporaryMessage(msgContainer, '✅ Inscrito com sucesso! Você receberá nossas novidades.', 'success');
        emailInput.value = '';
    });
}

function showTemporaryMessage(container, message, type) {
    const existingMsg = container.querySelector('.temp-message');
    if (existingMsg) existingMsg.remove();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'temp-message';
    msgDiv.style.cssText = `
        margin-top: 16px;
        padding: 12px;
        border-radius: 8px;
        background: ${type === 'error' ? '#ffebee' : '#e8f5e9'};
        color: ${type === 'error' ? '#c62828' : '#2e7d32'};
        font-size: 0.9rem;
        text-align: center;
    `;
    msgDiv.innerHTML = message;
    container.appendChild(msgDiv);
    
    setTimeout(() => msgDiv.remove(), 4000);
}

// ==================== RELATÓRIO BOTÃO ====================
function initRelatorioBotao() {
    const btn = document.getElementById('downloadRelatorio');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('📊 Relatório de Impacto 2025 disponível para download.\n\nPrincipais resultados:\n• 2.5M hectares regenerados\n• 78M ton CO₂ sequestradas\n• 42% aumento médio de produtividade\n• R$ 450M em créditos de carbono gerados\n\nClique em OK para simular download.');
        });
    }
}

// ==================== SWIPER CASES ====================
function initSwiperCases() {
    const swiperContainer = document.querySelector('.casos-swiper');
    if (!swiperContainer) return;
    
    // Verificar se Swiper está disponível
    if (typeof Swiper !== 'undefined') {
        new Swiper('.casos-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
        });
    } else {
        console.warn('Swiper não carregado');
    }
}

// ==================== GRÁFICOS COM CHART.JS ====================
function initCharts() {
    // Verificar se Chart está disponível
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js não carregado');
        return;
    }
    
    // Gráfico de Produtividade Avançado
    const ctxProd = document.getElementById('graficoProdutividadeAvancado');
    if (ctxProd) {
        new Chart(ctxProd, {
            type: 'line',
            data: {
                labels: ['Safra 1', 'Safra 2', 'Safra 3', 'Safra 4', 'Safra 5', 'Safra 6'],
                datasets: [
                    {
                        label: 'Convencional',
                        data: [68, 69, 67, 66, 65, 64],
                        borderColor: '#ba6b2e',
                        backgroundColor: 'rgba(186, 107, 46, 0.1)',
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        fill: true,
                    },
                    {
                        label: 'Regenerativo',
                        data: [65, 73, 82, 91, 97, 102],
                        borderColor: '#2e7d32',
                        backgroundColor: 'rgba(46, 125, 50, 0.1)',
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        fill: true,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw} sc/ha`;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            font: { size: 12, weight: 'bold' }
                        }
                    }
                },
                scales: {
                    y: {
                        title: { display: true, text: 'Produtividade (sc/ha)', font: { weight: 'bold' } },
                        min: 50,
                        max: 110,
                        grid: { color: '#e0e7d9' }
                    },
                    x: {
                        title: { display: true, text: 'Safras', font: { weight: 'bold' } }
                    }
                }
            }
        });
    }
    
    // Gráfico de Emissões (Pizza)
    const ctxEmiss = document.getElementById('graficoEmissoes');
    if (ctxEmiss) {
        new Chart(ctxEmiss, {
            type: 'doughnut',
            data: {
                labels: ['Bioinsumos', 'ILPF', 'Precisão Digital', 'Bioenergia', 'Outros'],
                datasets: [{
                    data: [32, 28, 22, 12, 6],
                    backgroundColor: [
                        '#2e7d32',
                        '#4caf50',
                        '#8bc34a',
                        '#cddc39',
                        '#aed581'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}% redução`;
                            }
                        }
                    }
                },
                cutout: '60%',
            }
        });
    }
}

// ==================== EFEITOS ADICIONAIS ====================

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
            header.style.background = 'rgba(255, 255, 245, 0.98)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    }
});

// Animação de entrada dos cards (Intersection Observer)
const animateOnScroll = () => {
    const cards = document.querySelectorAll('.tech-card, .case-card, .metric-item, .pilar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px' });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
};

setTimeout(animateOnScroll, 100);

// Botão "Voltar ao topo" (criar dinamicamente)
const createBackToTopButton = () => {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.id = 'backToTop';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--gradient-primary);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        z-index: 999;
    `;
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px)';
        btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
    });
};

createBackToTopButton();

// Prevenir envio de formulários sem validação (fallback)
const preventInvalidSubmit = () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
};

preventInvalidSubmit();

// Log de carregamento (para debug)
console.log('🌱 AgroRegenerativa - Site carregado com sucesso!');
console.log('📊 Tecnologia Regenerativa no Campo - Equilíbrio entre produção e meio ambiente');

// ==================== EXPOR FUNÇÕES GLOBAIS (para uso inline) ====================
window.initCalculadoraCarbono = initCalculadoraCarbono;
window.initCharts = initCharts;
window.initSwiperCases = initSwiperCases;
