var appwidth = 1280;
var appheight = 720;
var indexData = {};
var stage = new PIXI.Container();
var ticker = new PIXI.ticker.Ticker();
var router = null;
var secret = false;

function init(){
    var app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight, autoResize: true, resolution: devicePixelRatio});
    document.body.appendChild(app.view);

    function resize(){
      var scale = Math.min(window.innerWidth/appwidth,window.innerHeight/appheight);
      app.stage.scale.set(scale,scale);
      app.stage.x = window.innerWidth/2 - ((appwidth*scale)/2);
      app.renderer.resize(window.innerWidth,window.innerHeight);
    }

    window.onresize = function(event){
      resize();
    }

    resize();

    function route_puppet(name){
      $.getJSON(name+".json",load_puppet)
      .fail(function(){
        alert("No puppet by the name \"" + name + "\" exists...yet!");
        router.setRoute("/");
      });
    }

    var routes = {
      '/': index,
      '/secret': {
          '/:name': function(name){
            secret = true;
            route_puppet(name);
          }
      },
      '/:name': route_puppet
    }

    router = Router(routes);
    app.stage.addChild(stage);

    ticker.start();

    app.start();

    $.getJSON("index.json", function(data){
        indexData = data.data;
        router.init("/");
    });
}

function index(){
    stage.removeChildren();
    ticker.destroy();
    ticker = new PIXI.ticker.Ticker();
    ticker.start();

    function setButton(item){
        var data = item.data;
        return function(){
            router.setRoute(data);
        }
    }

    var buttontop = 16;
    for (var item of indexData){
        if(item.type == "label"){
            newLabel(item.name, item.color, 16,buttontop); 
        }else if(item.type == "button"){
            newButton(item.name, item.color, setButton(item), 32,buttontop); 
        }
        buttontop += 32;
    }
}

function getLength(list){
    var total = 0;
    for(item of list){
        if(item.secret && !secret) continue;
        total += 1;
    }
    return total;
}

function load_puppet(puppet){
    stage.removeChildren();

    newButton("Back", 0xC0C0C0, function(){   
        router.setRoute("/");
    }, 16,16);

    var loader = new PIXI.loaders.Loader();

    loader
    .add('spineCharacter', 'spine-assets/' + puppet.name + '-sprite.json')
    .load(function (loader, resources) {
        var animation = new PIXI.spine.Spine(resources.spineCharacter.spineData);
        var skeleton = animation.skeleton;
        stage.addChild(animation);

        animation.position.set(appwidth/2,appheight*0.95);
        animation.scale.set(1,1);
        skeleton.setSkinByName(puppet.skins[0].name);

        function playSequence(sequence){
            for(var i=0;i<4;i++){
                animation.state.setEmptyAnimation(i,0);
            }
            for (var i of sequence.sequence){
                var anim = puppet.animations[i];
                var track = anim.track || 0;
                animation.state.addAnimation(track, anim.name, anim.loop, 0);
            }
        }

        playSequence(puppet.sequences[0]);

        var buttontop = 48;

        function setSequence(sequence){
            var thissequence = sequence;
            return function() {
                playSequence(sequence);
            }
        }

        for (var sequence of puppet.sequences){
            if(sequence.secret && !secret) continue;
            newButton(sequence.label, 0xC0C0C0, setSequence(sequence), 16, buttontop);
            buttontop += 32;
        }

        buttontop = 16;

        function setAnim(anim){
            var thisanim = anim;
            return function() {
                var track = anim.track || 0;
                if(track == 0){
                    for(var i=0;i<4;i++){
                        animation.state.setEmptyAnimation(i,0);
                    }
                }
                animation.state.addAnimation(track, thisanim.name, thisanim.loop, 0);
            }
        }

        for (var anim of puppet.animations){
            if(anim.secret && !secret) continue;
            newButton(anim.label, 0xC0C0C0, setAnim(anim), appwidth-16, buttontop, "right");
            buttontop += 32;
        }

        buttontop = (appheight-16) - (32*getLength(puppet.skins));

        function setSkin(skin){
            var skinname = skin.name;
            return function() {
                skeleton.setSkinByName(skinname);
                skeleton.setSlotsToSetupPose();
            }
        }

        for (var skin of puppet.skins){
            if(skin.secret && !secret) continue;
            newButton(skin.label, 0xC0C0C0, setSkin(skin), 16, buttontop);
            buttontop += 32;
        }
    });
}

function newLabel(text,color, x, y){
    var label = new PIXI.Text(text, {fill: color});

    label.x = x;
    label.y = y;
    
    stage.addChild(label);
}

function newButton(text,color,func, x, y, align){
    var button = new PIXI.Text(text, {fill: color, align: align});
    button.interactive = true;
    button.on("mouseover",function(){
        button.savedcolor = button.style.fill;
        button.style.fill = 0xFFFFFF;
    });
    button.on("mouseout",function(){
        button.style.fill = button.savedcolor;
    });
    button.on("pointerdown", func);

    if(align == "right"){
        button.x = x - button.width;
    }else{
        button.x = x
    }
    button.y = y;
    
    stage.addChild(button);
}