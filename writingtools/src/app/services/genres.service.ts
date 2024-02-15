import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Genre } from '../models/Genre';
import { PromptsService } from './prompts.service';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  genreCollection: AngularFirestoreCollection<Genre>;
  genreDoc!: AngularFirestoreDocument<Genre>;
  genres!: Observable<Genre[]>;
  genre!: Observable<Genre>;

  constructor(
    private afs: AngularFirestore,
    private promptsService: PromptsService,
  ) {
    this.genreCollection = this.afs.collection<Genre>('genres', (ref) =>
      ref.orderBy('value', 'asc'),
    );
  }

  getGenres(): Observable<Genre[]> {
    this.genres = this.genreCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as Genre;
          data.id = action.payload.doc.id;
          return data;
        });
      }),
    );

    return this.genres;
  }

  getGenre(id: string) {
    this.genreDoc = this.afs.doc<Genre>(`genres/${id}`);
    this.genre = this.genreDoc.snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as Genre;
          data.id = action.payload.id;
          return data;
        }
      }),
    );

    return this.genre;
  }

  addCategory(genre: Genre) {
    // add to firestore
    this.genreCollection.doc(genre.id).set(genre);
  }

  updateCategory(genre: Genre) {
    this.genreDoc = this.afs.doc(`categories/${genre.id}`);
    this.genreDoc.update(genre);
  }

  deleteCategory(genre: Genre) {
    // find genre
    this.genreDoc = this.afs.doc(`genres/${genre.id}`);

    // manually cascade delete all prompts with references to the genre
    this.promptsService.deletePromptsByGenre(genre.value);

    // delete genre from firestore
    this.genreDoc.delete();
  }
}
