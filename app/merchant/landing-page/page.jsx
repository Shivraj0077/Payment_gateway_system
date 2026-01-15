'use client'

import React, { useState, useEffect } from 'react'
import {
    ArrowRight, FileText, Zap, Shield, Webhook, Book,
    Copy, Check, TrendingUp, Activity, CheckCircle2,
    XCircle, Clock, Sun, Moon, Menu, X, Code2, Lock, Key
} from 'lucide-react'
import Image from 'next/image'
import heroImage from "./payment-image.png"
// --- Constants ---

const THEME_KEY = 'vault-theme'

const NAV_LINKS = [
    { href: '#capabilities', label: 'Capabilities' },
    { href: '#developers', label: 'Developers' },
    { href: '#security', label: 'Security' },
]

const CAPABILITIES = [
    {
        icon: Zap,
        title: 'Unified Payments API',
        description: 'Single integration for cards, bank transfers, and wallets. Abstract provider complexity with a consistent interface.'
    },
    {
        icon: Shield,
        title: 'Idempotent & Safe Requests',
        description: 'Built-in idempotency keys prevent duplicate charges. Retry safely without side effects.'
    },
    {
        icon: Webhook,
        title: 'Webhooks & Event-driven Flow',
        description: 'Real-time event notifications with automatic retries and signature verification. Build reactive systems.'
    },
    {
        icon: Book,
        title: 'Ledger-based Accounting',
        description: 'Double-entry ledger tracking for every transaction. Immutable audit trail with automatic reconciliation.'
    },
]

const PAYMENT_FLOW_STEPS = [
    { label: 'Client', sublabel: 'Request' },
    { label: 'API', sublabel: 'Validate' },
    { label: 'Processing', sublabel: 'Execute' },
    { label: 'Events', sublabel: 'Emit' },
    { label: 'Ledger', sublabel: 'Record' },
    { label: 'Webhooks', sublabel: 'Notify' },
]

const CODE_SNIPPET = `// Create a payment intent
const payment = await vault.payments.create({
  amount: 5000,
  currency: 'usd',
  customer: 'cus_abc123',
  idempotency_key: 'order_xyz789',
  metadata: {
    order_id: 'xyz789',
    source: 'web_checkout'
  }
});

// Handle response
if (payment.status === 'succeeded') {
  await fulfillOrder(payment.id);
}

// Listen for events
vault.webhooks.on('payment.succeeded', async (event) => {
  await updateLedger(event.data);
});`

const RECENT_PAYMENTS = [
    { id: 'pay_8x9f2k', customer: 'Sarah Chen', amount: '$149.00', status: 'succeeded', time: '2m ago' },
    { id: 'pay_7h3g9m', customer: 'Marcus Webb', amount: '$89.50', status: 'succeeded', time: '5m ago' },
    { id: 'pay_5j2k1n', customer: 'Elena Rodriguez', amount: '$299.00', status: 'processing', time: '8m ago' },
    { id: 'pay_4n8h2p', customer: 'James Liu', amount: '$45.00', status: 'succeeded', time: '12m ago' },
    { id: 'pay_2m9k3r', customer: 'Olivia Brown', amount: '$175.00', status: 'failed', time: '15m ago' },
]

const SECURITY_FEATURES = [
    {
        icon: Lock,
        title: 'Tokenization',
        description: 'Sensitive card data never touches your servers. All credentials are tokenized at ingestion.'
    },
    {
        icon: Key,
        title: 'Encrypted Secrets',
        description: 'API keys and webhook secrets encrypted at rest using AES-256. Automatic rotation support.'
    },
    {
        icon: FileText,
        title: 'Signed Webhooks',
        description: 'Every webhook includes HMAC signature for verification. Prevent replay attacks with timestamps.'
    },
    {
        icon: Shield,
        title: 'HTTPS Enforced',
        description: 'TLS 1.3 required for all API communication.'
    },
]

function Navigation() {
    const [theme, setTheme] = useState('light')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const savedTheme = localStorage.getItem(THEME_KEY) || 'light'
        setTheme(savedTheme)
        document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem(THEME_KEY, newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4 md:gap-8">
                    <div className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white transition-colors">Vault</div>
                    <div className="hidden md:flex items-center gap-6 text-sm">
                        {NAV_LINKS.map(({ href, label }) => (
                            <a
                                key={href}
                                href={href}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>

                    <button className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2">
                        Sign In
                    </button>

                    <button className="hidden sm:block text-sm bg-gray-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium">
                        Get Started
                    </button>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-background border-t border-gray-100 dark:border-slate-800 transition-colors">
                    <div className="px-4 py-4 space-y-3">
                        {NAV_LINKS.map(({ href, label }) => (
                            <a
                                key={href}
                                href={href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors py-2"
                            >
                                {label}
                            </a>
                        ))}

                        <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-3">
                            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors py-2 text-left">
                                Sign In
                            </button>
                            <button className="text-sm bg-gray-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium w-full">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

function HeroVisual() {
    return (
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12">
            <Image src={heroImage} alt="Hero Image" fill className="object-cover" />
        </div>
    )
}

function Hero() {
    return (
        <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl tracking-tight mb-4 sm:mb-6 text-gray-900 dark:text-white transition-colors">
                            Payment Gateway System
                        </h1>
                        <h2 className="text-xl sm:text-3xl lg:text-4xl tracking-tight mb-4 sm:mb-6 text-gray-900 dark:text-white transition-colors">
                            Money moves precisely
                        </h2>
                        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed transition-colors">
                            A unified API layer for accepting, processing, and reconciling payments.<br />
                            Designed for reliability, transparency, and clean integration.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium w-full sm:w-auto">
                                Start Integration <ArrowRight className="w-4 h-4" />
                            </button>
                            <button className="border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-white px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium w-full sm:w-auto">
                                <FileText className="w-4 h-4" /> View Docs
                            </button>
                        </div>

                        <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-8 text-sm text-gray-500 dark:text-gray-400 transition-colors">
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white transition-colors">Event</div>
                                <div>Sourcing</div>
                            </div>
                            <div className="h-10 sm:h-12 w-px bg-gray-200 dark:bg-slate-800 transition-colors"></div>
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white transition-colors">&lt;200ms</div>
                                <div>Avg. Latency</div>
                            </div>
                            <div className="h-10 sm:h-12 w-px bg-gray-200 dark:bg-slate-800 transition-colors"></div>
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white transition-colors">PCI</div>
                                <div>Standard</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        <HeroVisual />
                        <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-gray-100 dark:border-slate-700 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors">API Status: Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function Capabilities() {
    return (
        <section id="capabilities" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50 dark:bg-background transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl mb-10 sm:mb-16">
                    <h2 className="text-2xl sm:text-4xl tracking-tight mb-3 sm:mb-4 text-gray-900 dark:text-white transition-colors">
                        Built for scale and reliability
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 transition-colors">
                        Core primitives designed to handle complexity without compromising on developer experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    {CAPABILITIES.map((cap, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800/50 rounded-xl p-5 sm:p-8 border border-gray-100 dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700 transition-colors">
                            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mb-4 sm:mb-6 transition-colors">
                                <cap.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white dark:text-slate-900" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-white transition-colors">
                                {cap.title}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">
                                {cap.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

function PaymentFlow() {
    return (
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-background transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 sm:mb-16">
                    <h2 className="text-2xl sm:text-4xl tracking-tight mb-3 sm:mb-4 text-gray-900 dark:text-white transition-colors">
                        How payments flow
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 transition-colors">
                        Every transaction follows a predictable, observable path
                    </p>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
                    {PAYMENT_FLOW_STEPS.map((step, i) => (
                        <React.Fragment key={i}>
                            <div className="text-center">
                                <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center mb-2 shadow-lg transition-transform hover:scale-105">
                                    <div className="text-white font-semibold text-xs sm:text-sm mb-1">{step.label}</div>
                                    <div className="text-gray-300 text-[10px] sm:text-xs">{step.sublabel}</div>
                                </div>
                            </div>
                            {i < PAYMENT_FLOW_STEPS.length - 1 && (
                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 dark:text-slate-600 hidden md:block flex-shrink-0" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    )
}

function DeveloperSection() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(CODE_SNIPPET);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="developers" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50 dark:bg-background transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div>
                        <h2 className="text-2xl sm:text-4xl tracking-tight mb-3 sm:mb-4 text-gray-900 dark:text-white transition-colors">Built for developers</h2>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 transition-colors">
                            Predictable APIs with clear error handling.
                        </p>
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 transition-colors">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-white mt-2 transition-colors"></div>
                                <span>Strongly typed SDK with autocomplete</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-white mt-2 transition-colors"></div>
                                <span>Detailed error codes and recovery strategies</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-white mt-2 transition-colors"></div>
                                <span>Interactive API reference with live examples</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-white mt-2 transition-colors"></div>
                                <span>Test mode with realistic sandbox behavior</span>
                            </li>
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="bg-[#101828] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#101828]">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <span className="text-xs text-gray-400">payment.js</span>
                                <button
                                    onClick={handleCopy}
                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                    aria-label="Copy code"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <pre className="p-6 text-sm overflow-x-auto">
                                <code className="text-gray-300 font-mono leading-relaxed">
                                    <span className="text-gray-500">// Create a payment intent</span>
                                    {'\n'}
                                    <span className="text-purple-400">const</span> <span className="text-blue-300">payment</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">vault</span>.<span className="text-blue-300">payments</span>.<span className="text-yellow-300">create</span>{'({\n'}
                                    {'  '}<span className="text-blue-300">amount</span>: <span className="text-green-300">5000</span>,{'\n'}
                                    {'  '}<span className="text-blue-300">currency</span>: <span className="text-orange-300">'usd'</span>,{'\n'}
                                    {'  '}<span className="text-blue-300">customer</span>: <span className="text-orange-300">'cus_abc123'</span>,{'\n'}
                                    {'  '}<span className="text-blue-300">idempotency_key</span>: <span className="text-orange-300">'order_xyz789'</span>,{'\n'}
                                    {'  '}<span className="text-blue-300">metadata</span>: {'{\n'}
                                    {'    '}<span className="text-blue-300">order_id</span>: <span className="text-orange-300">'xyz789'</span>,{'\n'}
                                    {'    '}<span className="text-blue-300">source</span>: <span className="text-orange-300">'web_checkout'</span>{'\n'}
                                    {'  }\n'}{'})'};{'\n\n'}
                                    <span className="text-gray-500">// Handle response</span>
                                    {'\n'}
                                    <span className="text-purple-400">if</span> {'('}<span className="text-blue-300">payment</span>.<span className="text-blue-300">status</span> === <span className="text-orange-300">'succeeded'</span>{')'} {'{\n'}
                                    {'  '}<span className="text-purple-400">await</span> <span className="text-yellow-300">fulfillOrder</span>{'('}<span className="text-blue-300">payment</span>.<span className="text-blue-300">id</span>{');\n'}
                                    {'}\n\n'}
                                    <span className="text-gray-500">// Listen for events</span>
                                    {'\n'}
                                    <span className="text-blue-300">vault</span>.<span className="text-blue-300">webhooks</span>.<span className="text-yellow-300">on</span>{'('}<span className="text-orange-300">'payment.succeeded'</span>, <span className="text-purple-400">async</span> {'('}<span className="text-blue-300">event</span>{')'} {'=> {\n'}
                                    {'  '}<span className="text-purple-400">await</span> <span className="text-yellow-300">updateLedger</span>{'('}<span className="text-blue-300">event</span>.<span className="text-blue-300">data</span>{');\n'}
                                    {'});'}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function DashboardPreview() {
    return (
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white dark:bg-background transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 sm:mb-16">
                    <h2 className="text-2xl sm:text-4xl tracking-tight mb-3 sm:mb-4 text-gray-900 dark:text-white transition-colors">
                        Complete visibility
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 transition-colors">
                        Real-time dashboard with transaction monitoring and analytics
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-slate-800 transition-colors flex justify-between items-center">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Payment Overview</h3>
                        <select className="text-xs sm:text-sm border border-gray-300 dark:border-slate-700 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white outline-none">
                            <option>Last 7 days</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 border-b border-gray-200 dark:border-slate-800 transition-colors">
                        <div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 transition-colors">
                                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> <span>Total Volume</span>
                            </div>
                            <div className="text-xl sm:text-3xl font-semibold text-gray-900 dark:text-white">$47,892</div>
                            <div className="text-xs sm:text-sm text-green-600 mt-1 font-medium">+12.5% vs last week</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 transition-colors">
                                <Activity className="w-3 h-3 sm:w-4 sm:h-4" /> <span>Success Rate</span>
                            </div>
                            <div className="text-xl sm:text-3xl font-semibold text-gray-900 dark:text-white">97.8%</div>
                            <div className="text-xs sm:text-sm text-gray-500 mt-1">324 of 331 succeeded</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2 transition-colors">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" /> <span>Avg Processing</span>
                            </div>
                            <div className="text-xl sm:text-3xl font-semibold text-gray-900 dark:text-white">1.2s</div>
                            <div className="text-xs sm:text-sm text-gray-500 mt-1">Median: 890ms</div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Payment ID</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RECENT_PAYMENTS.map((p, i) => (
                                    <tr
                                        key={p.id}
                                        className={`${i !== RECENT_PAYMENTS.length - 1 ? 'border-b border-gray-100 dark:border-slate-800' : ''} hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors`}
                                    >
                                        <td className="px-6 py-4"><code className="text-sm text-blue-600 dark:text-blue-400 font-mono">{p.id}</code></td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{p.customer}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{p.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${p.status === 'succeeded'
                                                ? 'bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800'
                                                : p.status === 'processing'
                                                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800'
                                                    : 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800'
                                                }`}>
                                                {p.status === 'succeeded' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                {p.status === 'processing' && <Clock className="w-3.5 h-3.5" />}
                                                {p.status === 'failed' && <XCircle className="w-3.5 h-3.5" />}
                                                {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{p.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}

function SecurityCompliance() {
    return (
        <section id="security" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50 dark:bg-background transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 sm:mb-16">
                    <h2 className="text-2xl sm:text-4xl tracking-tight mb-3 sm:mb-4 text-gray-900 dark:text-white transition-colors">
                        Security & Compliance
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                        Built with security at every layer
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4" /> <span>PCI-aligned architecture</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {SECURITY_FEATURES.map((f, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-slate-800 transition-colors">
                            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center mb-3 sm:mb-4">
                                <f.icon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-700 dark:text-gray-300" />
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base mb-1.5 sm:mb-2 text-gray-900 dark:text-white">
                                {f.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {f.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Regular security audits • SOC 2 Type II in progress • Encryption in Transit & at Rest
                </div>
            </div>
        </section>
    )
}

function FinalCTA() {
    return (
        <section className="py-20 sm:py-32 px-4 sm:px-6 bg-white dark:bg-background transition-colors">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-5xl tracking-tight mb-4 sm:mb-6 text-gray-900 dark:text-white transition-colors">
                    Begin integrating
                </h2>
                <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto">
                    Start building with production-ready APIs.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
                    <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 font-medium w-full sm:w-auto">
                        Get API Keys <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                    </button>
                    <button className="border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium w-full sm:w-auto">
                        <Code2 className="w-4 sm:w-5 h-4 sm:h-5" /> Explore the Platform
                    </button>
                </div>

                <div className="pt-10 sm:pt-16 border-t border-gray-200 dark:border-slate-800 transition-colors">
                    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {['API Reference', 'Status', 'GitHub', 'Support', 'Privacy'].map((link, i) => (
                            <a key={i} href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                                {link}
                            </a>
                        ))}
                    </div>
                    <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                        © 2026 Vault. Infrastructure for modern payments.
                    </div>
<span className="italic text-gray-400 dark:text-gray-500">
  Built by Shivraj Pawar
</span>


                </div>
            </div>
        </section>
    )
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navigation />
            <Hero />
            <Capabilities />
            <PaymentFlow />
            <DeveloperSection />
            <DashboardPreview />
            <SecurityCompliance />
            <FinalCTA />
        </div>
    )
}