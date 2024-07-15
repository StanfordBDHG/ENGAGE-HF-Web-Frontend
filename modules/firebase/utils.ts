import {
  collection,
  type CollectionReference,
  type Firestore,
} from 'firebase/firestore'
import { getApp, initializeApp } from 'firebase-admin/app'

export const getAdminApp = () => {
  try {
    return getApp('adminApp')
  } catch (error) {
    return initializeApp({}, 'adminApp')
  }
}

export interface Organization {
  id: string
  name: string
  contactName: string
  phoneNumber: string
  emailAddress: string
  owners: string[]
}

export interface Admin {}

export interface User {
  GenderIdentityKey: string
  invitationCode: string
  clinician?: string
  organization?: string
  language?: string
  timeZone?: string
}

export interface Clinician {
  organization?: string
}

export const collectionNames = {
  users: 'users',
  admins: 'admins',
  clinicians: 'clinicians',
  organizations: 'organizations',
}

export const getCollectionRefs = (db: Firestore) => ({
  users: () =>
    collection(db, collectionNames.users) as CollectionReference<User>,
  admins: () =>
    collection(db, collectionNames.admins) as CollectionReference<Admin>,
  clinicians: () =>
    collection(db, collectionNames.admins) as CollectionReference<Clinician>,
  organizations: () =>
    collection(
      db,
      collectionNames.organizations,
    ) as CollectionReference<Organization>,
})
