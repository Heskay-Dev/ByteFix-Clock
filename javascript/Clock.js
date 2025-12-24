 // --- Clock Settings & Elements ---
    const hhmmEl = document.getElementById('hhmm');
    const ssEl = document.getElementById('ss');
    const ampmEl = document.getElementById('ampm');
    const dateEl = document.getElementById('dateString');
    const tzEl = document.getElementById('tzString');
    const toggle24Btn = document.getElementById('toggle24');
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const rootCard = document.querySelector('.card');

    let use24 = false;
    let dark = false;

    // Format helpers
    function two(n){ return n < 10 ? '0' + n : String(n); }

    function updateClock(){
      const now = new Date();

      // timezone name (browser)
      const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local Time';
      tzEl.textContent = `Timezone: ${tzName}`;

      // time components
      let hours = now.getHours();
      const minutes = two(now.getMinutes());
      const seconds = two(now.getSeconds());

      let ampm = 'AM';
      if (!use24) {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;
      }
      const hoursStr = use24 ? two(hours) : String(hours);

      hhmmEl.textContent = `${hoursStr}:${minutes}`;
      ssEl.textContent = `:${seconds}`;
      ampmEl.textContent = use24 ? '' : ampm;

      // date string
      const dateStr = now.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      dateEl.textContent = dateStr;
    }

    // Toggle 24-hour / 12-hour
    toggle24Btn.addEventListener('click', () => {
      use24 = !use24;
      toggle24Btn.textContent = use24 ? 'Use 12-hour' : 'Use 24-hour';
      updateClock();
    });

    // Theme toggle (light/dark)
    toggleThemeBtn.addEventListener('click', () => {
      dark = !dark;
      if (dark) {
        document.documentElement.style.background = '#05121b';
        document.body.style.background = '#05121b';
        document.body.classList.add('dark');
        toggleThemeBtn.textContent = 'Light Mode';
      } else {
        document.documentElement.style.background = '';
        document.body.style.background = '';
        document.body.classList.remove('dark');
        toggleThemeBtn.textContent = 'Dark Mode';
      }
    });

    // Initialize and loop
    updateClock();
    // Sync update to the start of next second for smoother ticks
    const msToNextSecond = 1000 - (Date.now() % 1000);
    setTimeout(() => {
      updateClock();
      setInterval(updateClock, 1000);
    }, msToNextSecond);

    // Accessibility: announce time on load (screen readers)
    window.addEventListener('load', () => {
      setTimeout(() => {
        const now = new Date();
        const spoken = now.toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'});
        // This minimal aria-live is already on timeString; you could also use speechSynthesis if desired.
        console.log('Current time:', spoken);
      }, 500);
    });