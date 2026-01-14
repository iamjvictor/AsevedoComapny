'use client';

/**
 * CTA Section
 * Final call-to-action with contact form
 * Primary conversion point on the homepage
 */

import { Button, Calendar, Section } from '@/components/ui';
import { DateOccupancy } from '@/components/ui/Calendar';
import { supabase } from '@/components/clients/Supabase';
import { notifyNewLead } from '@/services/emailService';
import { Calendar as CalendarIcon, CheckCircle, Send, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

// Horários disponíveis para agendamento (todos menos os já ocupados)
const DEFAULT_TIME_SLOTS = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
];

export function CTASection() {
  const t = useTranslations('CTA');
  const locale = useLocale();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado do lead salvo
  const [savedLeadId, setSavedLeadId] = useState<string | null>(null);
  const [savedLeadData, setSavedLeadData] = useState<{
    name: string;
    email: string;
    phone: string;
    message: string;
    source: string;
  } | null>(null);
  
  // Estado do calendário
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  
  // Estado para ocupação do mês (indicadores visuais no calendário)
  const [busyDates, setBusyDates] = useState<DateOccupancy[]>([]);
  const [isLoadingBusyDates, setIsLoadingBusyDates] = useState(false);
  
  // Captura código de parceiro e UTMs da URL
  const [trackingData, setTrackingData] = useState({
    partnerCode: null as string | null,
    utmSource: null as string | null,
    utmMedium: null as string | null,
    utmCampaign: null as string | null,
    utmTerm: null as string | null,
    utmContent: null as string | null,
  });

  useEffect(() => {
    // Captura parâmetros da URL quando o componente monta
    setTrackingData({
      partnerCode: searchParams.get('ref') || searchParams.get('partner') || null,
      utmSource: searchParams.get('utm_source'),
      utmMedium: searchParams.get('utm_medium'),
      utmCampaign: searchParams.get('utm_campaign'),
      utmTerm: searchParams.get('utm_term'),
      utmContent: searchParams.get('utm_content'),
    });
  }, [searchParams]);

  // Busca ocupação do mês para indicadores visuais no calendário
  const fetchBusyDates = useCallback(async (startDate: Date, endDate: Date) => {
    setIsLoadingBusyDates(true);
    
    try {
      // Busca todas as meetings do período
      const { data: meetings, error: meetingsError } = await supabase
        .from('meetings')
        .select('scheduled_at')
        .gte('scheduled_at', startDate.toISOString())
        .lte('scheduled_at', endDate.toISOString())
        .in('status', ['agendado', 'confirmado']);

      if (meetingsError) {
        console.error('Erro ao buscar reuniões do mês:', meetingsError);
        setBusyDates([]);
        return;
      }

      // Agrupa por data
      const dateMap = new Map<string, number>();
      
      (meetings || []).forEach(m => {
        const meetingDate = new Date(m.scheduled_at);
        const dateStr = meetingDate.toISOString().split('T')[0];
        dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
      });

      // Converte para array de DateOccupancy
      const occupancy: DateOccupancy[] = Array.from(dateMap.entries()).map(([date, count]) => ({
        date,
        slotsOccupied: count,
        totalSlots: DEFAULT_TIME_SLOTS.length,
      }));

      setBusyDates(occupancy);
    } catch (err) {
      console.error('Erro ao buscar ocupação:', err);
      setBusyDates([]);
    } finally {
      setIsLoadingBusyDates(false);
    }
  }, []);

  // Busca dados quando o modal abre
  useEffect(() => {
    if (showModal) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      fetchBusyDates(startOfMonth, endOfMonth);
    }
  }, [showModal, fetchBusyDates]);

  // Busca horários ocupados e calcula os disponíveis
  const fetchAvailableSlots = useCallback(async (date: Date) => {
    setIsLoadingSlots(true);
    
    try {
      // Cria range do dia selecionado
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Busca meetings já agendados para esse dia
      const { data: meetings, error: meetingsError } = await supabase
        .from('meetings')
        .select('scheduled_at')
        .gte('scheduled_at', startOfDay.toISOString())
        .lte('scheduled_at', endOfDay.toISOString())
        .in('status', ['agendado', 'confirmado']); // Ignora cancelados

      if (meetingsError) {
        console.error('Erro ao buscar reuniões:', meetingsError);
        setAvailableSlots(DEFAULT_TIME_SLOTS);
      } else {
        // Extrai os horários já ocupados
        const occupiedTimes = (meetings || []).map(m => {
          const meetingDate = new Date(m.scheduled_at);
          const hours = meetingDate.getHours().toString().padStart(2, '0');
          const minutes = meetingDate.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        });
        
        // Filtra: todos os horários - os ocupados
        const available = DEFAULT_TIME_SLOTS.filter(
          time => !occupiedTimes.includes(time)
        );
        
        setAvailableSlots(available);
      }
    } catch (err) {
      console.error('Erro ao buscar slots:', err);
      setAvailableSlots(DEFAULT_TIME_SLOTS);
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  // Quando a data muda, busca os horários disponíveis
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
      setSelectedTime(null); // Reset time when date changes
    }
  }, [selectedDate, fetchAvailableSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Determina a origem do lead
      const source = trackingData.partnerCode ? 'indicacao' : 'website';
      
      // Insere o lead no Supabase e retorna o ID
      const { data, error: insertError } = await supabase
        .from('leads')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          partner_code: trackingData.partnerCode,
          source: source,
          utm_source: trackingData.utmSource,
          utm_medium: trackingData.utmMedium,
          utm_campaign: trackingData.utmCampaign,
          utm_term: trackingData.utmTerm,
          utm_content: trackingData.utmContent,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Erro ao salvar lead:', insertError);
        setError('Erro ao enviar. Tente novamente.');
        setIsSubmitting(false);
        return;
      }

      // Salva o ID do lead para criar o agendamento depois
      setSavedLeadId(data?.id || null);
      
      console.log('Lead cadastrado com sucesso!', { 
        id: data?.id,
        ...formData, 
        partnerCode: trackingData.partnerCode,
        source 
      });

      // Salva os dados do lead para enviar depois junto com a reunião
      setSavedLeadData({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        source: source,
      });
      
      setIsSubmitting(false);
      setShowModal(true);
      
      // Limpa formulário
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  // Função para criar o agendamento
  const handleScheduleMeeting = async () => {
    if (!selectedDate || !selectedTime || !savedLeadId || !savedLeadData) return;
    
    setIsScheduling(true);
    
    try {
      // Cria o datetime da reunião
      const [hours, minutes] = selectedTime.split(':');
      
      // Formata a data como YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      

      const scheduledAt = `${year}-${month}-${day}T${hours}:${minutes}:00`;
      
      console.log('Agendando para:', scheduledAt);
      
      // Salva o agendamento no Supabase
      const { error: scheduleError } = await supabase
        .from('meetings')
        .insert({
          lead_id: savedLeadId,
          scheduled_at: scheduledAt,
          status: 'agendado',
        });

      if (scheduleError) {
        console.error('Erro ao agendar reunião:', scheduleError);
        // Mesmo com erro, mostramos sucesso pois o lead já foi salvo
      }
      
      console.log('Reunião agendada:', { 
        leadId: savedLeadId, 
        date: scheduledAt 
      });

      // Formata a data para exibição no email
      const meetingDateFormatted = selectedDate.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      // Dispara notificação por email com dados da reunião
      notifyNewLead({
        id: savedLeadId,
        name: savedLeadData.name,
        email: savedLeadData.email,
        phone: savedLeadData.phone,
        message: savedLeadData.message,
        source: savedLeadData.source,
        partnerCode: trackingData.partnerCode,
        utmSource: trackingData.utmSource,
        utmMedium: trackingData.utmMedium,
        utmCampaign: trackingData.utmCampaign,
        meetingDate: meetingDateFormatted,
        meetingTime: selectedTime,
      }).then((result) => {
        if (result.success) {
          console.log('📧 Email de notificação enviado com sucesso!');
        } else {
          console.warn('⚠️ Falha ao enviar email de notificação:', result.error);
        }
      }).catch((err) => {
        console.error('❌ Erro ao enviar email de notificação:', err);
      });
      
      setIsScheduling(false);
      setScheduleSuccess(true);
    } catch (err) {
      console.error('Erro ao agendar:', err);
      setIsScheduling(false);
      setScheduleSuccess(true); // Mostra sucesso mesmo assim
    }
  };

  // Fecha o modal e reseta estados
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setScheduleSuccess(false);
    setSavedLeadId(null);
    setSavedLeadData(null);
  };

  // Formata data para exibição
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
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
              {t('title')} <span className="text-gradient">{t('titleHighlight')}</span> {t('titleEnd')}
            </h2>
            <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">
              {t('subtitle')}
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
                  {t('form.nameLabel')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder={t('form.namePlaceholder')}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    {t('form.emailLabel')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors"
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>
                
                {/* Telefone */}
                <div>
                  <label 
                    htmlFor="phone" 
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    {t('form.phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors"
                    placeholder={t('form.phonePlaceholder')}
                  />
                </div>
              </div>
              
              {/* Message */}
              <div>
                <label 
                  htmlFor="message" 
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {t('form.messageLabel')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder={t('form.messagePlaceholder')}
                />
              </div>
              
              {/* Error message */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              
              {/* Submit button */}
              <div className="pt-4 flex justify-center">
                <Button 
                  type="submit" 
                  size="lg" 
                  icon={<Send size={18} />} 
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('form.submitting') : t('form.submitButton')}
                </Button>
              </div>
            </form>
          </div>
          
          {/* Trust note */}
          <p className="text-center text-foreground-muted text-sm mt-6">
            {t('trustNote')}
          </p>
        </div>
      </Section>

      {/* Modal de Agendamento */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div 
            className="relative bg-background-secondary border border-card-border rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>

            {scheduleSuccess ? (
              /* Tela de sucesso após agendar */
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle size={48} className="text-green-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {t('scheduling.success.title')}
                </h3>
                <p className="text-foreground-secondary mb-2">
                  {t('scheduling.success.subtitle')}
                </p>
                <p className="text-lg font-semibold text-primary mb-1 capitalize">
                  {selectedDate && formatDate(selectedDate)}
                </p>
                <p className="text-lg font-semibold text-primary mb-6">
                  {t('scheduling.success.at')} {selectedTime}
                </p>
                <p className="text-foreground-muted text-sm mb-6">
                  {t('scheduling.success.emailNote')}
                </p>
                <Button onClick={handleCloseModal} className="w-full">
                  {t('scheduling.success.button')}
                </Button>
              </div>
            ) : (
              /* Calendário de agendamento */
              <>
                <div className="text-center mb-6">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <CalendarIcon size={32} className="text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    {t('scheduling.title')}
                  </h3>
                  <p className="text-foreground-secondary text-sm">
                    {t('scheduling.subtitle')}
                  </p>
                </div>

                {/* Calendário */}
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  timeSlots={isLoadingSlots ? [] : availableSlots}
                  busyDates={busyDates}
                  onMonthChange={fetchBusyDates}
                  isLoadingBusyDates={isLoadingBusyDates}
                  showTimeSlots={true}
                  disableWeekends={true}
                  locale={locale === 'en' ? 'en' : 'pt-BR'}
                />

                {isLoadingSlots && selectedDate && (
                  <p className="text-center text-foreground-muted text-sm mt-4">
                    {t('scheduling.loading')}
                  </p>
                )}

                {/* Botão de confirmar */}
                <div className="mt-6">
                  <Button 
                    onClick={handleScheduleMeeting}
                    disabled={!selectedDate || !selectedTime || isScheduling}
                    fullWidth
                  >
                    {isScheduling ? t('scheduling.confirming') : t('scheduling.confirm')}
                  </Button>
                </div>

                {/* Link para pular agendamento */}
                <button
                  onClick={handleCloseModal}
                  className="w-full mt-3 text-sm text-foreground-muted hover:text-foreground transition-colors"
                >
                  {t('scheduling.skipLink')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
