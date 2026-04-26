import { createRouter, createWebHistory } from "vue-router";
import Hero from "../views/Hero.vue";
import Services from "../views/Services.vue";
import About from "../views/About.vue";
import Processes from "../views/Processes.vue"

import Clients from "../views/Clients.vue";
import Contact from "../views/Contact.vue";
import AppMokeup from "../views/AppMokeup.vue"
import FreeServices from "../views/FreeServices.vue";
import AndroidApps from "../views/AndroidApps.vue";
import PdfConverter from "../views/PdfConverter.vue";
import DateConverter from "../views/DateConverter.vue";
import PassportSize from "../views/PassportSize.vue";
import QrCodeGenerator from "../views/QrCodeGenerator.vue";
import ImageCompressor from "../views/ImageCompressor.vue";
import JsonFormatter from "../views/JsonFormatter.vue";
import CollorPaletteGenerator from "../views/CollorPaletteGenerator.vue";
import TextToSpeach from "../views/TextToSpeach.vue";
import BaseEncoder from "../views/BaseEncoder.vue";
import CodeDiffChecker from "../views/CodeDiffChecker.vue";
import SvGOptimizer from "../views/SvGOptimizer.vue";
import PasswordGenerator from "../views/PasswordGenerator.vue";
import ScreenRecorder from "../views/ScreenRecorder.vue";
import LoremGenerator from "../views/LoremGenerator.vue";
import FaveIconGenerator from "../views/FaveIconGenerator.vue";
import YamlToJsonConverter from "../views/YamlToJsonConverter.vue";
import UnitConverter from "../views/UnitConverter.vue";
import CountDownTimer from "../views/CountDownTimer.vue";
import RegTester from "../views/RegTester.vue";
import JWTDecoder from "../views/JWTDecoder.vue";
import Minifier from "../views/Minifier.vue";
import CssGradientGenertor from "../views/CssGradientGenertor.vue";
import BoxShadowGenerator from "../views/BoxShadowGenerator.vue";
import GlassMorphismGenerator from "../views/GlassMorphismGenerator.vue";
import AiTextSummarizer from "../views/AiTextSummarizer.vue";
import AiBackgroundRemover from "../views/AiBackgroundRemover.vue";
import PomodroTimer from "../views/PomodroTimer.vue";
import MetaTagGenerator from "../views/MetaTagGenerator.vue";
import WebsiteScreenShot from "../views/WebsiteScreenShot.vue";

const routes = [
  { path: "/", component: Hero },
  { path: "/services", component: Services },
  { path: "/about", component: About },
  { path: "/processes", component: Processes },
  { path: "/clients", component: Clients },
  { path: "/contact", component: Contact },
  { path: "/mockup-creator", component: AppMokeup },
  { path: "/freeservices", component: FreeServices },
  { path: "/mobile-apps", component: AndroidApps },
  { path: "/pdf-converter", component: PdfConverter },
  { path: "/date-converter", component: DateConverter },
  { path: "/passport-photo", component: PassportSize },
  { path: "/qr-generator",component:QrCodeGenerator},
  { path: "/image-compressor",component:ImageCompressor},
  { path: "/json-formatter",component:JsonFormatter},
  { path: "/color-palette",component:CollorPaletteGenerator},
  { path:"/text-to-speech",component:TextToSpeach},
  { path:"/base64",component:BaseEncoder},
  { path:"/code-diff",component:CodeDiffChecker},
  { path:"/svg-optimizer",component:SvGOptimizer},
  { path:"/password-generator",component:PasswordGenerator},
  { path:"/screen-recorder",component:ScreenRecorder},
  { path:"/lorem-ipsum",component:LoremGenerator},
  { path:"/favicon-generator",component:FaveIconGenerator},
  { path:"/yaml-json-converter",component:YamlToJsonConverter},
  { path:"/unit-converter",component:UnitConverter},
  { path:"/countdown-timer",component:CountDownTimer},
  { path:"/regex-tester",component:RegTester},
  { path:"/jwt-decoder",component:JWTDecoder},
  { path:"/minifier",component:Minifier},
  { path:"/gradient-generator",component:CssGradientGenertor},
  { path:"/box-shadow",component:BoxShadowGenerator},
  { path:"/glassmorphism",component:GlassMorphismGenerator},
  { path:"/ai-summarizer",component:AiTextSummarizer},
  { path:"/bg-remover",component:AiBackgroundRemover},
  { path:"/pomodoro",component:PomodroTimer},
  { path:"/meta-tag",component:MetaTagGenerator},
  { path:"/website-screenshot",component:WebsiteScreenShot}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
