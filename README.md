# Codenames

This is a simple multiplayer game where you uncover cryptic agents names in two teams. It is based on real game called Codenames. My digital version offers a game board with random words each game, 3 player teams: rose, indigo, spectators and a global chat for communication and game notifications. Website is designed to work on desktops as well as mobile.

The game was build using [Vue.js](https://vuejs.org/) framework for front-end and simple [Node.js](https://nodejs.org/en/) server for back-end. It uses WebSockets for quick and synchronous communication between players. [Tailwind](https://tailwindcss.com/) CSS framework was used for easy front-end layouts.

Check out the game online at 🌐 https://retro-codenames.netlify.app/ (hosted by [Netlify](https://www.netlify.com/) ❤).

## List of potential additions

* Turn based system (blocking and enabling players to flip the cards depending on current state)
* Time limiting (each team have set time for making a turn, adjustable timer would end turn when it hits zero)
* Session system (after exiting the game by closing the tab or refreshing the page player would still connect to the game without a need for code typing)
* Multiple word sets / language versions as a room setting

## Screenshots
![Lobby](https://user-images.githubusercontent.com/36575365/128519018-766d7403-f1bb-47bc-a6e5-85f4eec6ef96.png)

![Game screen with cards](https://user-images.githubusercontent.com/36575365/128519040-285de1db-7945-4468-93b2-a7816e86b40c.png)

![Game over](https://user-images.githubusercontent.com/36575365/128519055-a4b4319b-aade-4dda-b758-73a757ae8b74.png)
