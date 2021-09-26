declare var require: any;
require('../styles/main.css');

import Main from './Main';

class Startup {
	private game: Main;

	constructor(game: Main) {
		this.game = game;
	}

	public init(): void {
		this.update();
	}

	private update(): void {
		requestAnimationFrame(this.update.bind(this)); 
		this.game.Update();
	}
}

// bootstrap
window.onload = () => {
	let main = new Startup(new Main());
	main.init();
}