function index(){
    stage.removeChildren();
    ticker.destroy();
    ticker = new PIXI.ticker.Ticker();
    ticker.start();

    newButton("Funtime Foxy", 0xFF00FF, function(){
        $.getJSON("funtime-foxy.json",load_puppet);
    }, 16,16);
    newButton("Catty", 0xDAB6FF, function(){
        $.getJSON("catty.json",load_puppet);
    }, 16,48);
    newButton("Griotte", 0x80002A, function(){
        $.getJSON("griotte.json",load_puppet);
    }, 16,80);
    newButton("Hariet", 0x7D00FF, function(){
        $.getJSON("hariet.json",load_puppet);
    }, 16,112);
}

function load_puppet(puppet){
    stage.removeChildren();

    newButton("Back", 0xC0C0C0, index, 16,16);

    var loader = new PIXI.loaders.Loader();

    loader
    .add('spineCharacter', 'spine-assets/' + puppet.name + '-sprite.json')
    .load(function (loader, resources) {
        var animation = new PIXI.spine.Spine(resources.spineCharacter.spineData);
        var skeleton = animation.skeleton;
        stage.addChild(animation);

        animation.position.set(640,700);
        skeleton.setSkinByName(puppet.skins[0].name);

        function playAnim(){
            animation.state.setEmptyAnimation(0,0);
            for (var anim of puppet.animations){
                animation.state.addAnimation(0, anim.name, false, 0);
            }
        }

        playAnim();

        newButton("Replay", 0xC0C0C0, playAnim, 16,48);

        var buttontop = 704 - (32*puppet.skins.length);

        function setSkin(skin){
            var skinname = skin.name;
            return function() {
                skeleton.setSkinByName(skinname);
                skeleton.setSlotsToSetupPose();
            }
        }

        for (var skin of puppet.skins){
            newButton(skin.label, 0xC0C0C0, setSkin(skin), 16, buttontop);
            buttontop += 32;
        }
    });
}

function newButton(text,color,func, x, y){
    var button = new PIXI.Text(text, {fill: color});
    button.interactive = true;
    button.on("mouseover",function(){
        button.savedcolor = button.style.fill;
        button.style.fill = 0xFFFFFF;
    });
    button.on("mouseout",function(){
        button.style.fill = button.savedcolor;
    });
    button.on("click", func);

    button.x = x;
    button.y = y;
    
    stage.addChild(button);
}