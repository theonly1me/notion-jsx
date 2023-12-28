import TemplateEngine from './src/templating-engine/TemplatingEngine';
import { NotionJSX } from './types';
import './src/style.css';

const notionJSX = new TemplateEngine();

export default notionJSX;
export type { NotionJSX };
