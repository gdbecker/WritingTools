import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PromptsService } from '../../services/prompts.service';
import { GenresService } from '../../services/genres.service';
import { FirstNameService } from '../../services/first-name.service';
import { LastNameService } from '../../services/last-name.service';
import { Prompt } from '../../models/Prompt';
import { Genre } from '../../models/Genre';
import { FirstName } from '../../models/FirstName';
import { LastName } from '../../models/LastName';

@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['../../../styles.css', './ideas.component.css'],
})
export class IdeasComponent implements OnInit {
  prompt: Prompt = {
    id: '',
    genre: {
      id: '',
      value: '',
    },
    value: '',
  };
  prompts: Prompt[];
  genres!: Set<Genre>;
  firstName: FirstName = {
    id: '',
    value: 'Name',
  };
  firstNames!: FirstName[];
  lastName: LastName = {
    id: '',
    value: 'Name',
  };
  lastNames!: LastName[];
  index: number = 0;

  @ViewChild('promptForm') form1: any;
  @ViewChild('firstNameForm') form2: any;
  @ViewChild('lastNameForm') form3: any;

  constructor(
    private promptsService: PromptsService,
    private genresService: GenresService,
    private firstNameService: FirstNameService,
    private lastNameService: LastNameService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.genresService.getGenres().subscribe((genre) => {
      this.genres = new Set(genre);
    });

    this.firstNameService.getFirstNames().subscribe(names => {
      this.firstNames = names;
    });

    this.lastNameService.getLastNames().subscribe(names => {
      this.lastNames = names;
    });
  }

  onPromptSubmit({ value, valid }: { value: any; valid: boolean }) {
    if (!valid) {
      // show error
      alert('Please fill out all fields correctly');
    } else {
      this.promptsService.getPromptsByGenre(value.genre).subscribe(prompts => {
        prompts.forEach(prompt => {
          this.genresService.getGenre(prompt.genre.id).subscribe(genre => {
            prompt.genre = genre;
          });
        });
        // randomly shuffle
        prompts = this.shuffle(prompts);

        // assign first prompt
        this.prompt = prompts[this.index];

        // assign shuffled prompts to list
        this.prompts = prompts;
      });
    }
  }

  onFirstNameSubmit({ value, valid }: { value: any; valid: boolean }) {
    if (!valid) {
      // show error
      alert('Please fill out all fields correctly');
    } else {
      // randomly shuffle
      this.firstNames = this.shuffle(this.firstNames);

      // assign name
      this.firstName = this.firstNames[this.index];
    }
  }

  onLastNameSubmit({ value, valid }: { value: any; valid: boolean }) {
    if (!valid) {
      // show error
      alert('Please fill out all fields correctly');
    } else {
      // randomly shuffle
      this.lastNames = this.shuffle(this.lastNames);

      // assign name
      this.lastName = this.lastNames[this.index];
    }
  }

  shuffle(array: any[]) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }
}