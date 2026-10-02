# DewWindow

Will your windows fog up or grow mould? Enter room temperature, humidity and outside temperature; see the dew point, the glass surface temperature for four glazing types, a verdict, and the humidity limit.

Dew point: Magnus formula with Alduchov and Eskridge constants a = 17.625, b = 243.04 C (https://en.wikipedia.org/wiki/Dew_point). Glass surface: Ts = Tin - U x Rsi x (Tin - Tout), Rsi = 0.13 m2K/W. Typical centre-of-glass U-values: single 5.8, double air 2.8, double argon low-E 1.1, triple 0.8 W/m2K (clevercalculator.com/home/window-u-value). Mould-favourable when surface humidity reaches 80% (Fraunhofer IBP literature).
Tests: 35 checks, including the Wikipedia dew point table at 32 C (six dew-point bands against their humidity ranges, tolerance 0.6 C), 20 C 50% = 9.3 C, 25 C 60% = 16.7 C, round trips, glazing surface temperatures, verdicts and humidity limits.
Deviations: centre-of-glass only (frames and edges are colder), still air, typical U-values. A guide, not a building diagnosis.

Static client-side. `node test-engine.js` runs the tests.
