let randomNumberBetween = (minRandomNumber, maxRandomNumber) => {
    return Math.floor(Math.random() * (maxRandomNumber - minRandomNumber + 1) + minRandomNumber);
}



class RandomDispatcher {


constructor(callback, options = { min: 1000, max: 5000}) {

if (typeof callback !== 'function') throw Error('Callback must be a function.');

this.callback = callback;
this.options = options;

this.loop();

}

loop () {

    let wait = randomNumberBetween (this.options.min, this.options.max);

if(this.timeout) window.clearTimeout (this.timeout);


    this.timeout = window.setTimeout(()=> {
    this.callback();
    this.loop();

    }, this.options.min)

}

}

export default RandomDispatcher;

export {
    randomNumberBetween
}