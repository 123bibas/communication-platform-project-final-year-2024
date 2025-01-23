// All components mapping with path for internal routes
import { lazy } from 'react'
const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const Welcome = lazy(() => import('../pages/protected/Welcome'))
const Kanban = lazy(() => import('../pages/protected/Kanban'))
const Email = lazy(() => import('../pages/protected/Email'))
const Task = lazy(() => import('../pages/protected/Task'))
const Page404 = lazy(() => import('../pages/protected/404'))
const ProjectCreation = lazy(() => import('../pages/protected/ProjectCreation'))
const ProjectEdit = lazy(() => import('../pages/protected/ProjectEdit'))
const StageCreation = lazy(() => import('../pages/protected/StageCreation'))
const ProjectList = lazy(() => import('../pages/protected/ProjectList'))
const Team = lazy(() => import('../pages/protected/Team'))
const ChangePassword = lazy(() => import('../pages/protected/ChangePassword'))
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'))
const GettingStarted = lazy(() => import('../pages/GettingStarted'))
const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard,
    isAccessible: ['admin'] // view rendered
  },
  {
    path: '/welcome', // the url
    component: Welcome,
    isAccessible: ['admin', 'manager', 'team', "user", 'user', 'suspended'] // view rendered
  },
  {
    path: '/settings-team',
    component: Team,
    isAccessible: ['admin']
  },
  {
    path: '/change-password',
    component: ChangePassword,
    isAccessible: ['user', 'admin', 'team', 'manager']
  },
  {
    path: '/settings-profile',
    component: ProfileSettings,
    isAccessible: ['user', 'admin', 'team', 'manager']
  },
  {
    path: '/kanban',
    component: Kanban,
    isAccessible: ['user', 'admin', 'team', 'manager']
  },
  {
    path: '/project-list',
    component: ProjectList,
    isAccessible: ['user', 'admin', 'team', 'manager']
  },
  {
    path: '/task',
    component: Task,
    isAccessible: ['user', 'admin', 'team', 'manager']
  },
  {
    path: '/create-project',
    component: ProjectCreation,
    isAccessible: ['admin', 'manager']
  },
  {
    path: '/edit-project',
    component: ProjectEdit,
    isAccessible: ['admin', 'manager']
  },
  {
    path: '/email',
    component: Email,
    isAccessible: ['admin', 'manager']
  },
  {
    path: '/create-stage',
    component: StageCreation,
    isAccessible: ['admin', 'manager', "team"]
  },
  {
    path: '/getting-started',
    component: GettingStarted,
    isAccessible: ['admin', 'manager']
  },
  {
    path: '/404',
    component: Page404,
    isAccessible: ['admin', 'manager']
  }
]
export default routes
