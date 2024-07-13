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

interface Organization {
  owners: string[]
}

interface Admin {}

interface Clinician {}

export const collectionNames = {
  admins: 'admins',
  clinicians: 'clinicians',
  organizations: 'organizations',
}

export const getCollectionRefs = (db: Firestore) => ({
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
