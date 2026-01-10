'use client';

/**
 * CTA Section
 * Final call-to-action with contact form
 * Primary conversion point on the homepage
 */

import { Button, Section } from '@/components/ui';
import { CheckCircle, Send, X } from 'lucide-react';
import { useState } from 'react';

export function CTASection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Integrar com API para enviar notificação no WhatsApp e cadastrar lead
    console.log('Form submitted:', formData);
    
    // Simula delay de envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setShowModal(true);
    
    // Limpa formulário
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Section
        id="cta"
        className="relative overflow-hidden"
      >
        
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Pronto para <span className="text-gradient">transformar sua ideia</span> em realidade?
            </h2>
            <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
              Conte-nos sobre seu projeto e receba uma proposta personalizada em até 48 horas.
            </p>
          </div>
          
          {/* Form */}
          <div className="glass rounded-2xl p-8 md:p-10 border border-card-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-foreground mb-2"
                >
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

              <div className="grid md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-foreground mb-2"
                  >
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
                
                {/* Telefone */}
                <div>
                  <label 
                    htmlFor="phone" 
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              
              {/* Message */}
              <div>
                <label 
                  htmlFor="message" 
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Sobre o projeto *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Descreva brevemente seu projeto ou desafio..."
                />
              </div>
              
              {/* Submit button */}
              <div className="pt-4 flex justify-center">
                <Button 
                  type="submit" 
                  size="lg" 
                  icon={<Send size={18} />} 
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Solicitar Proposta'}
                </Button>
              </div>
            </form>
          </div>
          
          {/* Trust note */}
          <p className="text-center text-foreground-muted text-sm mt-6">
            Seus dados estão seguros. Não compartilhamos informações com terceiros.
          </p>
        </div>
      </Section>

      {/* Modal de Confirmação */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative bg-background-secondary border border-card-border rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>

            {/* Ícone de sucesso */}
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle size={48} className="text-primary" />
              </div>
            </div>

            {/* Conteúdo */}
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Proposta Solicitada!
            </h3>
            <p className="text-foreground-secondary mb-6">
              Nossa equipe entrará em contato em breve para entender melhor seu projeto.
            </p>

            {/* Botão */}
            <Button onClick={() => setShowModal(false)} className="w-full">
              Entendido
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

