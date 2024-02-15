import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirstName } from '../models/FirstName';

@Injectable({
  providedIn: 'root',
})
export class FirstNameService {
  firstNameCollection: AngularFirestoreCollection<FirstName>;
  firstNameDoc!: AngularFirestoreDocument<FirstName>;
  firstNames!: Observable<FirstName[]>;
  firstName!: Observable<FirstName>;

  constructor(private afs: AngularFirestore) {
    this.firstNameCollection = this.afs.collection<FirstName>('firstnames', (ref) =>
      ref.orderBy('value', 'asc'),
    );
  }

  getFirstNames(): Observable<FirstName[]> {
    this.firstNames = this.firstNameCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as FirstName;
          data.id = action.payload.doc.id;
          return data;
        });
      }),
    );

    return this.firstNames;
  }

  getFirstName(id: string): Observable<FirstName> {
    this.firstNameDoc = this.afs.doc<FirstName>(`firstnames/${id}`);
    this.firstName = this.firstNameDoc.snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as FirstName;
          data.id = action.payload.id;
          return data;
        }
      }),
    );

    return this.firstName;
  }

  addFirstName(firstName: FirstName) {
    // add to firestore
    this.firstNameCollection.doc(firstName.id).set(firstName);
  }

  updateFirstName(firstName: FirstName) {
    this.firstNameDoc = this.afs.doc(`firstnames/${firstName.id}`);
    this.firstNameDoc.update(firstName);
  }

  deleteFirstName(id: string) {
    this.firstNameDoc = this.afs.doc(`firstnames/${id}`);
    this.firstNameDoc.delete();
  }
}
