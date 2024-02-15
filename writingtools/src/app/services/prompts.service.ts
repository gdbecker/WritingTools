import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Prompt } from '../models/Prompt';
import { Genre } from '../models/Genre';

@Injectable({
  providedIn: 'root',
})
export class PromptsService {
  promptCollection: AngularFirestoreCollection<Prompt>;
  promptDoc!: AngularFirestoreDocument<Prompt>;
  prompts!: Observable<Prompt[]>;
  prompt!: Observable<Prompt>;

  constructor(private afs: AngularFirestore) {
    this.promptCollection = this.afs.collection<Prompt>('prompts', (ref) =>
      ref.orderBy('value', 'asc'),
    );
  }

  getPrompts(): Observable<Prompt[]> {
    this.prompts = this.promptCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as Prompt;
          data.id = action.payload.doc.id;
          return data;
        });
      }),
    );

    return this.prompts;
  }

  getPromptsByGenre(genre: string): Observable<Prompt[]> {
    this.prompts = this.promptCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as Prompt;
          data.id = action.payload.doc.id;
          return data;
        });
      }),
      map((prompts) => {
        return prompts.filter((prompt) => prompt.genre.id === genre.toLowerCase());
      }),
    );

    return this.prompts;
  }

  getPrompt(id: string): Observable<Prompt> {
    this.promptDoc = this.afs.doc<Prompt>(`prompts/${id}`);
    this.prompt = this.promptDoc.snapshotChanges().pipe(
      map((action) => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as Prompt;
          data.id = action.payload.id;
          return data;
        }
      }),
    );

    return this.prompt;
  }

  addPrompt(prompt: Prompt) {
    // make genre reference
    let genre = this.afs.doc<Genre>(`genres/${prompt.genre.id}`);
    prompt.genre = genre.ref;

    // add to firestore
    this.promptCollection.doc(prompt.id).set(prompt);
  }

  updatePrompt(prompt: Prompt) {
    this.promptDoc = this.afs.doc(`prompts/${prompt.id}`);
    this.promptDoc.update(prompt);
  }

  deletePrompt(id: string) {
    this.promptDoc = this.afs.doc(`prompts/${id}`);
    this.promptDoc.delete();
  }

  deletePromptsByGenre(genre: string) {
    let prompts = this.getPromptsByGenre(genre).subscribe(prompts => {
      prompts.forEach(prompt => {
        this.deletePrompt(prompt.id);
      });
    });
  }
}
