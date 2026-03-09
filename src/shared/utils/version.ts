// Vite exposes package.json fields via import.meta.env when using the define config,
// but the simplest approach for a pure Vite project is to import package.json directly
// (tsconfig already has "resolveJsonModule": true).
import pkg from '../../../package.json';

export const APP_VERSION: string = pkg.version;
