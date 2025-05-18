import { createRoot } from 'react-dom/client'
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import dayjs from 'dayjs';
dayjs.extend(customParseFormat);
dayjs.extend(utc);

import './index.css'
import Root from './app/Root.tsx'

createRoot(document.getElementById('root')!).render(
  <Root/>
)
