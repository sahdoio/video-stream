import DashboardLayout from 'src/pages/Dashboard/Layout/DashboardLayout.vue';
import AuthLayout from 'src/pages/Dashboard/Login/AuthLayout.vue';

// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue';

// Page Headers
const DashboardHeader = () => import('src/pages/Dashboard/Dashboard/DashboardHeader.vue');
import DefaultHeader from 'src/pages/Dashboard/DefaultHeader';

// Login
const Login = () => import('src/pages/Dashboard/Login/Login.vue');

// Dashboard Pages
const Dashboard = () => import('src/pages/Dashboard/Dashboard/Dashboard.vue');
const Companies = () => import('src/pages/Dashboard/Companies/Companies.vue');
const Devices = () => import('src/pages/Dashboard/Devices/Devices.vue');
const CompanyDevices = () => import('src/pages/Dashboard/CompanyDevices/CompanyDevices.vue');
const Ads = () => import('src/pages/Dashboard/Ads/Ads.vue');
const AdsManagement= () => import('src/pages/Dashboard/AdsManagement/AdsManagement.vue');
const Language = () => import('src/pages/Dashboard/Language/Language.vue');
const Profile = () => import('src/pages/Dashboard/Profile/Profile.vue');
const Menus = () => import('src/pages/Dashboard/Menus/Menus.vue');

let authPages = {
    path: '/',
    component: AuthLayout,
    name: 'Authentication',
    children: [
        {
            path: 'login',
            name: 'login',
            component: Login
        }
    ]
};

let mainPages = {
    path: '/',
    component: DashboardLayout,
    redirect: 'dashboard',
    name: 'Dashboard',
    children: [{
        path: 'dashboard',
        name: 'dashboard',
        meta: {title: 'Dashboard'},
        components: {
            default: Dashboard,
            header: DefaultHeader
        }
    },
        {
            path: 'companies',
            name: 'companies',
            meta: {title: 'Empresas'},
            components: {
                default: Companies,
                header: DefaultHeader
            }
        },
        {
            path: 'devices',
            name: 'devices',
            meta: {title: 'Dispositivos'},
            components: {
                default: Devices,
                header: DefaultHeader
            }
        },
        {
            path: 'company_devices',
            name: 'company_devices',
            meta: {title: 'Dispositivos por empresa'},
            components: {
                default: CompanyDevices,
                header: DefaultHeader
            }
        },
        {
            path: 'ads',
            name: 'ads',
            meta: {title: 'Publicidades'},
            components: {
                default: Ads,
                header: DefaultHeader
            }
        },
        {
            path: 'ads_management',
            name: 'ads_management',
            meta: {title: 'Gerenciamento Publicidades'},
            components: {
                default: AdsManagement,
                header: DefaultHeader
            }
        },
        {
            path: 'language',
            name: 'language',
            meta: {title: 'Linguagem'},
            components: {
                default: Language,
                header: DefaultHeader
            }
        },
        {
            path: 'profile',
            name: 'profile',
            meta: {title: 'Perfil'},
            components: {
                default: Profile,
                header: DefaultHeader
            }
        },
        {
            path: 'menus',
            name: 'menus',
            meta: {title: 'Menus'},
            components: {
                default: Menus,
                header: DefaultHeader
            }
        }
    ]
};

const routes = [{
    path: '/',
    redirect: '/dashboard',
    name: 'Home'
},
    authPages,
    mainPages,
    {
        path: '*',
        component: NotFound
    }
];

export default routes;
