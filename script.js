/* ═══════════════════════════════════════════════════
   VIVEK & RAJANIGANDHA — WEDDING INVITATION
   Interactive logic: envelope, countdown, petals,
   music, scroll effects, gallery, save-the-date
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── DOM REFERENCES ── */
  const envelope = document.getElementById('envelope');
  const invitationCard = document.getElementById('invitation-card');
  const mainContent = document.getElementById('main-content');
  const heroSection = document.getElementById('hero');

  const musicToggle = document.getElementById('music-toggle');
  const musicIconOn = musicToggle.querySelector('.music-icon-on');
  const musicIconOff = musicToggle.querySelector('.music-icon-off');

  const scrollTopBtn = document.getElementById('scroll-top');
  const saveDateBtn = document.getElementById('save-date-btn');

  const petalsCanvas = document.getElementById('petals-canvas');
  const ctx = petalsCanvas.getContext('2d');

  /* ══════════════════════════════════════
     ENVELOPE OPEN ANIMATION
     ══════════════════════════════════════ */
  let isOpened = false;

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('touchend', function (e) {
    e.preventDefault();
    openEnvelope();
  });

  function openEnvelope() {
    if (isOpened) return;
    isOpened = true;

    envelope.classList.add('opened');

    // Reveal main content after the card animation settles,
    // then pause ~6 seconds so the user can admire the card.
    // Only auto-scroll if user is still viewing the hero area.
    setTimeout(function () {
      mainContent.classList.remove('hidden');
      void mainContent.offsetWidth;
      mainContent.classList.add('visible');

      setTimeout(function () {
        var heroRect = heroSection.getBoundingClientRect();
        var stillOnHero = heroRect.bottom > window.innerHeight * 0.3;
        if (stillOnHero) {
          heroSection.style.minHeight = '80vh';
          document.getElementById('couple').scrollIntoView({ behavior: 'smooth' });
        }
      }, 5000);
    }, 1500);
  }

  /* ══════════════════════════════════════
     COUNTDOWN TIMER
     Target: 03 April 2026, 12:35 PM IST
     ══════════════════════════════════════ */
  const weddingDate = new Date('2026-05-03T12:35:00+05:30');

  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ══════════════════════════════════════
     FLOATING PETALS (Canvas)
     ══════════════════════════════════════ */
  let petals = [];
  const PETAL_COUNT = 35;

  const petalColors = [
    'rgba(201, 135, 135, 0.5)',
    'rgba(224, 168, 168, 0.45)',
    'rgba(245, 200, 200, 0.5)',
    'rgba(201, 169, 110, 0.35)',
    'rgba(240, 220, 200, 0.4)',
    'rgba(255, 230, 220, 0.45)',
  ];

  function resizeCanvas() {
    petalsCanvas.width = window.innerWidth;
    petalsCanvas.height = window.innerHeight;
  }

  function createPetal() {
    return {
      x: Math.random() * petalsCanvas.width,
      y: Math.random() * petalsCanvas.height - petalsCanvas.height,
      size: Math.random() * 8 + 4,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: Math.random() * 0.4 - 0.2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 - 1,
      opacity: Math.random() * 0.5 + 0.3,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  function initPetals() {
    petals = [];
    for (let i = 0; i < PETAL_COUNT; i++) {
      const p = createPetal();
      p.y = Math.random() * petalsCanvas.height;
      petals.push(p);
    }
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;

    ctx.beginPath();
    ctx.fillStyle = p.color;
    // Organic petal shape via two quadratic curves
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(p.size * 0.8, -p.size * 0.6, 0, -p.size);
    ctx.quadraticCurveTo(-p.size * 0.8, -p.size * 0.6, 0, 0);
    ctx.fill();

    ctx.restore();
  }

  function animatePetals() {
    ctx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.y += p.speedY;
      p.wobble += p.wobbleSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * 0.5;
      p.rotation += p.rotationSpeed;

      // Reset if off-screen
      if (p.y > petalsCanvas.height + 20) {
        petals[i] = createPetal();
        petals[i].y = -10;
      }

      drawPetal(p);
    }

    requestAnimationFrame(animatePetals);
  }

  resizeCanvas();
  initPetals();
  animatePetals();

  window.addEventListener('resize', function () {
    resizeCanvas();
  });

  /* ══════════════════════════════════════
     BACKGROUND MUSIC
     Dreamy ambient pad with arpeggiated melody,
     soft reverb, and gentle volume swells.
     ══════════════════════════════════════ */
  let audioContext = null;
  let isMusicPlaying = false;
  let musicNodes = [];
  let masterGain = null;
  let arpeggioInterval = null;

  function createReverb(ac, duration, decay) {
    const rate = ac.sampleRate;
    const length = rate * duration;
    const impulse = ac.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    const conv = ac.createConvolver();
    conv.buffer = impulse;
    return conv;
  }

  function startPadVoice(ac, freq, detuneCents, gain, destNode) {
    const osc = ac.createOscillator();
    const oscGain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    osc.detune.setValueAtTime(detuneCents, ac.currentTime);
    oscGain.gain.setValueAtTime(0, ac.currentTime);
    oscGain.gain.linearRampToValueAtTime(gain, ac.currentTime + 3);
    osc.connect(oscGain);
    oscGain.connect(destNode);
    osc.start();
    musicNodes.push(osc, oscGain);

    // Gentle LFO for volume swell
    const lfo = ac.createOscillator();
    const lfoGain = ac.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.15 + Math.random() * 0.1, ac.currentTime);
    lfoGain.gain.setValueAtTime(gain * 0.3, ac.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(oscGain.gain);
    lfo.start();
    musicNodes.push(lfo, lfoGain);
  }

  function startMusic() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ac = audioContext;

    masterGain = ac.createGain();
    masterGain.gain.setValueAtTime(0, ac.currentTime);
    masterGain.gain.linearRampToValueAtTime(1, ac.currentTime + 2);

    const reverb = createReverb(ac, 3, 2.5);
    const reverbGain = ac.createGain();
    reverbGain.gain.setValueAtTime(0.4, ac.currentTime);

    const dryGain = ac.createGain();
    dryGain.gain.setValueAtTime(0.6, ac.currentTime);

    reverb.connect(reverbGain);
    reverbGain.connect(masterGain);
    dryGain.connect(masterGain);
    masterGain.connect(ac.destination);
    musicNodes.push(masterGain, reverb, reverbGain, dryGain);

    const padBus = ac.createGain();
    padBus.gain.setValueAtTime(1, ac.currentTime);
    padBus.connect(dryGain);
    padBus.connect(reverb);
    musicNodes.push(padBus);

    // Warm pad chord: Cmaj7 spread across octaves
    var padVoices = [
      { freq: 130.81, detune: 0, vol: 0.04 },    // C3
      { freq: 164.81, detune: 5, vol: 0.03 },     // E3 slightly detuned
      { freq: 196.00, detune: -3, vol: 0.03 },    // G3
      { freq: 246.94, detune: 4, vol: 0.025 },    // B3
      { freq: 261.63, detune: -5, vol: 0.03 },    // C4
      { freq: 329.63, detune: 7, vol: 0.02 },     // E4
      { freq: 392.00, detune: -4, vol: 0.02 },    // G4
      { freq: 523.25, detune: 3, vol: 0.015 },    // C5 (shimmer)
    ];

    padVoices.forEach(function (v) {
      startPadVoice(ac, v.freq, v.detune, v.vol, padBus);
    });

    // Soft arpeggiated melody on top
    var melodyNotes = [
      523.25, 659.26, 783.99, 659.26,  // C5 E5 G5 E5
      493.88, 659.26, 783.99, 987.77,  // B4 E5 G5 B5
      523.25, 783.99, 659.26, 523.25,  // C5 G5 E5 C5
      392.00, 493.88, 523.25, 659.26,  // G4 B4 C5 E5
    ];
    var noteIndex = 0;

    function playMelodyNote() {
      if (!isMusicPlaying) return;
      var freq = melodyNotes[noteIndex % melodyNotes.length];
      noteIndex++;

      var osc = ac.createOscillator();
      var env = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      osc.detune.setValueAtTime(Math.random() * 6 - 3, ac.currentTime);

      // Bell-like envelope: quick attack, long decay
      env.gain.setValueAtTime(0, ac.currentTime);
      env.gain.linearRampToValueAtTime(0.035, ac.currentTime + 0.08);
      env.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 3.5);

      osc.connect(env);
      env.connect(dryGain);
      env.connect(reverb);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 4);
    }

    // Play a note every 1.8–2.5 seconds for a gentle, unhurried feel
    function scheduleMelody() {
      playMelodyNote();
      var nextDelay = 1800 + Math.random() * 700;
      arpeggioInterval = setTimeout(scheduleMelody, nextDelay);
    }

    setTimeout(scheduleMelody, 2000);

    isMusicPlaying = true;
    musicIconOn.style.display = 'block';
    musicIconOff.style.display = 'none';
  }

  function stopMusic() {
    if (arpeggioInterval) {
      clearTimeout(arpeggioInterval);
      arpeggioInterval = null;
    }

    if (masterGain) {
      masterGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);
    }

    setTimeout(function () {
      musicNodes.forEach(function (node) {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) { /* already stopped */ }
      });
      musicNodes = [];
      masterGain = null;
    }, 1800);

    isMusicPlaying = false;
    musicIconOn.style.display = 'none';
    musicIconOff.style.display = 'block';
  }

  musicToggle.addEventListener('click', function () {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  /* ══════════════════════════════════════
     SCROLL-TO-TOP BUTTON
     ══════════════════════════════════════ */
  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ══════════════════════════════════════
     SCROLL REVEAL ANIMATIONS
     Uses IntersectionObserver for performance
     ══════════════════════════════════════ */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ══════════════════════════════════════
     SAVE THE DATE — .ics DOWNLOAD
     ══════════════════════════════════════ */
  saveDateBtn.addEventListener('click', function () {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VivekWedsRajanigandha//EN',
      'BEGIN:VEVENT',
      'DTSTART:20260503T070500Z',
      'DTEND:20260503T140500Z',
      'SUMMARY:Vivek & Rajanigandha Wedding Ceremony',
      'DESCRIPTION:Wedding Ceremony of Vivek Umesh Dalvi & Rajanigandha Ravindra Patil. Muhurat at 12:35 PM IST.',
      'LOCATION:Hotel Park Tree, Near Indian Oil Petrol Pump Karveer, Mumbai - Bangalore Express Highway, Kaneriwadi, Kolhapur',
      'URL:https://maps.app.goo.gl/rgEEqd5tdfeFNLCY9',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VivekWedsRajanigandha.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

})();
