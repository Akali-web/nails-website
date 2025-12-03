// Reservation Multi-Step Wizard Component
// Pure JavaScript implementation with Alpine.js

document.addEventListener('alpine:init', () => {
  Alpine.data('reservationWizard', () => ({
    // Step management
    step: 1,
    isSuccess: false,
    isSubmitting: false,

    // Services
    services: [
      { id: '1', name: 'Klasická Manikúra', price: 650, duration: '45 min' },
      { id: '2', name: 'Zpevnění (BIAB)', price: 950, duration: '75 min' },
      { id: '3', name: 'Spa Pedikúra', price: 1200, duration: '90 min' },
      { id: '4', name: 'Gelová Modeláž', price: 1600, duration: '120 min' },
      { id: '5', name: 'Nail Art & Zdobení', price: 150, duration: 'za nehet' },
      { id: '6', name: 'Japonská Manikúra', price: 700, duration: '60 min' },
    ],

    // Time slots
    timeSlots: ['09:00', '10:00', '11:00', '13:00', '14:30', '16:00', '17:30'],

    // Calendar constants
    czDaysHeader: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
    czMonths: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'],

    // Form state
    selectedServiceId: '',
    selectedDate: null,
    selectedTime: '',
    viewDate: new Date(),
    formData: {
      name: '',
      phone: '',
      email: '',
      message: ''
    },
    errors: {},

    // Computed properties
    get selectedService() {
      return this.services.find(s => s.id === this.selectedServiceId);
    },

    get currentYear() {
      return this.viewDate.getFullYear();
    },

    get currentMonth() {
      return this.viewDate.getMonth();
    },

    get calendarDays() {
      return this.getMonthData(this.currentYear, this.currentMonth);
    },

    // Methods
    getMonthData(year, month) {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      let startDayOfWeek = firstDay.getDay() - 1;
      if (startDayOfWeek === -1) startDayOfWeek = 6;

      const daysInMonth = lastDay.getDate();
      const days = [];

      for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }

      return days;
    },

    handlePrevMonth() {
      const today = new Date();
      if (this.viewDate.getMonth() === today.getMonth() && this.viewDate.getFullYear() === today.getFullYear()) return;

      this.viewDate = new Date(this.currentYear, this.currentMonth - 1, 1);
    },

    handleNextMonth() {
      this.viewDate = new Date(this.currentYear, this.currentMonth + 1, 1);
    },

    handleDateClick(day) {
      const newDate = new Date(this.currentYear, this.currentMonth, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (newDate < today) return;

      this.selectedDate = newDate;
      this.selectedTime = '';
    },

    isDateSelected(day) {
      if (!this.selectedDate) return false;
      return this.selectedDate.getDate() === day &&
             this.selectedDate.getMonth() === this.currentMonth &&
             this.selectedDate.getFullYear() === this.currentYear;
    },

    isDateDisabled(day) {
      const checkDate = new Date(this.currentYear, this.currentMonth, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return checkDate < today;
    },

    handleNextStep() {
      if (this.step === 1) {
        if (!this.selectedServiceId) {
          this.errors = { service: 'Prosím vyberte službu' };
          return;
        }
        this.errors = {};
        this.step = 2;
      } else if (this.step === 2) {
        if (!this.selectedDate || !this.selectedTime) {
          this.errors = { datetime: 'Vyberte prosím datum a čas' };
          return;
        }
        this.errors = {};
        this.step = 3;
      }
    },

    handlePrevStep() {
      if (this.step > 1) {
        this.step = Math.max(1, this.step - 1);
      }
    },

    sanitizeInput(input) {
      return input.replace(/[<>{}()]/g, "").trim();
    },

    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    validatePhone(phone) {
      const re = /^[+]?[\d\s]{9,15}$/;
      return re.test(phone);
    },

    handleSubmit(e) {
      e.preventDefault();
      const newErrors = {};
      const sanitizedData = {
        name: this.sanitizeInput(this.formData.name),
        phone: this.sanitizeInput(this.formData.phone),
        email: this.sanitizeInput(this.formData.email),
        message: this.sanitizeInput(this.formData.message)
      };

      if (!sanitizedData.name) newErrors.name = 'Jméno je povinné';
      if (!sanitizedData.phone || !this.validatePhone(sanitizedData.phone)) newErrors.phone = 'Platné telefonní číslo je povinné';
      if (!sanitizedData.email || !this.validateEmail(sanitizedData.email)) newErrors.email = 'Platný email je povinný';

      if (Object.keys(newErrors).length > 0) {
        this.errors = newErrors;
        return;
      }

      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        console.log('Reservation submitted:', {
          service: this.selectedService,
          date: this.selectedDate,
          time: this.selectedTime,
          ...sanitizedData
        });
        this.isSubmitting = false;
        this.isSuccess = true;
      }, 1500);
    },

    resetForm() {
      this.isSuccess = false;
      this.step = 1;
      this.selectedServiceId = '';
      this.selectedDate = null;
      this.selectedTime = '';
      this.viewDate = new Date();
      this.formData = { name: '', phone: '', email: '', message: '' };
      this.errors = {};
    }
  }));
});

// Render the reservation component when DOM is ready
function renderReservation() {
  const reservationContainer = document.getElementById('reservation');
  if (!reservationContainer) return;

  reservationContainer.innerHTML = `
    <section x-data="reservationWizard" class="py-32 bg-brand-dark text-brand-cream relative overflow-hidden">
      <div class="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      <div class="absolute top-0 left-0 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="grid lg:grid-cols-2 gap-20 items-start">

          <!-- Left Column - Header -->
          <div class="space-y-12 lg:sticky lg:top-32">
            <div>
              <div class="flex items-center gap-4 mb-6">
                <span class="h-[1px] w-12 bg-brand-gold"></span>
                <span class="text-brand-gold text-xs uppercase tracking-[0.3em]">Rezervace</span>
              </div>
              <h2 class="font-serif text-5xl md:text-7xl mb-8 leading-none">
                Váš Čas <br /> <span class="italic text-brand-taupe">Pro Sebe</span>
              </h2>
              <p class="text-gray-400 text-lg font-light leading-relaxed max-w-md">
                Vyberte si proceduru, která vám vyhovuje, a najděte si termín v našem exkluzivním kalendáři.
              </p>
            </div>

            <div class="hidden lg:block space-y-6 text-sm font-light text-gray-400 border-t border-white/5 pt-8">
              <div class="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-brand-gold shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
                <p>Používáme pouze prémiové materiály šetrné k vašemu zdraví.</p>
              </div>
              <div class="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-brand-gold shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <p>Prosíme o dochvilnost. Váš termín je rezervován výhradně pro vás.</p>
              </div>
            </div>
          </div>

          <!-- Right Column - Form Card -->
          <div class="bg-white/5 border border-white/10 backdrop-blur-md relative min-h-[600px] flex flex-col transition-all duration-500 rounded-sm">

            <!-- Progress bar -->
            <div x-show="!isSuccess" class="flex border-b border-white/10">
              <template x-for="s in [1, 2, 3]" :key="s">
                <div class="flex-1 h-1 transition-all duration-500"
                     :class="step >= s ? 'bg-brand-gold' : 'bg-transparent'"></div>
              </template>
            </div>

            <!-- Success State -->
            <div x-show="isSuccess" class="flex-grow flex flex-col items-center justify-center text-center p-12">
              <div class="w-20 h-20 border border-brand-gold rounded-full flex items-center justify-center mb-8 relative">
                <div class="absolute inset-0 bg-brand-gold/20 rounded-full animate-pulse"></div>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3 class="font-serif text-4xl mb-4 italic">Potvrzeno</h3>
              <p class="text-gray-400 mb-8 max-w-xs leading-relaxed">
                Vaše rezervace na <span class="text-white" x-text="selectedService?.name"></span> byla úspěšně odeslána.
                <br/><br/>
                Potvrzení vám dorazí na email.
              </p>
              <button @click="resetForm()" class="text-xs uppercase tracking-widest text-brand-gold hover:text-white transition-colors border-b border-brand-gold pb-1">
                Nová Rezervace
              </button>
            </div>

            <!-- Form Steps -->
            <div x-show="!isSuccess" class="p-8 md:p-10 flex flex-col flex-grow">

              <div class="mb-8 flex justify-between items-end">
                <span class="text-[10px] uppercase tracking-widest text-gray-500">
                  Krok 0<span x-text="step"></span> / 03
                </span>
                <h3 class="font-serif text-2xl italic">
                  <span x-show="step === 1">Výběr Služby</span>
                  <span x-show="step === 2">Datum a Čas</span>
                  <span x-show="step === 3">Vaše Údaje</span>
                </h3>
              </div>

              <!-- STEP 1: Service Selection -->
              <div x-show="step === 1" class="space-y-4 flex-grow">
                <template x-for="service in services" :key="service.id">
                  <div @click="selectedServiceId = service.id"
                       class="p-4 border cursor-pointer transition-all duration-300 flex justify-between items-center group"
                       :class="selectedServiceId === service.id ? 'border-brand-gold bg-brand-gold/10' : 'border-white/10 hover:border-white/30 hover:bg-white/5'">
                    <div>
                      <h4 class="text-lg transition-colors"
                          :class="selectedServiceId === service.id ? 'text-brand-gold font-serif italic' : 'text-white'"
                          x-text="service.name"></h4>
                      <span class="text-xs text-gray-500" x-text="service.duration"></span>
                    </div>
                    <span class="text-sm tracking-widest"
                          :class="selectedServiceId === service.id ? 'text-white' : 'text-gray-500'"
                          x-text="service.price + ' Kč'"></span>
                  </div>
                </template>
                <p x-show="errors.service" class="text-red-400 text-xs mt-2" x-text="errors.service"></p>
              </div>

              <!-- STEP 2: Date & Time -->
              <div x-show="step === 2" class="space-y-8 flex-grow">
                <!-- Month Navigation -->
                <div class="flex justify-between items-center mb-4 px-2">
                  <button @click="handlePrevMonth()" class="p-2 text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <span class="text-sm uppercase tracking-[0.2em] font-light">
                    <span x-text="czMonths[currentMonth]"></span> <span x-text="currentYear"></span>
                  </span>
                  <button @click="handleNextMonth()" class="p-2 text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>

                <!-- Calendar Grid -->
                <div class="bg-[#1a1a1a] p-4 rounded-sm border border-white/5">
                  <div class="grid grid-cols-7 mb-4">
                    <template x-for="day in czDaysHeader" :key="day">
                      <div class="text-center text-[10px] uppercase text-gray-500 font-bold" x-text="day"></div>
                    </template>
                  </div>

                  <div class="grid grid-cols-7 gap-y-4 gap-x-2">
                    <template x-for="(day, index) in calendarDays" :key="index">
                      <div>
                        <button x-show="day !== null"
                                @click="handleDateClick(day)"
                                :disabled="isDateDisabled(day)"
                                class="aspect-square flex items-center justify-center text-sm font-serif transition-all duration-300 relative w-full"
                                :class="{
                                  'text-white/10 cursor-not-allowed': isDateDisabled(day),
                                  'text-white hover:text-brand-gold': !isDateDisabled(day) && !isDateSelected(day),
                                  'text-brand-dark bg-brand-gold font-bold scale-110 shadow-lg z-10': isDateSelected(day)
                                }"
                                x-text="day"></button>
                      </div>
                    </template>
                  </div>
                </div>

                <!-- Time Selection -->
                <div class="transition-all duration-500"
                     :class="selectedDate ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'">
                  <label class="block text-[10px] uppercase tracking-widest text-gray-500 mb-4 pt-4 border-t border-white/10">
                    Dostupné Časy
                  </label>
                  <div class="grid grid-cols-4 gap-3">
                    <template x-for="time in timeSlots" :key="time">
                      <button @click="selectedTime = time"
                              class="py-2 px-1 text-xs border transition-all duration-300"
                              :class="selectedTime === time ? 'border-brand-gold bg-brand-gold text-brand-dark' : 'border-white/20 text-gray-400 hover:border-white hover:text-white'"
                              x-text="time"></button>
                    </template>
                  </div>
                </div>
                <p x-show="errors.datetime" class="text-red-400 text-xs text-center mt-2" x-text="errors.datetime"></p>
              </div>

              <!-- STEP 3: Contact Form -->
              <div x-show="step === 3" class="space-y-6 flex-grow">
                <div class="bg-white/5 p-4 border-l-2 border-brand-gold mb-6">
                  <p class="text-xs text-gray-400 mb-1">Rekapitulace</p>
                  <p class="text-white font-serif text-lg italic" x-text="selectedService?.name"></p>
                  <p class="text-sm text-brand-gold">
                    <span x-text="selectedDate?.getDate()"></span>.
                    <span x-text="czMonths[selectedDate?.getMonth()]"></span>
                    <span x-text="selectedDate?.getFullYear()"></span>
                    <span class="mx-2">•</span>
                    <span x-text="selectedTime"></span>
                  </p>
                </div>

                <div class="group relative">
                  <input type="text" name="name" x-model="formData.name" placeholder=" " autocomplete="name"
                         class="block w-full px-0 py-3 bg-transparent border-b border-gray-700 focus:border-brand-gold focus:outline-none text-white transition-colors peer" />
                  <label class="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-gold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-brand-gold cursor-text">Jméno a Příjmení *</label>
                  <p x-show="errors.name" class="text-red-400 text-xs mt-1 absolute" x-text="errors.name"></p>
                </div>

                <div class="grid grid-cols-2 gap-6">
                  <div class="group relative">
                    <input type="tel" name="phone" x-model="formData.phone" placeholder=" " autocomplete="tel"
                           class="block w-full px-0 py-3 bg-transparent border-b border-gray-700 focus:border-brand-gold focus:outline-none text-white transition-colors peer" />
                    <label class="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-gold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-brand-gold cursor-text">Telefon *</label>
                    <p x-show="errors.phone" class="text-red-400 text-xs mt-1 absolute" x-text="errors.phone"></p>
                  </div>
                  <div class="group relative">
                    <input type="email" name="email" x-model="formData.email" placeholder=" " autocomplete="email"
                           class="block w-full px-0 py-3 bg-transparent border-b border-gray-700 focus:border-brand-gold focus:outline-none text-white transition-colors peer" />
                    <label class="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-brand-gold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-brand-gold cursor-text">Email *</label>
                    <p x-show="errors.email" class="text-red-400 text-xs mt-1 absolute" x-text="errors.email"></p>
                  </div>
                </div>

                <div class="group relative pt-4">
                  <textarea name="message" x-model="formData.message" rows="2" placeholder=" "
                            class="block w-full px-0 py-3 bg-transparent border-b border-gray-700 focus:border-brand-gold focus:outline-none text-white transition-colors peer resize-none"></textarea>
                  <label class="absolute left-0 top-7 text-gray-500 text-sm transition-all peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-gold peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-brand-gold cursor-text">Poznámka (Volitelné)</label>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <button x-show="step > 1" @click="handlePrevStep()"
                        class="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  Zpět
                </button>
                <div x-show="step === 1"></div>

                <button x-show="step < 3" @click="handleNextStep()"
                        class="px-8 py-3 bg-white text-brand-dark uppercase text-xs font-bold tracking-[0.2em] hover:bg-brand-gold hover:text-white transition-all duration-300 flex items-center gap-2">
                  Pokračovat
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>

                <button x-show="step === 3" @click="handleSubmit($event)"
                        :disabled="isSubmitting"
                        class="px-8 py-3 bg-brand-gold text-white uppercase text-xs font-bold tracking-[0.2em] hover:bg-white hover:text-brand-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-wait flex items-center gap-2">
                  <span x-text="isSubmitting ? 'Odesílám...' : 'Dokončit'"></span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderReservation);
} else {
  renderReservation();
}
