//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/~__root'
import { Route as DashboardImport } from './routes/~_dashboard'
import { Route as DashboardNotificationsImport } from './routes/~_dashboard/~notifications'
import { Route as SignInIndexImport } from './routes/~sign-in/~index'
import { Route as DashboardIndexImport } from './routes/~_dashboard/~index'
import { Route as DashboardUsersInviteImport } from './routes/~_dashboard/~users/~invite'
import { Route as DashboardUsersIdImport } from './routes/~_dashboard/~users/~$id'
import { Route as DashboardPatientsInviteImport } from './routes/~_dashboard/~patients/~invite'
import { Route as DashboardUsersIndexImport } from './routes/~_dashboard/~users/~index'
import { Route as DashboardPatientsIndexImport } from './routes/~_dashboard/~patients/~index'
import { Route as DashboardPatientsIdIndexImport } from './routes/~_dashboard/~patients/~$id/~index'

// Create/Update Routes

const DashboardRoute = DashboardImport.update({
  id: '/_dashboard',
  getParentRoute: () => rootRoute,
} as any)

const DashboardNotificationsRoute = DashboardNotificationsImport.update({
  path: '/notifications',
  getParentRoute: () => DashboardRoute,
} as any)

const SignInIndexRoute = SignInIndexImport.update({
  path: '/sign-in/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  path: '/',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardUsersInviteRoute = DashboardUsersInviteImport.update({
  path: '/users/invite',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardUsersIdRoute = DashboardUsersIdImport.update({
  path: '/users/$id',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardPatientsInviteRoute = DashboardPatientsInviteImport.update({
  path: '/patients/invite',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardUsersIndexRoute = DashboardUsersIndexImport.update({
  path: '/users/',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardPatientsIndexRoute = DashboardPatientsIndexImport.update({
  path: '/patients/',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardPatientsIdIndexRoute = DashboardPatientsIdIndexImport.update({
  path: '/patients/$id/',
  getParentRoute: () => DashboardRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_dashboard': {
      id: '/_dashboard'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/_dashboard/': {
      id: '/_dashboard/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof DashboardImport
    }
    '/sign-in/': {
      id: '/sign-in/'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof SignInIndexImport
      parentRoute: typeof rootRoute
    }
    '/_dashboard/notifications': {
      id: '/_dashboard/notifications'
      path: '/notifications'
      fullPath: '/notifications'
      preLoaderRoute: typeof DashboardNotificationsImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/patients/': {
      id: '/_dashboard/patients/'
      path: '/patients'
      fullPath: '/patients'
      preLoaderRoute: typeof DashboardPatientsIndexImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/users/': {
      id: '/_dashboard/users/'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof DashboardUsersIndexImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/patients/invite': {
      id: '/_dashboard/patients/invite'
      path: '/patients/invite'
      fullPath: '/patients/invite'
      preLoaderRoute: typeof DashboardPatientsInviteImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/users/$id': {
      id: '/_dashboard/users/$id'
      path: '/users/$id'
      fullPath: '/users/$id'
      preLoaderRoute: typeof DashboardUsersIdImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/users/invite': {
      id: '/_dashboard/users/invite'
      path: '/users/invite'
      fullPath: '/users/invite'
      preLoaderRoute: typeof DashboardUsersInviteImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/patients/$id/': {
      id: '/_dashboard/patients/$id/'
      path: '/patients/$id'
      fullPath: '/patients/$id'
      preLoaderRoute: typeof DashboardPatientsIdIndexImport
      parentRoute: typeof DashboardImport
    }
  }
}

// Create and export the route tree

interface DashboardRouteChildren {
  DashboardIndexRoute: typeof DashboardIndexRoute
  DashboardNotificationsRoute: typeof DashboardNotificationsRoute
  DashboardPatientsIndexRoute: typeof DashboardPatientsIndexRoute
  DashboardUsersIndexRoute: typeof DashboardUsersIndexRoute
  DashboardPatientsInviteRoute: typeof DashboardPatientsInviteRoute
  DashboardUsersIdRoute: typeof DashboardUsersIdRoute
  DashboardUsersInviteRoute: typeof DashboardUsersInviteRoute
  DashboardPatientsIdIndexRoute: typeof DashboardPatientsIdIndexRoute
}

const DashboardRouteChildren: DashboardRouteChildren = {
  DashboardIndexRoute: DashboardIndexRoute,
  DashboardNotificationsRoute: DashboardNotificationsRoute,
  DashboardPatientsIndexRoute: DashboardPatientsIndexRoute,
  DashboardUsersIndexRoute: DashboardUsersIndexRoute,
  DashboardPatientsInviteRoute: DashboardPatientsInviteRoute,
  DashboardUsersIdRoute: DashboardUsersIdRoute,
  DashboardUsersInviteRoute: DashboardUsersInviteRoute,
  DashboardPatientsIdIndexRoute: DashboardPatientsIdIndexRoute,
}

const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof DashboardRouteWithChildren
  '/': typeof DashboardIndexRoute
  '/sign-in': typeof SignInIndexRoute
  '/notifications': typeof DashboardNotificationsRoute
  '/patients': typeof DashboardPatientsIndexRoute
  '/users': typeof DashboardUsersIndexRoute
  '/patients/invite': typeof DashboardPatientsInviteRoute
  '/users/$id': typeof DashboardUsersIdRoute
  '/users/invite': typeof DashboardUsersInviteRoute
  '/patients/$id': typeof DashboardPatientsIdIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof DashboardIndexRoute
  '/sign-in': typeof SignInIndexRoute
  '/notifications': typeof DashboardNotificationsRoute
  '/patients': typeof DashboardPatientsIndexRoute
  '/users': typeof DashboardUsersIndexRoute
  '/patients/invite': typeof DashboardPatientsInviteRoute
  '/users/$id': typeof DashboardUsersIdRoute
  '/users/invite': typeof DashboardUsersInviteRoute
  '/patients/$id': typeof DashboardPatientsIdIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_dashboard': typeof DashboardRouteWithChildren
  '/_dashboard/': typeof DashboardIndexRoute
  '/sign-in/': typeof SignInIndexRoute
  '/_dashboard/notifications': typeof DashboardNotificationsRoute
  '/_dashboard/patients/': typeof DashboardPatientsIndexRoute
  '/_dashboard/users/': typeof DashboardUsersIndexRoute
  '/_dashboard/patients/invite': typeof DashboardPatientsInviteRoute
  '/_dashboard/users/$id': typeof DashboardUsersIdRoute
  '/_dashboard/users/invite': typeof DashboardUsersInviteRoute
  '/_dashboard/patients/$id/': typeof DashboardPatientsIdIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/'
    | '/sign-in'
    | '/notifications'
    | '/patients'
    | '/users'
    | '/patients/invite'
    | '/users/$id'
    | '/users/invite'
    | '/patients/$id'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/sign-in'
    | '/notifications'
    | '/patients'
    | '/users'
    | '/patients/invite'
    | '/users/$id'
    | '/users/invite'
    | '/patients/$id'
  id:
    | '__root__'
    | '/_dashboard'
    | '/_dashboard/'
    | '/sign-in/'
    | '/_dashboard/notifications'
    | '/_dashboard/patients/'
    | '/_dashboard/users/'
    | '/_dashboard/patients/invite'
    | '/_dashboard/users/$id'
    | '/_dashboard/users/invite'
    | '/_dashboard/patients/$id/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  DashboardRoute: typeof DashboardRouteWithChildren
  SignInIndexRoute: typeof SignInIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  DashboardRoute: DashboardRouteWithChildren,
  SignInIndexRoute: SignInIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "~__root.tsx",
      "children": [
        "/_dashboard",
        "/sign-in/"
      ]
    },
    "/_dashboard": {
      "filePath": "~_dashboard.tsx",
      "children": [
        "/_dashboard/",
        "/_dashboard/notifications",
        "/_dashboard/patients/",
        "/_dashboard/users/",
        "/_dashboard/patients/invite",
        "/_dashboard/users/$id",
        "/_dashboard/users/invite",
        "/_dashboard/patients/$id/"
      ]
    },
    "/_dashboard/": {
      "filePath": "~_dashboard/~index.tsx",
      "parent": "/_dashboard"
    },
    "/sign-in/": {
      "filePath": "~sign-in/~index.tsx"
    },
    "/_dashboard/notifications": {
      "filePath": "~_dashboard/~notifications.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/patients/": {
      "filePath": "~_dashboard/~patients/~index.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/users/": {
      "filePath": "~_dashboard/~users/~index.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/patients/invite": {
      "filePath": "~_dashboard/~patients/~invite.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/users/$id": {
      "filePath": "~_dashboard/~users/~$id.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/users/invite": {
      "filePath": "~_dashboard/~users/~invite.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/patients/$id/": {
      "filePath": "~_dashboard/~patients/~$id/~index.tsx",
      "parent": "/_dashboard"
    }
  }
}
ROUTE_MANIFEST_END */
