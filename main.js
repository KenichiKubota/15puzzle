'use strict';

// canvas要素の作成
const canvas = document.getElementById('canvas');
// 定数
const myConstants = {
    canvasWidth : 280
    ,canvasHeight :280
    ,rectWidth :60
    ,rectHeight :60
    ,moveSpeed:10
    ,direction:{
        up:0
        ,down:1
        ,left :2
        ,right:3
    }
    ,colors: {
        pattern1:{
            colorA:'#cff09e'
            , colorB : '#a8dba8'
            , colorC : '#79bd9a'
            , colorD : '#3b8686'
        }
        , pattern2:{
            colorA:'#f9c00c'
            , colorB : '#00b9f1'
            , colorC : '#7200da'
            , colorD : '#f9320c'
        }
        , pattern3:{
            colorA:'#a3daff'
            , colorB : '#1ec0ff'
            , colorC : '#0080ff'
            , colorD : '#03a6ff'
        }

    }
}

let myRects;

let selectedColorPattern = myConstants.colors.pattern1;

canvas.width = myConstants.canvasHeight;
canvas.height = myConstants.canvasHeight;

// コンテキストの取得
var ctx = canvas.getContext('2d');

class MyRect {

    constructor(x, y, num){
        this.width = myConstants.rectWidth;
        this.height = myConstants.rectHeight;
        this.x = x;
        this.y = y;
        this.nextX = x;
        this.nextY = y;
        this.num = num;
        this.chnageColor();
        this.animateFlg = false;
        this.render();
    }

    render(){
        console.log('render:' + this.num);
        ctx.clearRect(this.x, this.y, this.width, this.height);
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.nextX, this.nextY, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = "30px 'ＭＳ ゴシック'";
        ctx.fillText(this.num, this.nextX + (this.width/2), this.nextY+(this.height/2) , 50);
    }

    chnageColor(){
        if(this.num === 0){
            this.color = '#ffffff';
        }else if(this.num <= 4){
            this.color = selectedColorPattern.colorA;
        }else if(this.num <= 8){
            this.color = selectedColorPattern.colorB;
        }else if(this.num <= 12){
            this.color = selectedColorPattern.colorC;
        }else if(this.num <= 16){
            this.color = selectedColorPattern.colorD;
        }
    }

    move(direction, moveCount){
        if(this.animateFlg){
            return;
        }

        let moveX,moveY,afterX,afterY;
        if(direction===myConstants.direction.up){
            moveX = 0;
            moveY = -1 * myConstants.moveSpeed;
            afterX = this.x;
            afterY = this.y - moveCount * this.width;
    
        }else if(direction===myConstants.direction.down){
            moveX = 0;
            moveY = myConstants.moveSpeed;
            afterX = this.x;
            afterY = this.y + moveCount * this.width;
    
        }else if(direction===myConstants.direction.left){
            moveX = -1 * myConstants.moveSpeed;
            moveY = 0;
            afterX = this.x - moveCount * this.width;
            afterY = this.y;
    
        }else if(direction===myConstants.direction.right){
            moveX = myConstants.moveSpeed;
            moveY = 0;
            afterX = this.x + moveCount * this.width;
            afterY = this.y;
    
        }

        this.animateFlg = true;
        this.moveCore(moveX, moveY, afterX, afterY);

    }

    moveCore(moveX, moveY, afterX, afterY){
        if(moveX > 0){
            if(this.x + moveX > afterX){
                this.animateFlg = false;
                return;
            }    
        }else if(moveX < 0) {
            if(this.x + moveX < afterX){
                this.animateFlg = false;
                return;
            }
        }
        if(moveY > 0){
            if(this.y + moveY > afterY){
                this.animateFlg = false;
                return;
            }    
        }else if(moveY < 0){
            if(this.y + moveY < afterY){
                this.animateFlg = false;
                return;
            }    
        }

        this.nextX = this.x + moveX;
        this.nextY = this.y + moveY;
        this.render();
        this.x = this.nextX; 
        this.y = this.nextY;

        requestAnimationFrame(this.moveCore.bind(this, moveX, moveY, afterX, afterY));
    }
}


let initGame = function(){
    // クリア
    ctx.clearRect(0, 0, myConstants.canvasWidth, myConstants.canvasHeight);

    let myClosure = function(){
        let nums = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        return function(){
            let index = Math.floor(Math.random() * nums.length);
            let num = nums[index];
            nums = nums.filter(targetNum => num !== targetNum);
            return num;
        }
    }

    let rndNum = myClosure();
    
    // 初期化
    myRects = [
    new MyRect(0            , 0         , rndNum())
    , new MyRect(myConstants.rectWidth    , 0         , rndNum())
    , new MyRect(myConstants.rectWidth * 2, 0         , rndNum())
    , new MyRect(myConstants.rectWidth * 3, 0         , rndNum())
    , new MyRect( 0           , myConstants.rectHeight, rndNum())
    , new MyRect(myConstants.rectWidth    , myConstants.rectHeight, rndNum())
    , new MyRect(myConstants.rectWidth * 2, myConstants.rectHeight, rndNum())
    , new MyRect(myConstants.rectWidth * 3, myConstants.rectHeight, rndNum())
    , new MyRect( 0           , myConstants.rectHeight * 2, rndNum())
    , new MyRect(myConstants.rectWidth    , myConstants.rectHeight * 2, rndNum())
    , new MyRect(myConstants.rectWidth * 2, myConstants.rectHeight * 2, rndNum())
    , new MyRect(myConstants.rectWidth * 3, myConstants.rectHeight * 2, rndNum())
    , new MyRect( 0           , myConstants.rectHeight * 3, rndNum())
    , new MyRect(myConstants.rectWidth    , myConstants.rectHeight * 3, rndNum())
    , new MyRect(myConstants.rectWidth * 2, myConstants.rectHeight * 3, rndNum())
    , new MyRect(myConstants.rectWidth * 3, myConstants.rectHeight * 3, rndNum())
    ];
}

// canvasをクリックしたときに呼び出す関数
let clickFunc = function(e){

    console.log('click:' + e.clientX + '/' + e.clientY);

    // クリックした場所
    let clickedX = e.clientX;
    let clickedY = e.clientY;

    // クリックしたセルを特定する
    let clickedRect = myRects.find(myRect => {
        if(clickedX >= myRect.x){
            if(clickedX <= myRect.x + myRect.width){
                if(clickedY >= myRect.y){
                    if(clickedY <= myRect.y + myRect.width){
                        return true;       
                    }
                }
            }
        }
        return false;
    });

    // 関係ないところをクリックしてたら何もしない
    if(!clickedRect || clickedRect.num === 0){
        return;
    }

    // 空のセルを特定する
    let emptyRect = myRects.find(myRect => myRect.num === 0);

    // 移動できないところをクリックしたら何もしない
    if(emptyRect.x !== clickedRect.x && emptyRect.y !== clickedRect.y){
        return;
    }

    // クリックしたセルの座標を記録しておく
    let prevClickedRectX = clickedRect.x;
    let prevClickedRectY = clickedRect.y;

    if(emptyRect.x === clickedRect.x){
        if(emptyRect.y < clickedRect.y){
            // 上に移動したいとき
            let minX = emptyRect.x;
            let maxX = emptyRect.x;
            let minY = emptyRect.y;
            let maxY = clickedRect.y;
            // 移動する対象を絞る
            let filtered = myRects.filter(myRect => {
                if(myRect.num === 0){
                    return false;
                }
                if(myRect.x >= minX && myRect.x <= maxX){
                    if(myRect.y >= minY && myRect.y <= maxY){
                        return true;
                    }
                }
                return false;
            });
            // 並び替え
            filtered.sort((rect1, rect2) => {
                if(rect1.y > rect2.y){
                    return 1;
                }                
                return -1;
            });
            // 移動
            filtered.forEach(rect => {
                rect.move(myConstants.direction.up, 1);
            });
        }else{
            // 下に移動したとき
            let minX = emptyRect.x;
            let maxX = emptyRect.x;
            let minY = clickedRect.y;
            let maxY = emptyRect.y;
            // 移動する対象を絞る
            let filtered = myRects.filter(myRect => {
                if(myRect.num === 0){
                    return false;
                }
                if(myRect.x >= minX && myRect.x <= maxX){
                    if(myRect.y >= minY && myRect.y <= maxY){
                        return true;
                    }
                }
                return false;
            });
            // 並び替え
            filtered.sort((rect1, rect2) => {
                if(rect1.y > rect2.y){
                    return -1;
                }                
                return 1;
            });
            // 移動
            filtered.forEach(rect => {
                rect.move(myConstants.direction.down, 1);
            });
        }
    }else if(emptyRect.y === clickedRect.y){
        if(emptyRect.x < clickedRect.x){
            // 左に移動したいとき
            let minX = emptyRect.x;
            let maxX = clickedRect.x;
            let minY = emptyRect.y;
            let maxY = emptyRect.y;
            // 移動する対象を絞る
            let filtered = myRects.filter(myRect => {
                if(myRect.num === 0){
                    return false;
                }
                if(myRect.x >= minX && myRect.x <= maxX){
                    if(myRect.y >= minY && myRect.y <= maxY){
                        return true;
                    }
                }
                return false;
            });
            // 並び替え
            filtered.sort((rect1, rect2) => {
                if(rect1.x > rect2.x){
                    return 1;
                }                
                return -1;
            });
            // 移動
            filtered.forEach(rect => {
                rect.move(myConstants.direction.left, 1);
            });
        }else{
            // 右に移動したとき
            let minX = clickedRect.x;
            let maxX = emptyRect.x;
            let minY = emptyRect.y;
            let maxY = emptyRect.y;
            // 移動する対象を絞る
            let filtered = myRects.filter(myRect => {
                if(myRect.num === 0){
                    return false;
                }
                if(myRect.x >= minX && myRect.x <= maxX){
                    if(myRect.y >= minY && myRect.y <= maxY){
                        return true;
                    }
                }
                return false;
            });
            // 並び替え
            filtered.sort((rect1, rect2) => {
                if(rect1.x > rect2.x){
                    return -1;
                }                
                return 1;
            });
            // 移動
            filtered.forEach(rect => {
                rect.move(myConstants.direction.right, 1);
            });
        }
    }

    emptyRect.x = prevClickedRectX;
    emptyRect.y = prevClickedRectY;

}

//------------------------------
// イベント登録
//------------------------------

// ダブルタップによる拡大縮小を禁止
document.addEventListener('touchend', function (e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches[0] || e.changedTouches[0];
    var obj = {
        clientX : touch.clientX - rect.left,
        clientY : touch.clientY - rect.top
    };
    // クリック時の関数呼び出し
    clickFunc(obj);
}, false);

// キャンバスをクリックしたとき
canvas.addEventListener('click', clickFunc);

// リセットボタン
document.getElementById('reset').addEventListener('click', initGame);

// 色変え
let changeSelectedColorPattern = function(pattern){
    selectedColorPattern = myConstants.colors[pattern];
    myRects.forEach(rect => rect.chnageColor());
    myRects.forEach(rect => rect.render());
}

document.getElementById('color1').addEventListener('click' ,changeSelectedColorPattern.bind(null, 'pattern1'));
document.getElementById('color2').addEventListener('click' ,changeSelectedColorPattern.bind(null, 'pattern2'));
document.getElementById('color3').addEventListener('click' ,changeSelectedColorPattern.bind(null, 'pattern3'));

//------------------------------
// ゲーム初期化
//------------------------------
initGame();