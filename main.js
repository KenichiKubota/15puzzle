'use strict';

// canvas要素の作成
const canvas = document.getElementById('canvas');
canvas.width=280;
canvas.height=280;

const rectWidth = 60;
const rectHeight = 60;
const moveSpeed = 10;

// コンテキストの取得
var ctx = canvas.getContext('2d');

class MyRect {

    constructor(x, y, num){
        this.width = rectWidth;
        this.height = rectHeight;
        this.x = x;
        this.y = y;
        this.nextX = x;
        this.nextY = y;
        // this.color = color;
        this.num = num;
        if(this.num === 0){
            this.color = '#ffffff';
        }else if(this.num <= 4){
            this.color = '#cff09e';
        }else if(this.num <= 8){
            this.color = '#a8dba8';
        }else if(this.num <= 12){
            this.color = '#79bd9a';
        }else if(this.num <= 16){
            this.color = '#3b8686';
        }

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

    toUp(moveCount){
        if(this.animateFlg){
            return;
        }
        let moveX = 0;
        let moveY = -1 * moveSpeed;
        let afterX = this.x;
        let afterY = this.y - moveCount * this.width;
        this.animateFlg = true;
        this.moveCore(moveX, moveY, afterX, afterY);
    }
    toBottom(moveCount){
        if(this.animateFlg){
            return;
        }
        let moveX = 0;
        let moveY = moveSpeed;
        let afterX = this.x;
        let afterY = this.y + moveCount * this.width;
        this.animateFlg = true;
        this.moveCore(moveX, moveY, afterX, afterY);
    }
    toLeft(moveCount){
        if(this.animateFlg){
            return;
        }
        let moveX = -1 * moveSpeed;
        let moveY = 0;
        let afterX = this.x - moveCount * this.width;
        let afterY = this.y;
        this.animateFlg = true;
        this.moveCore(moveX, moveY, afterX, afterY);
    }
    toRight(moveCount){
        if(this.animateFlg){
            return;
        }
        let moveX = moveSpeed;
        let moveY = 0;
        let afterX = this.x + moveCount * this.width;
        let afterY = this.y;
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
let myRects = [
    new MyRect(0            , 0         , rndNum())
  , new MyRect(rectWidth    , 0         , rndNum())
  , new MyRect(rectWidth * 2, 0         , rndNum())
  , new MyRect(rectWidth * 3, 0         , rndNum())
  , new MyRect( 0           , rectHeight, rndNum())
  , new MyRect(rectWidth    , rectHeight, rndNum())
  , new MyRect(rectWidth * 2, rectHeight, rndNum())
  , new MyRect(rectWidth * 3, rectHeight, rndNum())
  , new MyRect( 0           , rectHeight * 2, rndNum())
  , new MyRect(rectWidth    , rectHeight * 2, rndNum())
  , new MyRect(rectWidth * 2, rectHeight * 2, rndNum())
  , new MyRect(rectWidth * 3, rectHeight * 2, rndNum())
  , new MyRect( 0           , rectHeight * 3, rndNum())
  , new MyRect(rectWidth    , rectHeight * 3, rndNum())
  , new MyRect(rectWidth * 2, rectHeight * 3, rndNum())
  , new MyRect(rectWidth * 3, rectHeight * 3, rndNum())
];

// canvasをクリックしたときに呼び出す関数
let clickFunc = function(e){

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
                rect.toUp(1);
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
                rect.toBottom(1);
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
                rect.toLeft(1);
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
                rect.toRight(1);
            });
        }
    }

    emptyRect.x = prevClickedRectX;
    emptyRect.y = prevClickedRectY;

}

// イベント登録
canvas.addEventListener('click', clickFunc);