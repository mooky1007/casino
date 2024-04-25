class Casino {
    constructor() {
        this.coin = 0;
        this.isPlay = false;
        this.bet = 0;
        this.lastBet = 0;
        this.record = [];
        this.maxium = 0;

        this.init();
        this.render();
    }

    init() {
        this.coin = 100000;
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
        this.isPlay = true;
        this.lastBet = this.bet;
        this.render();

        betMsg.innerHTML = '게임 중...';

        setTimeout(() => {
            let number = Math.floor(Math.random() * 100) + 1;
            let result = number % 2 == 0 ? 2 : 1;

            this.record.push(result === 1 ? '홀' : '짝');
            if (this.record.length > 45) {
                this.record.shift();
            }

            if (value == result) {
                this.coin += this.bet * 2;
            }

            const resultMsg = value === result ? '축하합니다.<br>+₩' + (this.bet * 2).toLocaleString() : '패배했습니다.';
            this.modal(number, resultMsg, this.bet * 2);

            this.bet = 0;
            
            if (this.coin > this.maxium) {
                this.maxium = this.coin;
            }

            this.isPlay = false;
            this.render();
        }, 1000);
    }

    render() {
        coin.innerHTML = `소지금: ₩${this.coin.toLocaleString()}`;

        if (this.bet === 0) {
            if (this.coin === 0) {
                betMsg.innerHTML = '소지금이 부족합니다.<br>최대 소지금: ₩' + this.maxium.toLocaleString() + '<br>다시 시작하려면 버튼을 클릭하세요.';

                const restartBtn = document.createElement('button');
                restartBtn.innerHTML = '다시 시작';

                restartBtn.addEventListener('click', () => {
                    this.coin = 100000;
                    this.lastBet = 0;
                    this.record = [];
                    this.render();
                });

                betMsg.appendChild(restartBtn);
            } else {
                const betMsgText = '배팅 금액을 선택하세요.';
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
            const multipleBtn = document.createElement('button');
            multipleBtn.innerHTML = 'x2';
            multipleBtn.addEventListener('click', () => {
                this.bet *= 2;
                if (this.bet > this.coin) {
                    this.bet = this.coin;
                }
                this.render();
            });

            betMsg.appendChild(multipleBtn);
        }

        record.innerHTML = [...this.record]
            .reverse()
            .map((item, index) => {
                return `<span style="${item === '홀' ? 'color:#4e81b4;' : 'color:#fc8242;'}">${item}</span>`;
            })
            .join('');
    }

    modal(value, result) {
        const div = document.createElement('div');
        div.classList.add('modal');

        const h1 = document.createElement('h1');
        h1.innerHTML = value;

        const p = document.createElement('p');
        p.innerHTML = result;

        div.append(h1, p);

        // betMsg.appendChild(div);
        document.body.appendChild(div);

        setTimeout(() => {
            div.style.opacity = 0;
            div.style.top = '34%';
            setTimeout(() => {
                document.body.removeChild(div);
            }, 500);
        }, 1000);
    }
}
