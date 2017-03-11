function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var best_score;
if (getCookie('best') == "") {
	best_score = 0;
	setCookie('best', 0, 365);
}
best_score = getCookie('best');

var s;
// The Scale of the grid.
var scl = 20;
var food = {
  x: 0,
  y: 0,
};
// Sets the frame rate.
var fps = 10;
// Score
var score = 0;
var best = 0; 
// set the font size.
var fontSize = 46;
// Another fps int to comper.
var anotherfps;
// on off switch in order to w8 some time before picking 
// a new location
var SetTimeInterval = false;
// Song part + the sliders
var song;
var volSlider;
var volAmount = 0;

function setup() {
  createCanvas((innerWidth - 38) - ((innerWidth - 38)%20),
							 (innerHeight/1.25) - ((innerHeight/1.25)%20));
	song = loadSound("arcde.mp3", loaded);
	//slider
	volSlider = createSlider(0,0.5,0,0.01);
	//volSlider.position(8 + 129/2,innerHeight - 53);
	// score
  score = createP();
	score.html("Score: 0");
	// best
  best = createP();
	// changes the cookie.
	best.html("Best: " + best_score);
  frameRate(fps);
  reset();
}

function loaded() {
	song.loop();
}

function reset() {
  s = new Snake();
  var location = pickLocation();
  s.x = location.x;
  s.y = location.y;
  food = pickLocation();
	song.stop();
	if(song.isLoaded()) {
		song.loop();
	}
	SetTimeInterval = false;
}

function pickLocation() {
  var cols = floor(width/scl);
  var rows = floor(height/scl);  
  return {
      x: floor(random(cols)) * scl,
      y: floor(random(rows)) * scl
  }
}

function draw() {
	frameRate(fps);
	background(50);
	song.rate(0.99 + (fps/1000));
	volSlider.value(volAmount);
	song.setVolume(volSlider.value());
  
	// Updates the score and the best score in a two paragraphs.
  score.html("<p style='font-size: "+ fontSize +"px'>Score: " + s.total + "</p>"); 
  best.html("Best: " + best_score);
	
  if (s.eat(food)) {
		anotherfps = frameCount;
		SetTimeInterval = true;
		food.x = width + scl;
		fontSize = 72;
	}
	if (frameCount > anotherfps+2 && SetTimeInterval == true) {
		fontSize = 46;
		if (frameCount > anotherfps+10 && SetTimeInterval == true) {
			// w8 some time before putting another food.
			fps++;
			food = pickLocation();
			SetTimeInterval = false;
  	}
	}
  s.death();
  s.update();
  s.show();
  //food  
  fill(255,0,100);
  rect(food.x, food.y, scl, scl);
}

function keyPressed() {
  if (keyCode === UP_ARROW && s.yspeed != 1) {
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW && s.yspeed != -1){
    s.dir(0, 1);
  } else if (keyCode === LEFT_ARROW && s.xspeed != 1){
    s.dir(-1, 0);
  } else if (keyCode === RIGHT_ARROW && s.xspeed != -1){
    s.dir(1, 0);
  }
	
	if (keyCode === 49) {
		if ( volAmount <= 0.05) {
			volAmount -= 0.05
		}
	} else if (keyCode === 50) {
		if (volAmount >= 0.45) {
			volAmount += 0.05
		}
  }
}
