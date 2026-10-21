// Original fixture generator, written for this public prototype. No ANV sources.
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { writeFile } from 'node:fs/promises';

const pdf = await PDFDocument.create();
pdf.setTitle('ANAVELD local prototype - synthetic reader test');
pdf.setAuthor('Synthetic prototype fixture');
pdf.setSubject('DEMO ONLY. Not a verified ANAVELD publication.');
pdf.setCreationDate(new Date('2026-10-21T00:00:00Z'));
pdf.setModificationDate(new Date('2026-10-21T00:00:00Z'));
const regular = await pdf.embedFont(StandardFonts.Helvetica);
const serif = await pdf.embedFont(StandardFonts.TimesRoman);
const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
const navy = rgb(6 / 255, 26 / 255, 49 / 255);
const olive = rgb(73 / 255, 100 / 255, 80 / 255);
const chapters = [
  ['A closer look at motion', 'An original synthetic PDF for testing a reading interface.', ['This is a DEMO document, not an ANAVELD publication.', 'Its purpose is to exercise page navigation, selection, text search,', 'zoom and the distinction between Book and Study presentation.', '', 'The example: a one-dimensional, undamped harmonic oscillator.', 'No original ANV text, cover art or unpublished source is included.'], 'x(t) = A cos(omega t + phi)'],
  ['Begin with equilibrium', 'First, state what the model assumes.', ['Consider a mass m attached to an ideal spring of stiffness k.', 'Displacement x is measured from stable equilibrium.', 'For sufficiently small displacement, the restoring force is linear.', '', 'The force points toward equilibrium: F = -kx.', 'Newton\'s second law gives m x\'\' + kx = 0.', 'We assume m > 0, k > 0, and neglect damping.'], 'F = -kx'],
  ['A pattern in time', 'A solution is useful when its assumptions remain visible.', ['The displacement is x(t) = A cos(omega t + phi).', 'Here A is the amplitude and phi fixes the initial phase.', 'The angular frequency satisfies omega squared = k / m.', '', 'Changing the amplitude does not change the period in this model.', 'That statement relies on the linear restoring-force assumption.', 'It need not hold for a nonlinear oscillator.'], 'omega = sqrt(k / m)'],
  ['An energy perspective', 'The same motion can be described in another way.', ['For this ideal model, total mechanical energy is conserved.', 'Kinetic energy is K = (1/2) m v squared.', 'Elastic potential energy is U = (1/2) k x squared.', '', 'At a turning point, speed is zero and U equals the total energy.', 'At equilibrium, potential energy is zero by the chosen convention.', 'The speed then has its greatest magnitude.'], 'E = (1/2) m v squared + (1/2) k x squared'],
  ['Where the model ends', 'A boundary is part of the explanation.', ['This example omits damping, forcing and nonlinear effects.', 'It does not describe every oscillating system.', 'A different physical system may require different coordinates,', 'a different force law, or a more careful equilibrium analysis.', '', 'A model is not the same object as a problem or a publication.', 'Demo sequence numbers do not imply prerequisites.'], 'Assumptions -> model -> testable consequences'],
  ['Return with a question', 'A short checklist for a synthetic reading session.', ['1. Find the word equilibrium using the PDF text-search control.', '2. Jump to page 3 and change between Study and Book layouts.', '3. Check that the same one-based PDF page is retained.', '4. Try selecting this English paragraph in Study view.', '5. Open this PDF in a browser-native PDF viewer as a fallback.', '', 'This fixture has no embedded outline, annotations or accessibility tags.', 'Formula copying and assistive-technology reading are not verified.'], 'End of the six-page DEMO fixture'],
];

chapters.forEach(([title, subtitle, lines, equation], index) => {
  const page = pdf.addPage([595.28, 841.89]);
  page.drawRectangle({ x: 0, y: 0, width: 595.28, height: 841.89, color: rgb(1, 0.988, 0.963) });
  page.drawText('ANAVELD  /  SYNTHETIC READER TEST', { x: 54, y: 788, size: 9, font: regular, color: olive });
  page.drawLine({ start: { x: 54, y: 768 }, end: { x: 541, y: 768 }, thickness: 0.7, color: olive });
  page.drawText(`0${index + 1}`, { x: 54, y: 703, size: 14, font: regular, color: olive });
  page.drawText(title, { x: 54, y: 652, size: 28, font: serif, color: navy });
  page.drawText(subtitle, { x: 54, y: 618, size: 13, font: italic, color: navy });
  lines.forEach((line, lineIndex) => { if (line) page.drawText(line, { x: 54, y: 554 - lineIndex * 24, size: 11.5, font: regular, color: navy }); });
  page.drawRectangle({ x: 54, y: 227, width: 487, height: 64, color: rgb(0.92, 0.93, 0.88) });
  page.drawText(equation, { x: 70, y: 252, size: index === 3 ? 13 : 17, font: serif, color: navy });
  page.drawText('DEMO ONLY - not a verified publication or research result.', { x: 54, y: 94, size: 9, font: regular, color: olive });
  page.drawLine({ start: { x: 54, y: 74 }, end: { x: 541, y: 74 }, thickness: 0.7, color: olive });
  page.drawText(`LOCAL DESIGN FIXTURE                                                    ${index + 1} / 6`, { x: 54, y: 52, size: 9, font: regular, color: navy });
});
await writeFile(new URL('../public/assets/anaveld-reader-demo.pdf', import.meta.url), await pdf.save());
process.stdout.write('Generated original six-page synthetic PDF fixture.\n');
