import TemplateEngine from './src/templating-engine/TemplatingEngine';
import { NotionToJSX } from './types';
import './src/style.css';

const notionToJSX = new TemplateEngine();

export default notionToJSX;
export type { NotionToJSX };
