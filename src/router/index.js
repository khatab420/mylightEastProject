import { createRouter,createWebHistory } from "vue-router";
import Hero from "../views/Hero.vue";
import Services from "../views/Services.vue";
import About from "../views/About.vue";
import Proceses from "../views/Proceses.vue";
import Clients from "../views/Clients.vue";
import Contact from "../views/Contact.vue";

const routes=[
    {path:'/',component:Hero},
    {path:'/service',component:Services},
    {path:'/about',component:About},
    {path:'/process',component:Proceses},
    {path:'/client',component:Clients},
    {path:'/contact',component:Contact},

]

const router=createRouter({
    history:createWebHistory(),
    routes
})

export default router