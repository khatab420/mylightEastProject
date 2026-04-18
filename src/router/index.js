import { createRouter,createWebHistory } from "vue-router";
import Hero from "../views/Hero.vue";
import Services from "../views/Services.vue";
import About from "../views/About.vue";
import Proceses from "../views/Proceses.vue";
import Clients from "../views/Clients.vue";
import Contact from "../views/Contact.vue";
import AppMokeup from "../views/AppMokeup.vue";
import FreeServices from "../views/FreeServices.vue";
import AndroidApps from "../views/AndroidApps.vue";
import PdfConverter from "../views/PdfConverter.vue";
import DateConverter from "../views/DateConverter.vue";
import PassportSize from "../views/PassportSize.vue";


const routes=[
    {path:'/',component:Hero},
    {path:'/service',component:Services},
    {path:'/about',component:About},
    {path:'/process',component:Proceses},
    {path:'/client',component:Clients},
    {path:'/contact',component:Contact},
    {path:'/mockup-creator',component:AppMokeup},
    {path:'/freeservices',component:FreeServices},
    {path:'/mobile-apps',component:AndroidApps},
    {path:'/pdf-converter',component:PdfConverter},
    {path:'/date-converter',component:DateConverter},
    {path:'/passport-photo',component:PassportSize}
    

]

const router=createRouter({
    history:createWebHistory(),
    routes
})

export default router