'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(acc, sort = false){
containerMovements.innerHTML = ""
const movs = sort? acc.movements.slice().sort((a,b) => a-b): acc.movements;
movs.forEach(function(value, index, arr){
const type = value > 0? "deposit" : "withdrawal"

const date = new Date(acc.movementsDates[index]);
const day = date.getDate();
const month = date.getMonth();
const year = date.getFullYear();
const displayDate = `${day}/${month}/${year}`;

  const html= `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${index+1} ${type}
  </div>
  <div class="movements__date">${displayDate}</div>
  <div class="movements__value">${value.toFixed(2)}€</div>
</div>`;

containerMovements.insertAdjacentHTML("afterbegin", html)

})
};

const createUsernames = function(accs){

  accs.forEach(function(acc){
    acc.username = acc.owner
    .toLowerCase().split(" ").map(name => name[0]).join("");
  })
};

createUsernames(accounts)

const calcDisplayBalance = function(movements){
  const balance = movements.reduce(function(acc, mov){
   return acc+ mov
  },0)
  labelBalance.textContent = `${balance.toFixed(2)}€`
  return balance

}


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, 650, -130, 70, 1300];
const withdrawals = movements.filter(mov => mov < 0);


const calcDisplaySummary = function(acc){
const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov)=> acc + mov, 0);

const out = acc.movements.filter(mov => mov<0).reduce((acc, mov) => acc + mov, 0);

const interest = acc.movements.filter(mov => mov > 0).map((mov)=> mov * (acc.interestRate/100)).filter(mov => mov >=1).reduce((acc, mov) => acc + mov, 0);

labelSumIn.textContent = `${incomes.toFixed(2)}€`;
labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;
labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const updateUI = function(acc){
//Display Movements
displayMovements(acc);
//Display balance
calcDisplayBalance(acc.movements);
//Display Summary
calcDisplaySummary(acc);
}


let currentAccount;
btnLogin.addEventListener("click", function(e){
  e.preventDefault();
 currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

 if (currentAccount?.pin === Number(inputLoginPin.value)){
  //Display UI and message
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`
  containerApp.style.opacity = 100;
  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();
  //update UI
  updateUI(currentAccount);
 };
 const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth()+ 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const minutes = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;
});

btnTransfer.addEventListener("click", function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
 const currentBalance = calcDisplayBalance(currentAccount.movements);

 if(amount >0 && currentBalance >= amount && currentAccount.username !== receiverAcc?.username && receiverAcc){
  currentAccount.movements.push(-amount);
  receiverAcc.movements.push(amount);
  currentAccount.movementsDates.push(new Date().toISOString());
  receiverAcc.movementsDates.push(new Date().toISOString());
  updateUI(currentAccount);
 }

  inputTransferAmount.value = inputTransferTo.value = "";

});

btnLoan.addEventListener("click", function(e){
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  const userDeposits = currentAccount.movements.some(mov => mov >= amount * 0.1)

  if(amount > 0 && userDeposits){
    //Add movement;
currentAccount.movements.push(amount);
currentAccount.movementsDates.push(new Date().toISOString());
// update UI
updateUI(currentAccount);
inputLoanAmount.value = "";
  }
})

btnClose.addEventListener("click", function(e){
  e.preventDefault();
  if(currentAccount.username === inputCloseUsername.value && currentAccount.pin ===  Number(inputClosePin.value)){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    //Delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;

btnSort.addEventListener("click", function(e){
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////

// const z = Array.from({length:100}, (_, i) => Math.trunc((Math.random()*100)+1));
// console.log(z) ;

// const titleCh = function(word){
// return word.toLowerCase().split(" ").map((w, i) => {
//    if(w.length > 1){
//    return  w.slice(0,1).toUpperCase() + w.slice(1)
//    } else{
//     return w 
//    }
//   }).join(" ");

// }
// console.log(titleCh("this is a nice title innit!"));
