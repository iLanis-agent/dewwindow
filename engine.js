(function (root) {
  'use strict';
  // Magnus formula, Alduchov and Eskridge constants (https://en.wikipedia.org/wiki/Dew_point; omnicalculator.com/physics/dew-point): a = 17.625, b = 243.04 C
  var A = 17.625, B = 243.04;
  var RSI = 0.13; // m2K/W, standard interior surface resistance for walls and glazing (EN ISO 6946)
  var GLAZING = [
    { id: 'single', name: 'Single pane', u: 5.8 },
    { id: 'double', name: 'Double, air filled', u: 2.8 },
    { id: 'doublelowe', name: 'Double, argon + low-E', u: 1.1 },
    { id: 'triple', name: 'Triple, low-E', u: 0.8 }
  ];
  function dewPoint(t, rh) { var g = Math.log(rh / 100) + A * t / (B + t); return B * g / (A - g); }
  function satVP(t) { return 6.1094 * Math.exp(A * t / (B + t)); } // hPa
  function rhFromDew(t, td) { return 100 * satVP(td) / satVP(t); }
  // Inner surface temperature of glazing: Ts = Tin - U * Rsi * (Tin - Tout)
  function surfaceTemp(tin, tout, u) { return tin - u * RSI * (tin - tout); }
  // Humidity at the glass surface if room air touches it: RH_s = RH * es(Tin) / es(Ts)
  function surfaceRH(tin, rh, ts) { return Math.min(100, rh * satVP(tin) / satVP(ts)); }
  // Highest room RH before the glass hits the dew point (condensation), and before surface RH reaches 80% (mould-favourable, commonly used criterion)
  function maxRH(tin, ts, limit) { return Math.min(100, (limit == null ? 100 : limit) * satVP(ts) / satVP(tin)); }
  function assess(tin, rh, tout, u) {
    var td = dewPoint(tin, rh), ts = surfaceTemp(tin, tout, u), rs = surfaceRH(tin, rh, ts);
    return { dew: td, surface: ts, surfaceRH: rs, condenses: ts <= td, mould: rs >= 80, maxRHCondense: maxRH(tin, ts, 100), maxRHMould: maxRH(tin, ts, 80), status: ts <= td ? 'Condensation' : rs >= 80 ? 'Mould risk' : 'OK' };
  }
  var api = { dewPoint: dewPoint, satVP: satVP, rhFromDew: rhFromDew, surfaceTemp: surfaceTemp, surfaceRH: surfaceRH, maxRH: maxRH, assess: assess, GLAZING: GLAZING, RSI: RSI };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Dew = api;
})(typeof window !== 'undefined' ? window : this);
