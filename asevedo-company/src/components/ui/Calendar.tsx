'use client';

/**
 * Calendar Component
 * Interactive calendar for date selection with time slots
 * Used for scheduling meetings after lead submission
 * Supports PT-BR and EN locales
 */

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { Button } from './Button';

// Translations
const translations = {
  'pt-BR': {
    dayNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    availableSlots: 'Horários disponíveis',
    previousMonth: 'Mês anterior',
    nextMonth: 'Próximo mês',
  },
  'en': {
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableSlots: 'Available times',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
  },
};

// Default available time slots
const DEFAULT_TIME_SLOTS = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
];

// Tipo para informação de ocupação de datas
export interface DateOccupancy {
  date: string; // YYYY-MM-DD
  slotsOccupied: number;
  totalSlots: number;
}

interface CalendarProps {
  /** Currently selected date */
  selectedDate: Date | null;
  /** Callback when date is selected */
  onDateSelect: (date: Date) => void;
  /** Currently selected time */
  selectedTime: string | null;
  /** Callback when time is selected */
  onTimeSelect: (time: string) => void;
  /** Available time slots */
  timeSlots?: string[];
  /** Dates with meetings (to show indicators) */
  busyDates?: DateOccupancy[];
  /** Callback when month changes (to fetch new busy dates) */
  onMonthChange?: (startDate: Date, endDate: Date) => void;
  /** Loading state for busy dates */
  isLoadingBusyDates?: boolean;
  /** Minimum selectable date (default: today) */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Disable weekends */
  disableWeekends?: boolean;
  /** Show time slots */
  showTimeSlots?: boolean;
  /** Locale for translations (pt-BR or en) */
  locale?: 'pt-BR' | 'en';
  /** Custom class name */
  className?: string;
}

export function Calendar({
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  timeSlots = DEFAULT_TIME_SLOTS,
  busyDates = [],
  onMonthChange,
  isLoadingBusyDates = false,
  minDate,
  maxDate,
  disableWeekends = true,
  showTimeSlots = true,
  locale = 'pt-BR',
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get translations for current locale
  const t = translations[locale] || translations['pt-BR'];
  const dateLocale = locale === 'en' ? 'en-US' : 'pt-BR';

  // Notifica quando o mês muda para buscar novos dados
  useEffect(() => {
    if (onMonthChange) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      onMonthChange(startDate, endDate);
    }
  }, [currentMonth, onMonthChange]);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay(); // Sunday = 0
    
    const days: (Date | null)[] = [];
    
    // Padding for days before first of month
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [currentMonth]);

  // Check if a date is selectable
  const isDateSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check minimum date
    const minCheck = minDate ? date >= minDate : date >= today;
    
    // Check maximum date
    const maxCheck = maxDate ? date <= maxDate : true;
    
    // Check weekends
    const dayOfWeek = date.getDay();
    const weekendCheck = disableWeekends ? (dayOfWeek !== 0 && dayOfWeek !== 6) : true;
    
    return minCheck && maxCheck && weekendCheck;
  };

  // Get occupancy info for a date
  const getDateOccupancy = (date: Date): DateOccupancy | undefined => {
    const dateStr = date.toISOString().split('T')[0];
    return busyDates.find(d => d.date === dateStr);
  };

  // Check if date is fully booked
  const isFullyBooked = (date: Date): boolean => {
    const occupancy = getDateOccupancy(date);
    if (!occupancy) return false;
    return occupancy.slotsOccupied >= occupancy.totalSlots;
  };

  // Check if date has some bookings but not full
  const hasBookings = (date: Date): boolean => {
    const occupancy = getDateOccupancy(date);
    if (!occupancy) return false;
    return occupancy.slotsOccupied > 0 && occupancy.slotsOccupied < occupancy.totalSlots;
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(dateLocale, { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Check if can go to previous month
  const canGoPrevious = () => {
    const today = new Date();
    return currentMonth.getMonth() !== today.getMonth() || 
           currentMonth.getFullYear() !== today.getFullYear();
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious()}
          className={cn(
            'p-2 rounded-lg transition-colors',
            canGoPrevious() 
              ? 'hover:bg-background text-foreground-muted hover:text-foreground' 
              : 'text-foreground-muted/30 cursor-not-allowed'
          )}
          aria-label={t.previousMonth}
        >
          <ChevronLeft size={20} />
        </button>
        
        <span className="font-semibold text-foreground capitalize">
          {currentMonth.toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' })}
        </span>
        
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-background rounded-lg transition-colors text-foreground-muted hover:text-foreground"
          aria-label={t.nextMonth}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {t.dayNames.map((day: string) => (
          <div 
            key={day} 
            className="text-center text-xs font-medium text-foreground-muted py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const selectable = isDateSelectable(date);
          const selected = isSelected(date);
          const today = isToday(date);
          const fullyBooked = isFullyBooked(date);
          const hasSomeBookings = hasBookings(date);

          // Dias cheios não são selecionáveis
          const canSelect = selectable && !fullyBooked;

          return (
            <button
              key={date.toISOString()}
              disabled={!canSelect}
              onClick={() => canSelect && onDateSelect(date)}
              className={cn(
                'aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all relative',
                // Não selecionável (passado, fim de semana)
                !selectable && 'text-foreground-muted/30 cursor-not-allowed',
                // Cheio - acinzentado
                selectable && fullyBooked && 'text-foreground-muted/50 cursor-not-allowed bg-foreground-muted/10 line-through',
                // Normal - pode selecionar
                canSelect && !selected && 'hover:bg-primary/20 cursor-pointer text-foreground',
                // Selecionado
                selected && 'bg-primary text-white font-semibold',
                // Hoje
                today && !selected && 'ring-1 ring-primary/50'
              )}
            >
              {date.getDate()}
              {/* Indicador de ocupação parcial */}
              {hasSomeBookings && !selected && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
              {/* Indicador de cheio */}
              {fullyBooked && !selected && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-red-500/60" />
              )}
            </button>
          );
        })}
      </div>

      {/* Time Slots */}
      {showTimeSlots && selectedDate && (
        <div className="animate-fade-in border-t border-card-border pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-primary" />
            <span className="font-medium text-foreground text-sm">
              {t.availableSlots}
            </span>
          </div>
          <p className="text-xs text-foreground-muted mb-3 capitalize">
            {formatDate(selectedDate)}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => onTimeSelect(time)}
                className={cn(
                  'py-2 px-3 rounded-lg text-sm font-medium transition-all',
                  selectedTime === time
                    ? 'bg-primary text-white'
                    : 'bg-background border border-card-border text-foreground hover:border-primary'
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Standalone Calendar Card Component (for embedding in pages)
interface CalendarCardProps {
  title?: string;
  subtitle?: string;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  className?: string;
}

export function CalendarCard({
  title = 'Agende uma Reunião',
  subtitle = 'Escolha o melhor dia e horário para conversarmos.',
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  onConfirm,
  isLoading = false,
  className,
}: CalendarCardProps) {
  return (
    <div className={cn(
      'bg-background-secondary border border-card-border rounded-2xl p-6',
      className
    )}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-foreground-secondary text-sm">{subtitle}</p>
      </div>

      {/* Calendar */}
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        selectedTime={selectedTime}
        onTimeSelect={onTimeSelect}
      />

      {/* Confirm Button */}
      <div className="mt-6">
        <Button
          onClick={onConfirm}
          disabled={!selectedDate || !selectedTime || isLoading}
          fullWidth
        >
          {isLoading ? 'Agendando...' : 'Confirmar Agendamento'}
        </Button>
      </div>
    </div>
  );
}

export default Calendar;
