'use client';

/**
 * Contact Page
 * Contact form and company information
 */

import { Badge, Button, Card, CardContent, Container, Section } from '@/components/ui';
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useState } from 'react';

// Contact info
const contactInfo = [
  {
    icon: Mail,
    label: 'E-mail',
    value: 'contato@asevedocompany.com',
    href: 'mailto:contato@asevedocompany.com',
  },
  {
    icon: Phone,
    label: 'Telefone',
    value: '+55 (11) 99999-9999',
    href: 'tel:+5511999999999',
  },
  {
    icon: MapPin,
    label: 'Localização',
    value: 'São Paulo, Brasil',
    href: null,
  },
  {
    icon: Clock,
    label: 'Horário',
    value: 'Seg-Sex, 9h às 18h',
    href: null,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    deadline: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="primary" className="mb-6">
              Contato
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Vamos conversar sobre seu{' '}
              <span className="text-gradient">próximo projeto</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground-secondary">
              Preencha o formulário abaixo e receba uma proposta personalizada em até 48 horas. 
              Sem compromisso.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Form & Info */}
      <Section variant="secondary">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Informações de contato</h2>
              <p className="text-foreground-secondary">
                Prefere falar diretamente? Use um dos canais abaixo ou envie uma mensagem 
                pelo WhatsApp.
              </p>
            </div>
            
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <Card key={info.label} variant="glass" className="group">
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground-muted text-sm">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-foreground hover:text-primary transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-foreground">{info.value}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* WhatsApp CTA */}
            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
              <CardContent className="py-6 text-center">
                <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Resposta rápida?</h3>
                <p className="text-foreground-secondary text-sm mb-4">
                  Fale conosco pelo WhatsApp para uma resposta em minutos.
                </p>
                <Button 
                  href="https://wa.me/5511999999999" 
                  external
                  variant="primary"
                  fullWidth
                  icon={<MessageCircle size={18} />}
                >
                  Abrir WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-8 md:p-10">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                      <Send className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Mensagem enviada!</h3>
                    <p className="text-foreground-secondary mb-6">
                      Recebemos sua solicitação e entraremos em contato em até 48 horas.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Enviar outra mensagem
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Seu nome *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors"
                          placeholder="Como podemos te chamar?"
                        />
                      </div>
                      
                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors"
                          placeholder="seu@email.com"
                        />
                      </div>
                      
                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      
                      {/* Company */}
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                          Empresa
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors"
                          placeholder="Nome da sua empresa"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Project Type */}
                      <div>
                        <label htmlFor="projectType" className="block text-sm font-medium text-foreground mb-2">
                          Tipo de projeto
                        </label>
                        <select
                          id="projectType"
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                        >
                          <option value="">Selecione</option>
                          <option value="web">Sistema Web</option>
                          <option value="mobile">App Mobile</option>
                          <option value="api">API / Integração</option>
                          <option value="mvp">MVP / Protótipo</option>
                          <option value="other">Outro</option>
                        </select>
                      </div>
                      
                      {/* Budget */}
                      <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
                          Orçamento estimado
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                        >
                          <option value="">Selecione</option>
                          <option value="under-50k">Até R$ 50.000</option>
                          <option value="50k-100k">R$ 50.000 - R$ 100.000</option>
                          <option value="100k-250k">R$ 100.000 - R$ 250.000</option>
                          <option value="over-250k">Acima de R$ 250.000</option>
                          <option value="unknown">Ainda não sei</option>
                        </select>
                      </div>
                      
                      {/* Deadline */}
                      <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-foreground mb-2">
                          Prazo desejado
                        </label>
                        <select
                          id="deadline"
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                        >
                          <option value="">Selecione</option>
                          <option value="urgent">Urgente (&lt; 1 mês)</option>
                          <option value="short">Curto prazo (1-3 meses)</option>
                          <option value="medium">Médio prazo (3-6 meses)</option>
                          <option value="long">Sem urgência</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Conte-nos sobre o projeto *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors resize-none"
                        placeholder="Descreva seu projeto, os desafios que enfrenta e os resultados que espera alcançar..."
                      />
                    </div>
                    
                    {/* Submit */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button 
                        type="submit" 
                        size="lg" 
                        icon={<Send size={18} />}
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Enviando...' : 'Enviar solicitação'}
                      </Button>
                    </div>
                    
                    <p className="text-foreground-muted text-sm text-center">
                      Ao enviar, você concorda com nossa política de privacidade. 
                      Seus dados estão seguros.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
