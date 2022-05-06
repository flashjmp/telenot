/* eslint-disable object-curly-newline */
/* eslint radix: ["error", "as-needed"] */
const config = {
  LogLevel: process.env.LOGLEVEL || 'info',
  Connection: {
    mqttConfig: {
      host: process.env.MQTTHOST,
      port: parseInt(process.env.MQTTPORT),
      username: process.env.MQTTUSER,
      password: process.env.MQTTPASSWORD,
      publishTopic: process.env.PUBLISHTOPIC || 'telenot/alarm/publish',
      commandTopic: process.env.COMMANDTOPIC || 'telenot/alarm/command',
      stateTopic: process.env.STATETOPIC || 'telenot/alarm/state',
    },
    telnetConfig: {
      host: process.env.TELNETHOST,
      port: parseInt(process.env.TELNETPORT),
    },
  },
  Telenot: {
    SICHERUNGSBEREICH: {
      name: 'SICHERUNGSBEREICH',
      offset: 10,
      positions: [
        { hex: 0x0, name: 'Sicherung1', topic: '' },
      ],
    },
    SICHERUNGSBEREICH2: {
      name: 'SICHERUNGSBEREICH2',
      offset: 10,
      positions: [
        { hex: 0x0, name: 'Home', topic: '' },
      ],
    },
    MELDEBEREICHE: {
      name: 'MELDEBEREICHE',
      offset: 10,
      positions: [
        { hex: 0x80, name: 'Riegelkontakt Eingang', topic: 'telenot/alarm/mb/rk_eingang', inverted: true },
        { hex: 0x81, name: 'Magnetkontakt Eingang', topic: 'telenot/alarm/mb/mk_eingngang', inverted: true },
        { hex: 0x82, name: 'Riegelkontakt HWR', topic: 'telenot/alarm/mb/rk_hwr', inverted: true },
        { hex: 0x83, name: 'Magnetkontakt HWR', topic: 'telenot/alarm/mb/mk_hwr', inverted: true },
        { hex: 0x84, name: 'Ueberfall', topic: 'telenot/alarm/mb/ueberfall', inverted: true },
        { hex: 0x85, name: 'Tuer Essen/Wohnen', topic: 'telenot/alarm/mb/fenster_eg_essen_wz', inverted: true },
        { hex: 0x86, name: 'Fenster Gaeste WC', topic: 'telenot/alarm/mb/fenster_eg_gaeste_wc', inverted: true },
        { hex: 0x87, name: 'Fenster Gaestezimmer', topic: 'telenot/alarm/mb/fenster_eg_gast', inverted: true },
        { hex: 0x88, name: 'Sabotage', topic: 'telenot/alarm/mb/sabotage', inverted: true },
        { hex: 0x89, name: 'Fenster OG Kinder', topic: 'telenot/alarm/mb/fenster_og_kinder', inverted: true },
        { hex: 0x8a, name: 'Fenster OG Schlafen', topic: 'telenot/alarm/mb/fenster_og_schlafen', inverted: true },
        { hex: 0x8b, name: 'Fenster OG Bad', topic: 'telenot/alarm/mb/fenster_og_bad', inverted: true },
        { hex: 0x8c, name: 'BWM HWR', topic: 'telenot/alarm/mb/bwm_eg_hwr', inverted: true },
        { hex: 0x8d, name: 'BWM Flur EG', topic: 'telenot/alarm/mb/bwm_eg_flur', inverted: true },
        { hex: 0x8e, name: 'BWM Flur OG', topic: 'telenot/alarm/mb/bwm_og_flur', inverted: true },        
        { hex: 0x40, name: 'Unscharf', topic: 'telenot/alarm/mb/unscharf', inverted: false },
        { hex: 0x41, name: 'Intern scharf', topic: 'telenot/alarm/mb/intern_scharf', inverted: false },
        { hex: 0x42, name: 'Extern scharf', topic: 'telenot/alarm/mb/extern_scharf', inverted: false },
        { hex: 0x43, name: 'Alarm', topic: 'telenot/alarm/mb/alarm', inverted: true },
        { hex: 0x44, name: 'Stoerung', topic: 'telenot/alarm/mb/stoerung', inverted: true },
        { hex: 0x45, name: 'Intern Bereit', topic: 'telenot/alarm/mb/intern_bereit', inverted: true },
        { hex: 0x46, name: 'Extern Bereit', topic: 'telenot/alarm/mb/extern_bereit', inverted: true },
      ],
    },
    MELDEGRUPPEN: {
      name: 'MELDEGRUPPEN',
      offset: 12,
      positions: [
        { hex:0x0, name: 'RK Eingang', topic: 'telenot/alarm/mg/rk_eingang', inverted: true },
        { hex:0x1, name: 'MK Eingang', topic: 'telenot/alarm/mg/mk_eingang', inverted: true },
        { hex:0x2, name: 'RK HWR', topic: 'telenot/alarm/mg/rk_hwr', inverted: true },
        { hex:0x3, name: 'MK HWR', topic: 'telenot/alarm/mg/mk_hwr', inverted: true },
        { hex:0x4, name: 'Ueberfall', topic: 'telenot/alarm/mg/ueberfall', inverted: true },
        { hex:0x5, name: 'Tür Essen/Wohnen', topic: 'telenot/alarm/mg/tuer_essen_wohnen', inverted: true },
        { hex:0x6, name: 'Fenster Gäste WC', topic: 'telenot/alarm/mg/fenster_gaeste_wc', inverted: true },
        { hex:0x7, name: 'Tür Gästezimmer', topic: 'telenot/alarm/mg/tuer_gaestezimmer', inverted: true },
        { hex:0x18, name: 'Fenster Ankleide', topic: 'telenot/alarm/mg/fenster_ankleide', inverted: true },
        { hex:0x19, name: 'Fenster Kinder', topic: 'telenot/alarm/mg/fenster_kinder', inverted: true },
        { hex:0x1A, name: 'Fenster Schlaf', topic: 'telenot/alarm/mg/fenster_schlaf', inverted: true },
        { hex:0x1B, name: 'Fenster Bad', topic: 'telenot/alarm/mg/fenster_bad', inverted: true },
        { hex:0x28, name: 'BWM HWR', topic: 'telenot/alarm/mg/bwm_hwr', inverted: true },
        { hex:0x29, name: 'BWM Flur EG', topic: 'telenot/alarm/mg/bwm_flur_eg', inverted: true },
        { hex:0x68, name: 'BWM Flur OG', topic: 'telenot/alarm/mg/bwm_flur_og', inverted: true },
        { hex:0xA8, name: 'MA - comlock 1 Sabotage', topic: 'telenot/alarm/mg/ma_comlock_1_sabo', inverted: true },
        { hex:0xA9, name: 'MA - comlock 2 Sabotage', topic: 'telenot/alarm/mg/ma_comlock_2_sabo', inverted: true },
        { hex:0xAA, name: 'MA - comlock 1 Bedrohung', topic: 'telenot/alarm/mg/ma_comlock_1_sabo', inverted: true },
        { hex:0xAB, name: 'MA - comlock 2 Bedrohung', topic: 'telenot/alarm/mg/ma_comlock_2_sabo', inverted: true },
      ],
    },
  },
};

module.exports = config;
