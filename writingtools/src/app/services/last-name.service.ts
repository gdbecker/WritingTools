import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LastName } from '../models/LastName';

@Injectable({
  providedIn: 'root',
})
export class LastNameService {
  lastNameCollection: AngularFirestoreCollection<LastName>;
  lastNameDoc!: AngularFirestoreDocument<LastName>;
  lastNames!: Observable<LastName[]>;
  lastName!: Observable<LastName>;

  constructor(private afs: AngularFirestore) {
    this.lastNameCollection = this.afs.collection<LastName>('lastnames', (ref) =>
      ref.orderBy('value', 'asc'),
    );
  }

  getLastNames(): Observable<LastName[]> {
    this.lastNames = this.lastNameCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as LastName;
          data.id = action.payload.doc.id;
          return data;
        });
      }),
    );

    return this.lastNames;
  }

  getLastName(id: string): Observable<LastName> {
    this.lastNameDoc = this.afs.doc<LastName>(`lastnames/${id}`);
    this.lastName = this.lastNameDoc.snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as LastName;
          data.id = action.payload.id;
          return data;
        }
      }),
    );

    return this.lastName;
  }

  addLastName(lastName: LastName) {
    // add to firestore
    this.lastNameCollection.doc(lastName.id).set(lastName);
  }

  updateLastName(lastName: LastName) {
    this.lastNameDoc = this.afs.doc(`lastnames/${lastName.id}`);
    this.lastNameDoc.update(lastName);
  }

  deleteLastName(id: string) {
    this.lastNameDoc = this.afs.doc(`lastnames/${id}`);
    this.lastNameDoc.delete();
  }
}

