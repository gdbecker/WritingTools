# Writing Tools Angular App

Coming Soon

## Table of contents

- [Writing Tools Angular App](#writing-tools-angular-app)
	- [Table of contents](#table-of-contents)
	- [Overview](#overview)
		- [Home Page](#home-page)
		- [Ideas Page](#ideas-page)
		- [Timer Page](#timer-page)
		- [Links](#links)
	- [My process](#my-process)
		- [Built with](#built-with)
		- [What I learned](#what-i-learned)
		- [Continued development](#continued-development)
		- [Useful resources](#useful-resources)
	- [Author](#author)

## Overview

### Home Page

![](./HomePage.png)

### Ideas Page

![](./IdeasPage.png)

### Timer Page

![](./TimerPage.png)

### Links

- [Live Site URL](https://writingtools-6b653.web.app)

## My process

### Built with

- [Angular](https://angular.io/) - frontend framework
- Typescript
- HTML5
- CSS
- Bootstrap
- Mobile-first workflow
- [VS Code](https://code.visualstudio.com)

### What I learned

Coming soon

Here are a few code samples from this project:

```ts
// Picking a random prompt on the Ideas page
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
```

```ts
// Part of the Pomodoro timer functionality
startTimer() {
	this.reps += 1;
	clearTimeout(this.timer);

	this.leftBtnLabel = "Skip to Next";

	const workSec = this.workMin * 60;
	const shortBreakSec = this.shortBreakMin * 60;
	const longBreakSec = this.longBreakMin * 60;

	// if it's the 1st/3rd/5th/7th rep:
	if (this.reps % 8 === 0) {
		this.timerLabel = "Long Break";
		this.countDown(longBreakSec);
	} else if (this.reps % 2 === 0) {
		this.timerLabel = "Short Break";
		this.countDown(shortBreakSec);
	} else {
		this.timerLabel = "Work";
		this.countDown(workSec);
		const numMarks = Math.floor(this.reps / 2);
		const marksArray = [];

		for (let i = 0; i < numMarks; i++) {
			marksArray.push("✔");
		}

		this.checkMarks = marksArray.join("");
	}
}
```

```css
/* Styling for the home page */
.content {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  text-align: center;
  position: absolute;
  right: 20%;
  width: 30vw;
}
```

### Continued development

As a starter developer, I want to keep discovering different tools and finding different ways of building, because one stack might be better for a situation than another. For a while I was getting used to React.js and Next.js, so I wanted to try building an entire Angular app on my own to make myself uncomfortable and be able to learn through challenges that arise. Working on this project gives me confidence to keep doing this!

### Useful resources

- [Stack Overflow](https://stackoverflow.com/) - Stack Overflow was a lifesaver for this project especially when figuring out intricacies with those Angular Observables and grabbing data from Firebase. Finding different answers that contributed to different parts of the challenges I had helped me piece together what I needed.

## Author

- Website - [Garrett Becker]()
- LinkedIn - [Garrett Becker](https://www.linkedin.com/in/garrett-becker-923b4a106/)