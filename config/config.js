/* eslint-disable object-curly-newline */
const config = {
  LogLevel: process.env.LOG_LEVEL || 'info',
  Connection: {
    mqttConfig: {
      host: process.env.MQTTHOST,
      port: process.env.MQTTPORT,
      username: process.env.MQTTUSER,
      password: process.env.MQTTPASSWORD,
      publishTopic: process.env.PUBLISHTOPIC || 'telenot/alarm/publish',
    },
    telnetConfig: {
      host: process.env.TELNETHOST,
      port: process.env.TELNETPORT,
    },
  },
  Telenot: {
    SICHERUNGSBEREICH: {
      name: 'SICHERUNGSBEREICH',
      offset: 10,
      positions: [
        { hex: 0x0, name: 'Test', topic: '' },
      ],
    },
    SICHERUNGSBEREICH2: {
      name: 'SICHERUNGSBEREICH2',
      offset: 10,
      positions: [
        { hex: 0x0, name: 'Test', topic: '' },
      ],
    },
    MELDEBEREICHE: {
      name: 'MELDEBEREICHE',
      offset: 10,
      positions: [
        // { hex: 586, name: 'Fenster Bad Eltern', topic: 'telenot/alarm/mb/fenster_bad_eltern' },
        { hex: 0x94, name: 'Fenster Isabel', topic: 'telenot/alarm/mb/fenster_isabel', inverted: true },
        { hex: 0x80, name: 'Fenster KG HWR', topic: 'telenot/alarm/mb/fenster_kg_hwr', inverted: true },
        { hex: 0x81, name: 'Fenster KG Fitness', topic: 'telenot/alarm/mb/fenster_kg_fitness', inverted: true },
        { hex: 0x82, name: 'Fenster KG Werkstatt', topic: 'telenot/alarm/mb/fenster_kg_werkstatt', inverted: true },
        { hex: 0x83, name: 'Tuer KG Werkstatt', topic: 'telenot/alarm/mb/tuer_kg_werkstatt', inverted: true },
        { hex: 0x84, name: 'Fenster KG Hobby', topic: 'telenot/alarm/mb/fenster_kg_hobby', inverted: true },
        { hex: 0x85, name: 'Fenster EG Vorrat', topic: 'telenot/alarm/mb/fenster_eg_vorrat', inverted: true },
        { hex: 0x86, name: 'Fenster EG Kueche', topic: 'telenot/alarm/mb/fenster_eg_kueche', inverted: true },
        { hex: 0x87, name: 'Fenster EG Wohnzimmer', topic: 'telenot/alarm/mb/fenster_eg_wohnzimmer', inverted: true },
        { hex: 0x88, name: 'Fenster EG Arbeiten', topic: 'telenot/alarm/mb/fenster_eg_arbeiten', inverted: true },
        { hex: 0x89, name: 'Fenster EG WC', topic: 'telenot/alarm/mb/fenster_eg_wc', inverted: true },
        { hex: 0x8a, name: 'Tuer EG Flur', topic: 'telenot/alarm/mb/tuer_eg_flur', inverted: true },
        { hex: 0x8b, name: 'Glasbruch', topic: 'telenot/alarm/mb/glasbruch', inverted: true },
        { hex: 0x8c, name: 'Fenster DG Dach', topic: 'telenot/alarm/mb/fenster_dg_dach', inverted: true },
        { hex: 0x8d, name: 'Rauchmelder', topic: 'telenot/alarm/mb/brand', inverted: true },
        { hex: 0x8e, name: 'Bewegungsmelder', topic: 'telenot/alarm/mb/bewegungsmelder', inverted: true },
        { hex: 0x8f, name: 'Sabotage', topic: 'telenot/alarm/mb/sabotage', inverted: true },
        { hex: 0x40, name: 'Unscharf', topic: 'telenot/alarm/mb/unscharf', inverted: true },
        { hex: 0x41, name: 'Intern scharf', topic: 'telenot/alarm/mb/intern_scharf', inverted: true },
        { hex: 0x42, name: 'Extern scharf', topic: 'telenot/alarm/mb/extern_scharf', inverted: true },
        { hex: 0x43, name: 'Alarm', topic: 'telenot/alarm/mb/alarm', inverted: true },
        { hex: 0x44, name: 'Störung', topic: 'telenot/alarm/mb/störung', inverted: true },
        { hex: 0x45, name: 'Intern Bereit', topic: 'telenot/alarm/mb/intern_bereit', inverted: true },
        { hex: 0x46, name: 'Extern Bereit', topic: 'telenot/alarm/mb/extern_bereit', inverted: true },
      ],
    },
    MELDEGRUPPEN: {
      name: 'MELDEGRUPPEN',
      offset: 12,
      positions: [
        { hex: 0x0, name: 'Fenster KG HWR', topic: 'telenot/alarm/mg/fenster_kg_hwr', inverted: true },
        { hex: 0x1, name: 'Fenster KG Fitness', topic: 'telenot/alarm/mg/fenster_kg_fitness', inverted: true },
        { hex: 0x2, name: 'Fenster KG Werkstatt', topic: 'telenot/alarm/mg/fenster_kg_werkstatt', inverted: true },
        { hex: 0x3, name: 'Tür KG Werkstatt', topic: 'telenot/alarm/mg/tuer_kg_werkstatt', inverted: true },
        { hex: 0x4, name: 'Fenster KG Hobby', topic: 'telenot/alarm/mg/fenster_kg_hobby', inverted: true },
        { hex: 0x5, name: 'Fenster EG Vorrat', topic: 'telenot/alarm/mg/fenster_eg_vorrat', inverted: true },
        { hex: 0x6, name: 'Fenster EG Küche', topic: 'telenot/alarm/mg/fenster_eg_kueche', inverted: true },
        { hex: 0x7, name: 'Glasbruch Wohnzimmer', topic: 'telenot/alarm/mg/glasbruch_wohnzimmer', inverted: true },
        { hex: 0x8, name: 'Tür EG Wohnzimmer', topic: 'telenot/alarm/mg/tuer_eg_wohnzimmer', inverted: true },
        { hex: 0x9, name: 'Fenster EG WZ West', topic: 'telenot/alarm/mg/fenster_eg_wz_west', inverted: true },
        { hex: 0xA, name: 'Fenster EG Arbeiten', topic: 'telenot/alarm/mg/fenster_eg_arbeiten', inverted: true },
        { hex: 0xB, name: 'Fenster EG Bad', topic: 'telenot/alarm/mg/fenster_eg_bad', inverted: true },
        { hex: 0xC, name: 'Fenster EG WZ Ost', topic: 'telenot/alarm/mg/fenster_eg_wz_ost', inverted: true },
        { hex: 0xD, name: 'Sabotage Klingel Eingang', topic: 'telenot/alarm/mg/sabo_klingel', inverted: true },
        { hex: 0x10, name: 'Sabotage Deckel Zentrale', topic: 'telenot/alarm/mg/sabo_deckel_zentrale', inverted: true },
        { hex: 0x28, name: 'BM HWR', topic: 'telenot/alarm/mg/bm_hwr', inverted: true },
        { hex: 0x29, name: 'BM Flur KG', topic: 'telenot/alarm/mg/bm_flur_kg', inverted: true },
        { hex: 0x2A, name: 'BM Flur EG', topic: 'telenot/alarm/mg/bm_flur_eg', inverted: true },
        { hex: 0x2B, name: 'BM Wohnzimmer', topic: 'telenot/alarm/mg/bm_wohnzimmer', inverted: true },
        { hex: 0x2C, name: 'BM Flur OG', topic: 'telenot/alarm/mg/bm_flur_og', inverted: true },
        { hex: 0x68, name: 'RM Wohnzimmer', topic: 'telenot/alarm/mg/rm_wohnzimmer', inverted: true },
        { hex: 0x69, name: 'RM Küche', topic: 'telenot/alarm/mg/rm_kueche', inverted: true },
        { hex: 0x6A, name: 'RM Schlafen Eltern', topic: 'telenot/alarm/mg/rm_schlafen_eltern', inverted: true },
        { hex: 0x6B, name: 'RM Felicia', topic: 'telenot/alarm/mg/rm_felicia', inverted: true },
        { hex: 0x6C, name: 'RM Isabel', topic: 'telenot/alarm/mg/rm_isabel', inverted: true },
        { hex: 0x6D, name: 'RM Flur OG', topic: 'telenot/alarm/mg/rm_flur_og', inverted: true },
        { hex: 0x6E, name: 'RM Dachboden', topic: 'telenot/alarm/mg/rm_dachboden', inverted: true },
        { hex: 0x6F, name: 'RM HWR', topic: 'telenot/alarm/mg/rm_hwr', inverted: true },
        { hex: 0x70, name: 'Dachfenster', topic: 'telenot/alarm/mg/dachfenster', inverted: true },
        { hex: 0x170, name: 'Fenster Bad Eltern', topic: 'telenot/alarm/mg/fenster_bad_eltern', inverted: true },
        { hex: 0x171, name: 'Fenster Isabel', topic: 'telenot/alarm/mg/fenster_isabel', inverted: true },
        { hex: 0x408, name: 'Tür EG', topic: 'telenot/alarm/mg/tuer_eg', inverted: true },
        { hex: 0x40E, name: 'Türknauf Sabotage', topic: 'telenot/alarm/mg/sabotage_tuer_eg', inverted: true },
        { hex: 0x40F, name: 'Türknauf Batt. Warn', topic: 'telenot/alarm/mg/batterie_warnung_knauf', inverted: true },
      ],
    },
  },
};

module.exports = config;
