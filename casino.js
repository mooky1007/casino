class Casino {
    constructor() {
        this.coin = 0;
        this.isPlay = false;
        this._bet = 0;
        this.lastBet = 0;
        this.record = [];
        this.record2 = [];
        this.maxium = 0;
        this.unit = 100;
        this.firstCoin = 100;

        this.real = this.firstCoin;

        this.maxiumBet = 5000;

        this.gameTime = 500;
        this.resultTime = 1500;

        this.gameCount = 0;

        this.autoCount = 0;
        this.autoWinCount = 0;
        this.autoLoseCount = 0;

        this.init();
        this.render();
    }

    get bet() {
        return this._bet;
    }

    set bet(value) {
        if (value > this.maxiumBet) {
            value = this.maxiumBet;
        }
        this._bet = value;
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

        if (window.localStorage.getItem('gameCount')) {
            this.gameCount = parseInt(window.localStorage.getItem('gameCount'));
        }

        if (window.localStorage.getItem('real')) {
            this.real = parseInt(window.localStorage.getItem('real'));
        }

        this.render();

        oddBtn.addEventListener('click', () => {
            this.play(1);
        });
        evenBtn.addEventListener('click', () => {
            this.play(2);
        });

        dozenBtn1.addEventListener('click', () => {
            this.playDozen([1,12]);
        })

        dozenBtn2.addEventListener('click', () => {
            this.playDozen([13,24]);
        });

        dozenBtn3.addEventListener('click', () => {
            this.playDozen([25,36]);
        });

        straightBtn1.addEventListener('click', () => {
            this.playStraight(0);
        });

        // withdraw.addEventListener('click', () => {
        //     this.real += this.coin;
        //     this.coin = 0;
        //     this.render();
        // });

        // deposit.addEventListener('click', () => {
        //     this.coin += this.real;
        //     this.real = 0;
        //     this.render();
        // });

        // autoPlay.addEventListener('click', () => {
        //     this.autoPlay();
        // });

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
            if (this.bet === 0) return;
            if (this.isPlay) return;
            if (this.coin < this.bet) return;

            this.coin -= this.bet;
            this.gameCount++;
            this.isPlay = true;
            this.lastBet = this.bet;
            this.render();

            // betMsg.innerHTML = '게임 중...';

            for (let i = 0; i < this.gameTime / 10; i++) {
                setTimeout(() => {
                    let ranNum = Math.floor(Math.random() * 37);
                    betMsg.innerHTML = `<span style="font-size: 92px; font-family: 'Giants-Inline'; color: ${
                        ranNum === 0 ? '#aaa' : ranNum % 2 == 0 ? '#fc4242' : '#fff'
                    };">${ranNum}</span>`;
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
                    price: value === result ? (this.bet * 1).toLocaleString() : (this.bet * -1).toLocaleString(),
                    result: value === result ? 'Win' : 'Lose',
                });
                if (this.record2.length > 200) {
                    this.record2.shift();
                }

                if (value == result) {
                    this.coin += this.bet * 2;
                }

                const resultMsg = `<span style="font-size: 92px; font-family: 'Giants-Inline'; color: ${
                    number == 0 ? '#aaa' : number % 2 == 0 ? '#fc4242' : '#fff'
                };">${number}</span>`;
                // this.modal(number, resultMsg, this.bet * 2);

                betMsg.innerHTML = resultMsg;

                const p = document.createElement('p');
                p.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    position: absolute;
                    top: 70%;
                `;

                const resultText =
                    value === result ? '<span style="font-size:14px;">Congratulations.</span>' : '<span style="font-size:14px;">You lose.</span>';
                const resultPrice = value === result ? `+${(this.bet * 1).toLocaleString()}` : (this.bet * -1).toLocaleString();

                p.innerHTML = resultText + `<span style="${value === result ? 'color: #439dff;' : 'color: #a40606;'}">${resultPrice}$</span>`;

                betMsg.appendChild(p);

                this.bet = 0;

                if (this.coin > this.maxium) {
                    this.maxium = this.coin;
                }

                this.isPlay = false;
                resolve(value === result ? true : false);

                this.resultTimer = setTimeout(() => {
                    this.render();
                }, this.resultTime);
            }, this.gameTime);
        });
    }

    playDozen(value) {
        return new Promise((resolve, reject) => {
            if (this.bet === 0) return;
            if (this.isPlay) return;
            if (this.coin < this.bet) return;

            this.coin -= this.bet;
            this.gameCount++;
            this.isPlay = true;
            this.lastBet = this.bet;
            this.render();

            for (let i = 0; i < this.gameTime / 10; i++) {
                setTimeout(() => {
                    let ranNum = Math.floor(Math.random() * 37);
                    betMsg.innerHTML = `<span style="font-size: 92px; font-family: 'Giants-Inline'; color: ${
                        ranNum === 0 ? '#aaa' : ranNum % 2 == 0 ? '#fc4242' : '#fff'
                    };">${ranNum}</span>`;
                }, i * 10);
            }

            setTimeout(() => {
                let number = Math.floor(Math.random() * 37);

                const gameResult = value[0] <= number && number <= value[1];

                if (number !== 0) {
                    this.record.push(number);
                } else {
                    this.record.push('0');
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
                    price: gameResult ? this.bet * 2 : this.bet * -1,
                    result: gameResult ? 'Win' : 'Lose',
                });
                if (this.record2.length > 200) {
                    this.record2.shift();
                }

                if (gameResult) {
                    this.coin += this.bet * 3;
                }

                const resultMsg = `<span style="font-size: 92px; font-family: 'Giants-Inline'; color: ${
                    number == 0 ? '#aaa' : number % 2 == 0 ? '#fc4242' : '#fff'
                };">${number}</span>`;
                // this.modal(number, resultMsg, this.bet * 2);

                betMsg.innerHTML = resultMsg;

                const p = document.createElement('p');
                p.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    position: absolute;
                    top: 70%;
                `;

                const resultText =
                    gameResult ? '<span style="font-size:14px;">Congratulations.</span>' : '<span style="font-size:14px;">You lose.</span>';
                const resultPrice = gameResult ? `+${(this.bet * 2).toLocaleString()}` : (this.bet * -1).toLocaleString();

                p.innerHTML = resultText + `<span style="${gameResult ? 'color: #439dff;' : 'color: #a40606;'}">${resultPrice}$</span>`;

                betMsg.appendChild(p);

                this.bet = 0;

                if (this.coin > this.maxium) {
                    this.maxium = this.coin;
                }

                this.isPlay = false;
                resolve(gameResult ? true : false);

                this.resultTimer = setTimeout(() => {
                    this.render();
                }, this.resultTime);
            }, this.gameTime);
        });
    }

    playStraight(value) {
        return new Promise((resolve, reject) => {
            if (this.bet === 0) return;
            if (this.isPlay) return;
            if (this.coin < this.bet) return;

            this.coin -= this.bet;
            this.gameCount++;
            this.isPlay = true;
            this.lastBet = this.bet;
            this.render();

            for (let i = 0; i < this.gameTime / 10; i++) {
                setTimeout(() => {
                    let ranNum = Math.floor(Math.random() * 37);
                    betMsg.innerHTML = `<span style="font-size: 92px; font-family: 'Giants-Inline'; color: ${
                        ranNum === 0 ? '#aaa' : ranNum % 2 == 0 ? '#fc4242' : '#fff'
                    };">${ranNum}</span>`;
                }, i * 10);
            }

            setTimeout(() => {
                let number = Math.floor(Math.random() * 37);
                let result = number === value;

                if (number !== 0) {
                    this.record.push(number);
                } else {
                    this.record.push('0');
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
                    price: result ? (this.bet * 35).toLocaleString() : (this.bet * -1).toLocaleString(),
                    result: result ? 'Win' : 'Lose',
                });
                if (this.record2.length > 200) {
                    this.record2.shift();
                }

                if (result) {
                    this.coin += this.bet * 36;
                }

                const resultMsg = `<span style="font-size: 92px; font-family: 'Giants-Inline'; color: ${
                    number == 0 ? '#aaa' : number % 2 == 0 ? '#fc4242' : '#fff'
                };">${number}</span>`;
                // this.modal(number, resultMsg, this.bet * 2);

                betMsg.innerHTML = resultMsg;

                const p = document.createElement('p');
                p.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    position: absolute;
                    top: 70%;
                `;

                const resultText =
                    result ? '<span style="font-size:14px;">Congratulations.</span>' : '<span style="font-size:14px;">You lose.</span>';
                const resultPrice = result ? `+${(this.bet * 35).toLocaleString()}` : (this.bet * -1).toLocaleString();

                p.innerHTML = resultText + `<span style="${result ? 'color: #439dff;' : 'color: #a40606;'}">${resultPrice}$</span>`;

                betMsg.appendChild(p);

                this.bet = 0;

                if (this.coin > this.maxium) {
                    this.maxium = this.coin;
                }

                this.isPlay = false;
                resolve(result ? true : false);

                this.resultTimer = setTimeout(() => {
                    this.render();
                }, this.resultTime);
            }, this.gameTime);
        });
    }

    restart() {
        this.coin = this.firstCoin;
        this.maxium = this.coin;
        this.lastBet = 0;
        this.gameCount = 0;
        this.record = [];
        this.record2 = [];
        this.real -= this.firstCoin;
        this.render();

        // window.open('https://link.coupang.com/a/bzdp8o', '_blank');
    }

    reset() {
        window.localStorage.clear();
        this.coin = this.firstCoin;
        this.maxium = 0;
        this.lastBet = 0;
        this.gameCount = 0;
        this.record = [];
        this.record2 = [];
        this.real = 0;
        this.render();
    }

    render() {
        if (this.resultTimer) clearTimeout(this.resultTimer);
        coin.innerHTML = `money: ${this.coin.toLocaleString()}$`;
        // maxium.innerHTML = `최대 소지금: ₩${this.maxium.toLocaleString()}`;
        gameCount.innerHTML = `game count: ${this.gameCount.toLocaleString()}`;
        // real.innerHTML = `보유 자금: ${(this.real + this.coin).toLocaleString()}`;

        window.localStorage.setItem('gameCount', this.gameCount);
        window.localStorage.setItem('real', this.real);

        if (this.bet === 0) {
            if (this.coin === 0) {
                betMsg.innerHTML =
                    // '소지금이 부족합니다.<br><span>최대 소지금: <strong style="font-size:16px;">' + this.maxium.toLocaleString() + '</strong></span>';
                    'You have no money.<br><span>maximum: <strong style="font-size:16px;">' + this.maxium.toLocaleString() + '$</strong></span>';

                const restartBtn = document.createElement('button');
                restartBtn.innerHTML = 'Restart';

                if (!window.localStorage.getItem('acc')) window.localStorage.setItem('acc', 0);
                window.localStorage.setItem('acc', +window.localStorage.getItem('acc') + +this.firstCoin);

                restartBtn.addEventListener('click', () => {
                    this.restart();
                });

                betMsg.appendChild(restartBtn);
            } else {
                const betMsgText = 'Betting amount is selected.';
                const span = document.createElement('span');
                span.innerHTML = betMsgText;
                span.style.display = 'block';

                const div = document.createElement('div');
                div.appendChild(span);

                if (this.lastBet > 0) {
                    const button = document.createElement('button');
                    button.innerHTML = 'Last Bet';
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
            betMsg.innerHTML = `${this.bet.toLocaleString()}$ on the table.`;

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
            cancelBtn.innerHTML = 'Cancel';
            cancelBtn.style.backgroundColor = '#444';
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
                        return `<span style="color:#aaa;">${item}</span>`;
                        break;
                    default:
                        if (item % 2 == 0) {
                            return `<span style="color:#fc4242;">${item}</span>`;
                        } else {
                            return `<span style="color:#fff;">${item}</span>`;
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
                    <span>${item.price.toLocaleString()}$</span>
                    <span style="color:${item.result === 'Win' ? '#439dff' : '#a40606;'}">${item.result}</span>
                </li>
            `;
            })
            .join('');

        window.localStorage.setItem('coin', this.coin);
        window.localStorage.setItem('maxium', this.maxium);
        window.localStorage.setItem('record', JSON.stringify(this.record));
        window.localStorage.setItem('record2', JSON.stringify(this.record2));
    }

    async autoPlayDaniel(seed = this.unit, count = 10) {
        this.autoCount++;
        this.gameTime = 0;
        this.resultTime = 0;

        if (this.autoCount > count) {
            this.autoCount = 0;
            return;
        }

        this.bet = seed;
        const result = await this.play(1);

        if (result) {
            this.autoPlayDaniel(this.unit, count);
        } else {
            this.autoPlayDaniel(seed * 2 + this.unit, count);
        }
    }

    async autoPlayMartinGale(seed = this.unit, count = 10) {
        this.autoCount++;
        this.gameTime = 0;
        this.resultTime = 0;

        if (this.autoCount > count) {
            this.autoCount = 0;
            return;
        }

        this.bet = seed;
        const result = await this.play(1);

        if (result) {
            this.autoPlayMartinGale(this.unit, count);
        } else {
            this.autoPlayMartinGale(seed * 2, count);
        }
    }

    async autoPlayParoli(seed = this.unit, count = 10) {
        this.autoCount++;
        this.gameTime = 0;
        this.resultTime = 0;

        if (this.autoCount > count) {
            this.autoCount = 0;
            return;
        }

        this.bet = seed;
        const result = await this.play(1);

        if (result) {
            this.autoWinCount++;
            if (this.autoWinCount < 3) {
                this.autoPlayParoli(seed * 2, count);
            } else {
                this.autoWinCount = 0;
                this.autoPlayParoli(this.unit, count);
            }
        } else {
            this.autoWinCount = 0;
            this.autoPlayParoli(this.unit, count);
        }
    }

    async autoPlayTenPercent(count = 10) {
        this.autoCount++;
        this.gameTime = 0;
        this.resultTime = 0;

        if (this.autoCount > count) {
            this.autoCount = 0;
            return;
        }

        this.bet = Math.floor(this.coin * 0.1);
        const result = await this.play(1);

        if (result) {
            this.autoWinCount++;

            if (this.autoWinCount >= 5) {
                this.autoWinCount = 0;
                return;
            }
        } else {
            this.autoWinCount = 0;
        }

        this.autoPlayTenPercent(count);
    }

    async autoPlayFlat(unit, count = 10) {
        this.autoCount++;
        this.gameTime = 0;
        this.resultTime = 0;

        if (this.autoCount > count) {
            this.autoCount = 0;
            return;
        }

        this.bet = unit;
        const result = await this.play(1);

        if (result) {
            this.autoWinCount++;
        } else {
            this.autoLoseCount++;
        }

        this.autoPlayFlat(unit, count);
    }
}