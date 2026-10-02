var E = require('./engine.js'), n = 0, bad = 0;
function near(a, b, tol, m) { n++; if (!(Math.abs(a - b) <= tol)) { bad++; console.log('FAIL', m, a, b); } }
function is(a, b, m) { n++; if (a !== b) { bad++; console.log('FAIL', m, a, b); } }
// Wikipedia Dew point table, relative humidity at 32 C: dew point 24-26 C = 62-72%, 21-24 = 52-61%, 18-21 = 44-51%, 16-18 = 37-43%, 13-16 = 31-36%, 10-12 = 26-30%
function within(rh, lo, hi, m) { var td = E.dewPoint(32, rh); n++; if (td < lo - 0.6 || td > hi + 0.6) { bad++; console.log('FAIL', m, td); } }
within(62, 24, 26, '62%'); within(72, 24, 26, '72%'); within(52, 21, 24, '52%'); within(61, 21, 24, '61%'); within(44, 18, 21, '44%'); within(51, 18, 21, '51%'); within(37, 16, 18, '37%'); within(43, 16, 18, '43%'); within(31, 13, 16, '31%'); within(36, 13, 16, '36%'); within(26, 10, 12, '26%'); within(30, 10, 12, '30%');
// well-known values: 100% RH dew point = air temperature; 20 C at 50% = 9.3 C; 25 C at 60% = 16.7 C
near(E.dewPoint(20, 100), 20, 1e-9, '100%'); near(E.dewPoint(20, 50), 9.26, 0.05, '20/50'); near(E.dewPoint(25, 60), 16.7, 0.1, '25/60');
// round trip
near(E.rhFromDew(20, E.dewPoint(20, 43)), 43, 1e-6, 'roundtrip'); near(E.rhFromDew(30, 24), 100 * E.satVP(24) / E.satVP(30), 1e-9, 'rhFromDew');
// saturation vapour pressure at 20 C is about 23.4 hPa, at 0 C about 6.1 hPa
near(E.satVP(20), 23.4, 0.3, 'es 20'); near(E.satVP(0), 6.11, 0.05, 'es 0');
// glazing surface temperature: 20 in, 0 out: single 5.8 -> 4.9, double 2.8 -> 12.7, triple 0.8 -> 18.0
near(E.surfaceTemp(20, 0, 5.8), 20 - 5.8 * 0.13 * 20, 1e-9, 'single'); near(E.surfaceTemp(20, 0, 5.8), 4.92, 0.01, 'single val'); near(E.surfaceTemp(20, 0, 2.8), 12.72, 0.01, 'double'); near(E.surfaceTemp(20, 0, 0.8), 17.92, 0.01, 'triple');
// no temperature difference means the surface equals the room
near(E.surfaceTemp(21, 21, 5.8), 21, 1e-9, 'no delta');
// condensation verdicts: 20 C room, 50% RH (dew 9.3): single glass at 0 C out = 4.9 -> condensation; double = 12.7 -> OK
is(E.assess(20, 50, 0, 5.8).status, 'Condensation', 'single cond'); is(E.assess(20, 50, 0, 2.8).status, 'OK', 'double ok');
// 20 C, 70% RH, double glazing 0 C out: surface 12.7, dew 14.4 -> condensation
is(E.assess(20, 70, 0, 2.8).status, 'Condensation', 'double 70');
// mould zone: 20 C, 55% RH, double glazing at -5 C: surface 11.4 -> rh_s 55*23.4/13.5 = 95 -> but dew 10.7 < 11.4 so mould risk, not condensation
var a = E.assess(20, 50, -5, 2.8); is(a.condenses, false, 'no cond'); is(a.mould, true, 'mould'); is(a.status, 'Mould risk', 'status');
// max RH: surface at room temperature allows 100% (80% for mould); colder surface allows less; capped at 100
near(E.maxRH(20, 20, 100), 100, 1e-9, 'max same'); near(E.maxRH(20, 20, 80), 80, 1e-9, 'max80'); is(E.maxRH(20, 25, 100), 100, 'cap');
near(E.assess(20, 40, 0, 5.8).maxRHCondense, 100 * E.satVP(E.surfaceTemp(20, 0, 5.8)) / E.satVP(20), 1e-9, 'maxRH consistent');
// at the condensation limit the surface RH is 100
var lim = E.assess(20, 30, 0, 5.8).maxRHCondense; near(E.surfaceRH(20, lim, E.surfaceTemp(20, 0, 5.8)), 100, 1e-6, 'limit');
console.log((n - bad) + '/' + n + ' passed'); process.exit(bad ? 1 : 0);
