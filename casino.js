class Casino {
    constructor() {
        this.coin = 0;
        this.isPlay = false;
        this.bet = 0;
        this.lastBet = 0;
        this.record = [];
        this.record2 = [];
        this.maxium = 0;
        this.unit = 100;
        this.firstCoin = 1000000;

        this.gameTime = 1500;
        this.resultTime = 1000;

        this.gameCount = 0;

        this.init();
        this.render();
    }

    init() {
        this.coin = this.firstCoin;
        this.maxium = this.coin;

        if (window.localStorage.getItem('coin')) {
            this.coin = parseInt(window.localStorage.getItem('coin'));
        }

        if (window.localStorage.getItem('maxium')) {
            this.maxium = parseInt(window.localStorage.getItem('maxium'));
        }

        if (window.localStorage.getItem('record')) {
            this.record = JSON.parse(window.localStorage.getItem('record'));
        }

        if (window.localStorage.getItem('record2')) {
            this.record2 = JSON.parse(window.localStorage.getItem('record2'));
        }

        this.render();

        oddBtn.addEventListener('click', () => {
            this.play(1);
        });
        evenBtn.addEventListener('click', () => {
            this.play(2);
        });

        document.querySelectorAll('[data-bet]').forEach((button) => {
            button.addEventListener('click', () => {
                if (this.isPlay) {
                    console.log('게임 중입니다.');
                    return;
                }
                this.bet += parseInt(button.dataset.bet);
                if (this.bet > this.coin) {
                    this.bet = this.coin;
                }
                this.render();
            });
        });
    }

    play(value) {
        return new Promise((resolve, reject) => {
            if (this.bet === 0) {
                console.log('배팅 금액을 선택하세요.');
                return;
            }

            if (this.isPlay) {
                console.log('게임 중입니다.');
                return;
            }
            if (this.coin < this.bet) {
                console.log('코인이 부족합니다.');
                return;
            }

            this.coin -= this.bet;
            this.gameCount++;
            this.isPlay = true;
            this.lastBet = this.bet;
            this.render();

            // betMsg.innerHTML = '게임 중...';

            for (let i = 0; i < this.gameTime/10; i++) {
                setTimeout(() => {
                    let ranNum = Math.floor(Math.random() * 37);
                    betMsg.innerHTML = `<span style="font-size: 60px; color: ${ranNum % 2 == 0 ? '#4e81b4' : '#fc8242'};">${ranNum}</span>`;
                }, i * 10);
            }

            setTimeout(() => {
                let number = Math.floor(Math.random() * 37);
                let result = number % 2 == 0 ? 2 : 1;

                if (number !== 0) {
                    this.record.push(number);
                } else {
                    this.record.push('0');
                    result = 3;
                }

                if (this.record.length > 9) {
                    this.record.shift();
                }

                const date = new Date();

                const year = date.getFullYear();
                const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
                const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
                const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
                const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
                const seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();

                this.record2.push({
                    date: `${year}. ${month}. ${day} ${hours}:${minutes}:${seconds}`,
                    price: value === result ? this.bet : this.bet * -1,
                    result: value === result ? '승' : '패',
                });
                if (this.record2.length > 200) {
                    this.record2.shift();
                }

                if (value == result) {
                    this.coin += this.bet * 2;
                }

                const resultMsg = `<span style="font-size: 60px; color: ${
                    number == 0 ? '#fff' : number % 2 == 0 ? '#4e81b4' : '#fc8242'
                };">${number}</span>`;
                // this.modal(number, resultMsg, this.bet * 2);

                betMsg.innerHTML = resultMsg;

                const p = document.createElement('p');
                p.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    position: absolute;
                    top: 65%;
                `;

                const resultText =
                    value === result ? '<span style="font-size:14px;">축하합니다.</span>' : '<span style="font-size:14px;">패배하셨습니다.</span>';
                const resultPrice = value === result ? `+${this.bet.toLocaleString()}` : (this.bet * -1).toLocaleString();

                p.innerHTML = resultText + `₩${resultPrice}`;

                betMsg.appendChild(p);

                this.bet = 0;

                if (this.coin > this.maxium) {
                    this.maxium = this.coin;
                }

                this.isPlay = false;
                resolve(value === result ? true : false);
                
                setTimeout(() => {
                    this.render();
                }, this.resultTime);
            }, this.gameTime);
        });
    }

    render() {
        coin.innerHTML = `소지금: ₩${this.coin.toLocaleString()}`;
        // maxium.innerHTML = `최대 소지금: ₩${this.maxium.toLocaleString()}`;
        // gameCount.innerHTML = `게임 횟수: ${this.gameCount}`;

        if (this.bet === 0) {
            if (this.coin === 0) {
                betMsg.innerHTML =
                    '소지금이 부족합니다.<br><span>최대 소지금: <strong style="font-size:16px;">₩' +
                    this.maxium.toLocaleString() +
                    '</strong></span>';

                const restartBtn = document.createElement('button');
                restartBtn.innerHTML = '다시하기';

                if (!window.localStorage.getItem('acc')) window.localStorage.setItem('acc', 0);
                window.localStorage.setItem('acc', +window.localStorage.getItem('acc') + +this.firstCoin);

                restartBtn.addEventListener('click', () => {
                    this.coin = this.firstCoin;
                    this.maxium = this.coin;
                    this.lastBet = 0;
                    this.gameCount = 0;
                    this.record = [];
                    this.record2 = [];
                    this.render();

                    window.open('https://link.coupang.com/a/bzdp8o', '_blank');
                });

                betMsg.appendChild(restartBtn);
            } else {
                const betMsgText = '배팅하세요.';
                const span = document.createElement('span');
                span.innerHTML = betMsgText;
                span.style.display = 'block';

                const div = document.createElement('div');
                div.appendChild(span);

                if (this.lastBet > 0) {
                    const button = document.createElement('button');
                    button.innerHTML = '재배팅';
                    button.addEventListener('click', () => {
                        this.bet = this.lastBet;
                        if (this.bet > this.coin) {
                            this.bet = this.coin;
                        }
                        this.render();
                    });

                    div.appendChild(button);
                }

                betMsg.innerHTML = '';
                betMsg.appendChild(div);
            }
        } else {
            betMsg.innerHTML = `₩${this.bet.toLocaleString()} 배팅합니다.`;

            const buttonWrap = document.createElement('div');
            buttonWrap.classList.add('button-wrap');

            const multipleBtn = document.createElement('button');
            multipleBtn.innerHTML = 'x2';
            multipleBtn.addEventListener('click', () => {
                this.bet *= 2;
                if (this.bet > this.coin) {
                    this.bet = this.coin;
                }
                this.render();
            });

            const cancelBtn = document.createElement('button');
            cancelBtn.innerHTML = '취소';
            cancelBtn.style.backgroundColor = '#999';
            cancelBtn.addEventListener('click', () => {
                this.bet = 0;
                this.render();
            });

            buttonWrap.append(multipleBtn, cancelBtn);
            betMsg.appendChild(buttonWrap);
        }

        record.innerHTML = [...this.record]
            .reverse()
            .map((item, index) => {
                switch (item) {
                    case '0':
                        return `<span style="color:#fff;">${item}</span>`;
                        break;
                    default:
                        if (item % 2 == 0) {
                            return `<span style="color:#4e81b4;">${item}</span>`;
                        } else {
                            return `<span style="color:#fc8242;">${item}</span>`;
                        }
                }
            })
            .join('');

        record2.innerHTML = [...this.record2]
            .reverse()
            .map((item, index) => {
                return `
                <li>
                    <span>${item.date}</span>
                    <span>₩${item.price.toLocaleString()}</span>
                    <span style="color:${item.result === '승' ? '#42fc76' : '#fc4242;'}">${item.result}</span>
                </li>
            `;
            })
            .join('');

        window.localStorage.setItem('coin', this.coin);
        window.localStorage.setItem('maxium', this.maxium);
        window.localStorage.setItem('record', JSON.stringify(this.record));
        window.localStorage.setItem('record2', JSON.stringify(this.record2));
    }

    async autoPlay(seed = this.unit) {
        this.gameTime = 0;
        this.resultTime = 0;

        this.bet = seed;
        const result = await this.play(1);

        if (result) {
            this.autoPlay(this.unit);
        } else {
            if(this.autoWinCount === 0){
                this.autoPlay(seed * 2 + this.unit);
            }else{
                this.autoWinCount = 0;
                this.autoPlay(this.unit);
            }
            
        }
    }
}
