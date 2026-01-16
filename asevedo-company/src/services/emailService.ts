/**
 * Email Service
 * Serviço para disparo de emails de notificação via EmailJS
 */

import emailjs from '@emailjs/browser';
import { supabase } from '@/components/clients/Supabase';

// Configuração do EmailJS
const EMAILJS_SERVICE_ID = 'service_rxdxbel';
const EMAILJS_TEMPLATE_ID = 'template_mszejw1';
const EMAILJS_PUBLIC_KEY = 'An69VfHyEWx62QRKm';

// Email que receberá as notificações
const NOTIFICATION_EMAIL = 'joao@asevedo.com.br';

export interface LeadData {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  partnerCode?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  // Dados da reunião agendada
  meetingDate?: string | null;
  meetingTime?: string | null;
}

export interface EmailResponse {
  success: boolean;
  error?: string;
}

/**
 * Busca informações do parceiro pelo código
 */
async function getPartnerInfo(partnerCode: string): Promise<{ name: string; phone: string } | null> {
  try {
    // Converte o código para número (campo code é int4)
    const codeNumber = parseInt(partnerCode, 10);
    
    if (isNaN(codeNumber)) {
      console.warn('Código do parceiro inválido (não é número):', partnerCode);
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('name, phone')
      .eq('code', codeNumber)
      .maybeSingle();

    if (error) {
      console.warn('Erro ao buscar parceiro:', codeNumber, error);
      return null;
    }

    if (!data) {
      // Parceiro não encontrado (pode ser RLS ou código inválido)
      return null;
    }

    return { name: data.name, phone: data.phone };
  } catch (err) {
    console.error('Erro ao buscar parceiro:', err);
    return null;
  }
}

/**
 * Envia notificação de novo lead para o email configurado
 */
export async function notifyNewLead(leadData: LeadData): Promise<EmailResponse> {
  try {
    // Formata a data atual
    const now = new Date();
    const timestamp = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Busca informações do parceiro se houver código de indicação
    let partnerInfo: { name: string; phone: string } | null = null;
    if (leadData.partnerCode) {
      partnerInfo = await getPartnerInfo(leadData.partnerCode);
    }

    // Monta informações de indicação
    let indicacaoInfo = 'Sem indicação (acesso direto)';
    if (leadData.partnerCode && partnerInfo) {
      indicacaoInfo = `✅ SIM - Indicado por: ${partnerInfo.name} (${partnerInfo.phone}) | Código: ${leadData.partnerCode}`;
    } else if (leadData.partnerCode) {
      indicacaoInfo = `✅ SIM - Código: ${leadData.partnerCode} (parceiro não encontrado no sistema)`;
    }

    // Prepara os parâmetros do template
    const templateParams = {
      to_email: NOTIFICATION_EMAIL,
      lead_id: leadData.id,
      lead_name: leadData.name,
      lead_email: leadData.email,
      lead_phone: leadData.phone,
      lead_message: leadData.message || 'Nenhuma mensagem',
      lead_source: leadData.source === 'indicacao' ? '👥 Indicação de Parceiro' : '🌐 Website',
      partner_code: leadData.partnerCode || 'N/A',
      partner_name: partnerInfo?.name || 'N/A',
      partner_phone: partnerInfo?.phone || 'N/A',
      indicacao_info: indicacaoInfo,
      utm_source: leadData.utmSource || 'N/A',
      utm_campaign: leadData.utmCampaign || 'N/A',
      // Dados da reunião
      meeting_date: leadData.meetingDate || 'Não agendada',
      meeting_time: leadData.meetingTime || '-',
      meeting_info: leadData.meetingDate 
        ? `📅 ${leadData.meetingDate} às ${leadData.meetingTime}`
        : 'Reunião não foi agendada',
      timestamp: timestamp,
    };

    // Envia o email usando EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('📧 Email enviado com sucesso:', response.status, response.text);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Erro ao enviar email de notificação:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro ao enviar email' 
    };
  }
}

/**
 * Envia notificação de bônus atingido pelo parceiro
 */
export async function notifyBonusUnlocked(partnerInfo: { name: string; phone: string; pix: string; code: string }): Promise<EmailResponse> {
  try {
    const now = new Date();
    const timestamp = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const templateParams = {
      to_email: NOTIFICATION_EMAIL,
      subject: '🎁 BÔNUS ATINGIDO: Meta de 5 Contratos!',
      partner_name: partnerInfo.name,
      partner_phone: partnerInfo.phone,
      partner_pix: partnerInfo.pix,
      partner_code: partnerInfo.code,
      message: `O parceiro ${partnerInfo.name} acaba de bater a meta de 5 contratos e solicitou o resgate do bônus!`,
      timestamp: timestamp,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('📧 Email de bônus enviado com sucesso:', response.status);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email de bônus:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro ao enviar email' };
  }
}

/**
 * Envia notificação de Premiação de Entrada atingida
 */
export async function notifyPrizeUnlocked(partnerInfo: { name: string; phone: string; pix: string; code: string; type: string }): Promise<EmailResponse> {
  try {
    const now = new Date();
    const timestamp = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const templateParams = {
      to_email: NOTIFICATION_EMAIL,
      subject: `🎁 DESAFIO ATINGIDO: ${partnerInfo.type}!`,
      partner_name: partnerInfo.name,
      partner_phone: partnerInfo.phone,
      partner_pix: partnerInfo.pix,
      partner_code: partnerInfo.code,
      message: `O parceiro ${partnerInfo.name} acaba de bater a meta do desafio "${partnerInfo.type}" e solicitou o resgate do prêmio!`,
      timestamp: timestamp,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('📧 Email de premiação enviado com sucesso:', response.status);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email de premiação:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro ao enviar email' };
  }
}
