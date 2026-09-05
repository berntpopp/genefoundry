# Font provenance

Archivo: Omnibus-Type, https://www.omnibus-type.com/fonts/archivo/; official Google Fonts distribution. Retrieved 2026-09-05 from https://fonts.googleapis.com/css2?family=Archivo:wght@600&display=swap. That stylesheet identifies normal style, normal stretch, weight 600 and the upstream file https://fonts.gstatic.com/s/archivo/v25/k3k6o8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTT6jRp8A.ttf.

Subset with fontTools 4.61.1 to Latin plus punctuation, retaining layout features and converting to WOFF2. Output: public/fonts/archivo-latin-600.woff2. FontTools inspection confirms family Archivo, weight 600 and width class 5 (normal). OFL retained as public/fonts/archivo-OFL.txt from https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/OFL.txt. Existing self-hosted Inter Latin assets are retained. No generated raster is used by the interface lane.

## User-requested body-font revision

On 2026-09-05 the user superseded the earlier Inter choice with Source Sans 3. Archivo remains the display face. Source Sans 3 is Adobe's open-source family, distributed through the official Google Fonts repository: https://github.com/google/fonts/tree/main/ofl/sourcesans3. Downloaded https://raw.githubusercontent.com/google/fonts/main/ofl/sourcesans3/SourceSans3%5Bwght%5D.ttf and https://raw.githubusercontent.com/google/fonts/main/ofl/sourcesans3/OFL.txt on that date. License retained as public/fonts/source-sans-3-OFL.txt.

Using fontTools4.61.1, restricted the variable weight axis to400–600, subset the Latin/punctuation character range used for Archivo, and retained standard kern/liga/clig/calt features. Output public/fonts/source-sans-3-latin-400-600.woff2 is20,004bytes. The input naming table retains the upstream default subfamily ExtraLight; fvar inspection confirms the distributed subset is restricted to400–600 and CSS declares that exact range. Archivo plus Source Sans3 totals32,588bytes. Removed obsolete Inter and Instrument Serif files after confirming no shipping source/preload references.
