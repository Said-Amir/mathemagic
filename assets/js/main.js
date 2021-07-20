let game = new Phaser.Game({
    width : 800,
    height : 648*2,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 400,
            height: 648,
        },
        max: {
            width: 1152,
            height: 2048,
        },
    },
    backgroundColor : "0x802754",
    type : Phaser.AUTO,
    physics : {default : "arcade", arcade:{debug: true}}
});

// ****************************** Scene Preload ***************************
class ScenePreload extends Phaser.Scene{
    constructor(){
        super();
    }

    init(){

    }

    preload(){
        this.load.image('title', 'assets/img/mathemagic11.png');
        this.load.image('equal', 'assets/img/equal1.png');
        this.load.image('caramel', 'assets/img/caramel1.png');
        this.load.image('logo', 'assets/img/logo1.png');
        this.load.image('play', 'assets/img/play5.png');
        this.load.audio('success', 'assets/audio/success.wav');
        this.load.audio('wrong', 'assets/audio/wrongSound.wav');
        this.load.audio('win', 'assets/audio/win.wav');
        this.load.audio('hold', 'assets/audio/hold.wav');
        this.load.audio('finish', 'assets/audio/finish.wav');
        this.load.image('plus', 'assets/img/plus.png');
        this.load.image('minus', 'assets/img/minus.png');
        this.load.image('star', 'assets/img/star.png');
    }

    create(){
        this.scene.start("caramel");
    }
}

// ************************** Scene Caramel Edition ***********************
class SceneCaramel extends Phaser.Scene{
    constructor(){
        super();
    }

    init(){

    }

    preload(){

    }

    create(){
        this.caramel = this.add.image(400, 400, 'caramel');
        this.caramel.scale = 0.5;
        this.caramel.alpha = 0;
        this.tweens.add({
            alpha: 1,
            targets: [this.caramel],
            ease: 'Cubic.easeIn', 
            duration: 1000,
            hold: 1000,
            repeat:0,
            yoyo: true,
            onComplete: () => {
                this.scene.start('title');
            }
        });
    }

}

// ***************************** Scene Title ******************************
class SceneTitle extends Phaser.Scene{
    constructor(){
        super();
    }

    init(){

    }

    preload(){

    }

    create(){
        this.cameras.main.fadeIn(1000, 128, 39, 84);
        this.logo = this.add.image(400, 400, 'logo');
        this.play = this.add.image(400, 900, 'play');
        this.play.scale = 1.5;
        this.play.setInteractive().on('pointerdown', () => {
            this.play.y += 4;
            this.cameras.main.fadeOut(600, 128, 39, 84);
            this.cameras.main.once('camerafadeoutcomplete', () => { 
                this.scene.start("game"); 
            });
        });
        this.play.on('pointerover', ()=>{
            this.play.y -= 4;
        });

        this.play.on('pointerout', ()=>{
            this.play.y += 4;
        });

        this.tweens.add({
            y: 420,
            targets: [this.logo],
            duration: 1000,
            repeat:-1,
            yoyo: true
        });
    }

}

// ******************************** Level 1 *******************************
class SceneGame extends Phaser.Scene{
    init(){

    }

    preload(){

    }

    create(){
        this.level = [
            [1, 1, 2],
            [1, 0, 1],
            [2, 1, 3]
        ];
        
        this.levelTodo = [
            [1, null, 2],
            [null, 0, 1],
            [2, 1, null]
        ];

        this.correct = 0;
        this.rectangles = [];
        this.diff = [];
        this.gap = 50;
        this.size = 150;
        this.zones = [];
        this.title = this.add.image(400, 200, 'title');
        this.title.scale = 1.2;
        this.cameras.main.fadeIn(600, 128, 39, 84);

        this.plus = this.add.image(325, 450, 'plus');
        this.plus.scale = 0.6;

        this.plus = this.add.image(325, 650, 'plus');
        this.plus.scale = 0.6;

        this.plus = this.add.image(325, 850, 'plus');
        this.plus.scale = 0.6;

        this.plus = this.add.image(225, 550, 'plus');
        this.plus.scale = 0.6;

        this.plus = this.add.image(425, 550, 'plus');
        this.plus.scale = 0.6;

        this.plus = this.add.image(625, 550, 'plus');
        this.plus.scale = 0.6;

        this.equal = this.add.image(625, 750, 'equal');
        this.equal.scale = 0.6;

        this.equal = this.add.image(425, 750, 'equal');
        this.equal.scale = 0.6;

        this.equal = this.add.image(225, 750, 'equal');
        this.equal.scale = 0.6;

        this.equal = this.add.image(525, 850, 'equal');
        this.equal.scale = 0.6;

        this.equal = this.add.image(525, 650, 'equal');
        this.equal.scale = 0.6;

        this.equal = this.add.image(525, 450, 'equal');
        this.equal.scale = 0.6;

        // Creation of the game's array
        for (let i = 0; i < this.levelTodo.length; i++) {
            for (let j = 0; j < this.levelTodo[i].length; j++) {
                let x = (i*(this.size+this.gap))+this.size;
                let y = (j*(this.size+this.gap))+(this.size*2.5); 
                let rect
                if ((i+j*3)%2 === 0) {
                    rect = this.add.rectangle(x, y, this.size, this.size, 0xd64374);
                }else{  
                    rect = this.add.rectangle(x, y, this.size, this.size, 0x701c6c);
                }
                rect.setInteractive();
                rect.setOrigin(0, 0);
                this.rectangles.push(rect);

                let texts = this.add.text(x+this.size/2, y+this.size/2, this.levelTodo[j][i]).setOrigin(.5, .5);
                texts.scale = 2;

                if (this.levelTodo[j][i] != this.level[j][i]) {
                    this.diff.push(this.level[j][i]);
                    this.zones.push(this.add.zone(x, y, this.size, this.size).setRectangleDropZone(this.size, this.size).setOrigin(0, 0).setName(this.level[j][i]));
                }
            }
        }
        
        // Creation of numbers to put in 
        for (let i = 0; i < this.diff.length; i++) {
            let x = ((i*(this.size+this.gap))+this.size)+this.size/2;
            const element = this.diff[i];
            let number = this.add.text(x, 1100, element).setOrigin(.5, .5).setInteractive();
            number.scale = 2;
            number.canDrag = true;
            number.setName(number.text);
            
            this.input.setDraggable(number);
        }
        
        this.input.on('dragstart', (pointer, gameObject, dragX, dragY) => {
            if (gameObject.canDrag) {
                this.sound.play('hold');
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject.canDrag) {
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
        });
        
        this.input.on('drop',  (pointer, gameObject, dropZone) => {
            if(gameObject.name == dropZone.name){
                gameObject.x = dropZone.x+(this.size/2);
                gameObject.y = dropZone.y+(this.size/2);
                if (gameObject.canDrag) {
                    this.correct++;
                    this.sound.play('success');
                }
                gameObject.canDrag = false;

                if (this.correct == this.diff.length) {
                    this.sound.play('finish');
                    this.cameras.main.fadeOut(600, 128, 39, 84);
                    this.cameras.main.once('camerafadeoutcomplete', () => { 
                        this.scene.start("game2"); 
                    });
                }
        }else{
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                this.sound.play('wrong');
            }
        });

    }
}

// ******************************** Level 2 ********************************
class SceneGame2 extends Phaser.Scene{
    init(){

    }

    preload(){

    }

    create(){
        this.level = [
            [3, 1, 4],
            [2, 1, 1],
            [5, 2, 3]
        ];
        
        this.levelTodo = [
            [3, 1, null],
            [null, 1, 1],
            [5, null, 3]
        ];
        
        this.correct = 0;
        this.rectangles = [];
        this.diff = [];
        this.gap = 50;
        this.size = 150;
        this.zones = [];
        this.title = this.add.image(400, 200, 'title');
        this.title.scale = 1.2;
        this.cameras.main.fadeIn(600, 128, 39, 84);

        this.plus = this.add.image(325, 450, 'plus');
        this.plus.scale = 0.6;

        this.plus = this.add.image(325, 650, 'equal');
        this.plus.scale = 0.6;

        this.plus = this.add.image(325, 850, 'minus');
        this.plus.scale = 0.6;

        this.plus = this.add.image(225, 550, 'plus');
        this.plus.scale = 0.6;

        this.plus = this.add.image(425, 550, 'plus');
        this.plus.scale = 0.6;

        this.plus = this.add.image(625, 550, 'minus');
        this.plus.scale = 0.6;

        this.equal = this.add.image(625, 750, 'equal');
        this.equal.scale = 0.6;

        this.equal = this.add.image(425, 750, 'equal');
        this.equal.scale = 0.6;

        this.equal = this.add.image(225, 750, 'equal');
        this.equal.scale = 0.6;

        this.equal = this.add.image(525, 850, 'equal');
        this.equal.scale = 0.6;

        this.equal = this.add.image(525, 650, 'plus');
        this.equal.scale = 0.6;

        this.equal = this.add.image(525, 450, 'equal');
        this.equal.scale = 0.6;

        // Creation of the game's array
        for (let i = 0; i < this.levelTodo.length; i++) {
            for (let j = 0; j < this.levelTodo[i].length; j++) {
                let x = (i*(this.size+this.gap))+this.size;
                let y = (j*(this.size+this.gap))+(this.size*2.5); 
                let rect
                if ((i+j*3)%2 === 0) {
                    rect = this.add.rectangle(x, y, this.size, this.size, 0xd64374);
                }else{  
                    rect = this.add.rectangle(x, y, this.size, this.size, 0x701c6c);
                }
                rect.setInteractive();
                rect.setOrigin(0, 0);
                this.rectangles.push(rect);

                let texts = this.add.text(x+this.size/2, y+this.size/2, this.levelTodo[j][i]).setOrigin(.5, .5);
                texts.scale = 2;

                if (this.levelTodo[j][i] != this.level[j][i]) {
                    this.diff.push(this.level[j][i]);
                    this.zones.push(this.add.zone(x, y, this.size, this.size).setRectangleDropZone(this.size, this.size).setOrigin(0, 0).setName(this.level[j][i]));
                }
            }
        }
        
        // Creation of numbers to put in 
        for (let i = 0; i < this.diff.length; i++) {
            let x = ((i*(this.size+this.gap))+this.size)+this.size/2;
            const element = this.diff[i];
            let number = this.add.text(x, 1100, element).setOrigin(.5, .5).setInteractive();
            number.scale = 2;
            number.canDrag = true;
            number.setName(number.text);
            
            this.input.setDraggable(number);
        }
        
        this.input.on('dragstart', (pointer, gameObject, dragX, dragY) => {
            if (gameObject.canDrag) {
                this.sound.play('hold');
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject.canDrag) {
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
        });
        
        this.input.on('drop',  (pointer, gameObject, dropZone) => {
            
            if(gameObject.name == dropZone.name){
                gameObject.x = dropZone.x+(this.size/2);
                gameObject.y = dropZone.y+(this.size/2);
                if (gameObject.canDrag) {
                    this.correct++;
                    this.sound.play('success');
                }
                gameObject.canDrag = false;

                if (this.correct == this.diff.length) {
                    this.sound.play('finish');
                    this.cameras.main.fadeOut(600, 128, 39, 84);
                    this.cameras.main.once('camerafadeoutcomplete', () => { 
                        this.scene.start("game3"); 
                    });
                }
                
        }else{
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                this.sound.play('wrong');
                
            }
        });

    }
}

// ******************************** Level 3 ********************************
class SceneGame3 extends Phaser.Scene{
    init(){

    }

    preload(){

    }

    create(){
        this.level = [
            [3, 3, 0],
            [2, 2, 4],
            [5, 1, 4]
        ];
        
        this.levelTodo = [
            [null, 3, 0],
            [2, null, 4],
            [5, null, 4]
        ];
        
        this.correct = 0;
        this.rectangles = [];
        this.diff = [];
        this.gap = 50;
        this.size = 150;
        this.zones = [];
        this.title = this.add.image(400, 200, 'title');
        this.title.scale = 1.2;
        this.cameras.main.fadeIn(600, 128, 39, 84);

        this.plus = this.add.image(325, 450, 'minus');
        this.plus.scale = 0.6;

        this.plus = this.add.image(325, 650, 'plus');
        this.plus.scale = 0.6;

        this.plus = this.add.image(325, 850, 'minus');
        this.plus.scale = 0.6;

        this.plus = this.add.image(225, 550, 'plus');
        this.plus.scale = 0.6;

        this.plus = this.add.image(425, 550, 'equal');
        this.plus.scale = 0.6;

        this.plus = this.add.image(625, 550, 'equal');
        this.plus.scale = 0.6;

        this.equal = this.add.image(625, 750, 'minus');
        this.equal.scale = 0.6;

        this.equal = this.add.image(425, 750, 'plus');
        this.equal.scale = 0.6;

        this.equal = this.add.image(225, 750, 'equal');
        this.equal.scale = 0.6;

        this.equal = this.add.image(525, 850, 'equal');
        this.equal.scale = 0.6;

        this.equal = this.add.image(525, 650, 'equal');
        this.equal.scale = 0.6;

        this.equal = this.add.image(525, 450, 'equal');
        this.equal.scale = 0.6;

        // Creation of the game's array
        for (let i = 0; i < this.levelTodo.length; i++) {
            for (let j = 0; j < this.levelTodo[i].length; j++) {
                let x = (i*(this.size+this.gap))+this.size;
                let y = (j*(this.size+this.gap))+(this.size*2.5); 
                let rect
                if ((i+j*3)%2 === 0) {
                    rect = this.add.rectangle(x, y, this.size, this.size, 0xd64374);
                }else{  
                    rect = this.add.rectangle(x, y, this.size, this.size, 0x701c6c);
                }
                rect.setInteractive();
                rect.setOrigin(0, 0);
                this.rectangles.push(rect);

                let texts = this.add.text(x+this.size/2, y+this.size/2, this.levelTodo[j][i]).setOrigin(.5, .5);
                texts.scale = 2;

                if (this.levelTodo[j][i] != this.level[j][i]) {
                    this.diff.push(this.level[j][i]);
                    this.zones.push(this.add.zone(x, y, this.size, this.size).setRectangleDropZone(this.size, this.size).setOrigin(0, 0).setName(this.level[j][i]));
                }
            }
        }
        
        
        // Creation of numbers to put in 
        for (let i = 0; i < this.diff.length; i++) {
            let x = ((i*(this.size+this.gap))+this.size)+this.size/2;
            const element = this.diff[i];
            let number = this.add.text(x, 1100, element).setOrigin(.5, .5).setInteractive();
            number.scale = 2;
            number.canDrag = true;
            number.setName(number.text);
            
            this.input.setDraggable(number);
        }
        
        this.input.on('dragstart', (pointer, gameObject, dragX, dragY) => {
            if (gameObject.canDrag) {
                this.sound.play('hold');
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject.canDrag) {
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
        });
        
        this.input.on('drop',  (pointer, gameObject, dropZone) => {
            
            if(gameObject.name == dropZone.name){
                gameObject.x = dropZone.x+(this.size/2);
                gameObject.y = dropZone.y+(this.size/2);
                if (gameObject.canDrag) {
                    this.correct++;
                    this.sound.play('success');
                }
                gameObject.canDrag = false;

                if (this.correct == this.diff.length) {
                    this.sound.play('finish');
                    this.cameras.main.fadeOut(600, 128, 39, 84);
                    this.cameras.main.once('camerafadeoutcomplete', () => { 
                        this.scene.start("win"); 
                    });
                }
                
        }else{
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                this.sound.play('wrong');
                
            }
        });

    }
}

// ****************************** Win the Game *****************************
class SceneWin extends Phaser.Scene{
    constructor(){
        super();
    }

    init(){

    }

    preload(){

    }

    create(){
        this.cameras.main.fadeIn(1000, 128, 39, 84);
        for (let i = 1; i <= 3; i++) {
            if (i % 2 == 0) {
                this.star = this.add.image((i*200), 200, 'star');
                this.star.scale = 1.5; 
            }else{
                this.star = this.add.image((i*200), 300, 'star');
                this.star.scale = 1.5; 
            }
        }
        this.winGame = this.add.text(200, 600, "Congratulations, You Won!");
        this.winGame.scale = 2;
    }

}

game.scene.add("preload", ScenePreload, true);
game.scene.add("caramel", SceneCaramel);
game.scene.add("title", SceneTitle);
game.scene.add("game", SceneGame);
game.scene.add("game2", SceneGame2);
game.scene.add("game3", SceneGame3);
game.scene.add("win", SceneWin);